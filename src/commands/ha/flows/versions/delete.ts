/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/*
 * @author Heitor Araujo
 */
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
  };

  async findAllObsoleteVersions(conn: Connection): Promise<Flow[]> {
    const result = await conn.tooling.query<Flow>(
      "SELECT Id, VersionNumber, DefinitionId, MasterLabel FROM Flow WHERE Status = 'Obsolete' ORDER BY DefinitionId DESC, VersionNumber ASC"
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

  async run(): Promise<AnyJson> {
    const conn = this.org.getConnection();

    let retry = true;
    let previousVersionsToDelete = [];
    let totalDeletedFlows = 0;

    this.ux.startSpinner('Deletion', 'Finding');
    do {
      const obsoleteFlows = await this.findAllObsoleteVersions(conn);
      const flowVersionsByDefinition = this.groupVersionsByDefinition(obsoleteFlows);
      const versionsToDelete = this.filterVersionsToDelete(flowVersionsByDefinition);
      if (totalDeletedFlows === 0) {
        totalDeletedFlows = versionsToDelete.length;
      }
      // this.ux.log(`Total versions to delete: ${versionsToDelete.length}`);
      this.ux.setSpinnerStatus('Deleting');
      try {
        await conn.tooling.destroy<Flow[]>('Flow', versionsToDelete, { allOrNone: true });
        retry = false;
      } catch (ex) {
        if (previousVersionsToDelete.length === versionsToDelete.length) {
          totalDeletedFlows -= versionsToDelete.length;
          retry = false;
        } else {
          this.ux.setSpinnerStatus('Retrying');
        }
        previousVersionsToDelete = Object.assign([], versionsToDelete);
      }
    } while (retry);

    this.ux.stopSpinner('Finished');
    this.ux.log(`Total deleted versions: ${totalDeletedFlows}`);
    this.ux.styledObject({ 'Failed Versions': previousVersionsToDelete });

    return {
      deleted: totalDeletedFlows,
      failed: previousVersionsToDelete,
    };
  }
}
