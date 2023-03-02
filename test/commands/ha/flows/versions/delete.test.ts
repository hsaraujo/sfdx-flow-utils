/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { expect, test } from '@salesforce/command/lib/test';
import { ensureJsonMap, ensureString } from '@salesforce/ts-types';
import { Result } from '../../../../../src/commands/ha/flows/versions/delete';

describe('ha:flows:versions:delete', () => {
  test
    .withOrg({ username: 'test@org.com' }, true)
    .withConnectionRequest((request) => {
      const requestMap = ensureJsonMap(request);
      const url = ensureString(requestMap.url);
      if (url.indexOf('/tooling/query?q=') !== -1) {
        return Promise.resolve({
          records: [
            {
              Id: '301000000000001',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000002',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000003',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000004',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
          ],
        });
      } else if(url.indexOf('/tooling/composite') !== -1) {
        return Promise.resolve({
          compositeResponse: [{
            body: {
              message: 'Error'
            },
            httpStatusCode: 400,
            referenceId: '301000000000003'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000004'
          }]
        })
      }
      return Promise.resolve({ records: [] });
    })
    .stdout()
    .command(['ha:flows:versions:delete', '--targetusername', 'test@org.com', '-k', '2', '--json'])
    .it('runs ha:flows:versions:delete --targetusername test@org.com -k 2 --json', (ctx) => {
        const result = JSON.parse(ctx.stdout)['result'] as Result;
        expect(result.succeed).to.equal(1);
        expect(result.failed).to.equal(1);
        expect(result.detail.length).to.equal(2);
    });
});
