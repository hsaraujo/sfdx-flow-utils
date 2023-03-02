/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/*
 * @author Heitor Araujo
 */
import * as util from 'util';
import { SfdxCommand, flags } from '@salesforce/command';
import { Connection, Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-flow-utils', 'delete');

interface Flow {
  DefinitionId: string;
  Status: string;
  VersionNumber: number;
  MasterLabel: string;
  Id: string;
}

export type Result = {
  succeed: number;
  failed: number;
  detail: DeletionResponse[];
};

type CompositeRequest = {
  method: string;
  referenceId: string;
  url: string;
}

type CompositeBody = {
  allOrNone: boolean;
  compositeRequest: CompositeRequest[];
}

type CompositeResponse = {
  compositeResponse: CompositeSingleResponse[];
}

type CompositeSingleResponse = {

  body: ErrorBody | string;
  httpHeaders: unknown;
  httpStatusCode: number;
  referenceId: string;

}

type ErrorBody = {
  message: string;
  errorCode: string;
  fields: unknown;
}

type DeletionResponse = {
  id: string;
  success: boolean;
  errorMessage: string;
}

export default class Delete extends SfdxCommand {
  protected static requiresUsername = true;
  protected static requiresProject = false;

  protected static flagsConfig = {
    keep: flags.integer({
      char: 'k',
      description: messages.getMessage('keepFlagDescription'),
      default: 0,
      required: true,
    }),
    ignore: flags.array({
      char: 'i',
      description: messages.getMessage('ignoreFlagDescription'),
      default: [],
      required: false,
    }),
  };

  async run(): Promise<Result> {
    const conn = this.org.getConnection();

    this.ux.startSpinner('Deletion', 'Finding');
    const obsoleteFlows = await this.findAllObsoleteVersions(conn);
    const flowVersionsByDefinition = this.groupVersionsByDefinition(obsoleteFlows);
    const versionsToDelete = this.filterVersionsToDelete(flowVersionsByDefinition);
    this.ux.setSpinnerStatus('Deleting');
    const CHUNK_SIZE = 25;
    const result = [] as DeletionResponse[];
    for (let i = 0; i <= versionsToDelete.length; i += CHUNK_SIZE) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(versionsToDelete.length - start, CHUNK_SIZE) + start;
      const subset = versionsToDelete.slice(start, end);
      const responses = await this.runDeletions(subset, conn);
      result.push(...responses);
    }

    this.ux.stopSpinner('Finished');

    return Promise.resolve({
      succeed: result.filter((item) => { return item.success }).length,
      failed: result.filter((item) => { return !item.success }).length,
      detail: result
    });
  }

  async findAllObsoleteVersions(conn: Connection): Promise<Flow[]> {
    let query = 'SELECT Id, VersionNumber, DefinitionId, MasterLabel FROM Flow WHERE Status = \'Obsolete\' %s ORDER BY DefinitionId DESC, VersionNumber ASC';
    let ignoreNameCondition = '';
    if (this.flags.ignore && this.flags.ignore.length > 0) {
      ignoreNameCondition = `AND Definition.DeveloperName NOT IN ('${this.flags.ignore.join('\', \'')}')`;
    }
    query = util.format(query, ignoreNameCondition);

    const result = await conn.tooling.query<Flow>(
      query
    );

    if (!result.records || result.records.length <= 0) {
      throw new SfdxError('No Obsolete flows found');
    }

    // this.ux.log(`Total Obsolete versions: ${result.records.length}`);

    return result.records;
  }

  groupVersionsByDefinition(flows: Flow[]): AnyJson {
    const flowVersionsByDefinition = {};
    let definitionId = '';
    for (const flow of flows) {
      if (definitionId !== flow.DefinitionId) {
        definitionId = flow.DefinitionId;
        flowVersionsByDefinition[definitionId] = [];
      }
      flowVersionsByDefinition[definitionId].push(flow);
    }

    return flowVersionsByDefinition;
  }

  filterVersionsToDelete(flowVersionsByDefinition: any): string[] {
    const versionsToDelete = [];
    for (const definition in flowVersionsByDefinition) {
      const flows: [] = flowVersionsByDefinition[definition];

      if (flows.length <= this.flags.keep) {
        continue;
      }
      for (let i = 0; i < flows.length - this.flags.keep; i++) {
        versionsToDelete.push(flows[i]['Id']);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return versionsToDelete;
  }

  async runDeletions(versionsToDelete: string[], conn: Connection): Promise<DeletionResponse[]> {
    try {
      const resp = await conn.tooling.request<CompositeResponse>({
        method: 'POST',
        url: '/services/data/v56.0/tooling/composite',
        body: JSON.stringify(this.buildCompositeApiBody(versionsToDelete))
      });
      const deletionResponse = [] as  DeletionResponse[];
      for(const singleResp of resp.compositeResponse){
        deletionResponse.push(
          {
            id: singleResp.referenceId,
            success: singleResp.httpStatusCode < 300 && singleResp.httpStatusCode >= 200,
            errorMessage: (singleResp.body as ErrorBody).message || singleResp.body as string
          }
        )
      }
      return Promise.resolve(deletionResponse);
      // await conn.tooling.delete<Flow[]>('Flow', versionsToDelete, { allOrNone: false });
    } catch (ex) {
      throw new SfdxError(ex);
    }
  }

  buildCompositeApiBody(versionsToDelete: string[]): CompositeBody{
    
    const compositeRequests = [] as CompositeRequest[];
    for (const versionId of versionsToDelete) {
      compositeRequests.push({
        method: 'DELETE',
        referenceId: versionId,
        url: `/services/data/v56.0/tooling/sobjects/flow/${versionId}`
      });
    }

    return {
      allOrNone: false,
      compositeRequest: compositeRequests
    }
  }
}
