/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { expect, test } from '@salesforce/command/lib/test';
import { ensureJsonMap, ensureString } from '@salesforce/ts-types';
import { Result } from '../../../../../src/commands/ha/flows/versions/delete';

describe('Runs deletion keeping 2 versions per Flow Definition', () => {
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

describe('Deletes more than 25 flows', () => {
  let compositeCallsCount = 0;
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
            {
              Id: '301000000000005',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000006',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000007',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000008',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000009',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000010',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000011',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000012',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000013',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000014',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000015',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000016',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000017',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000018',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000019',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000020',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000021',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000022',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000023',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000024',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000025',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000026',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000027',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000028',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000029',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
            {
              Id: '301000000000030',
              DefinitionId: '300000000000001',
              Status: 'Obsolete',
            },
          ],
        });
      } else if(url.indexOf('/tooling/composite') !== -1 && compositeCallsCount === 0) {
        compositeCallsCount++;
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
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000005'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000006'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000007'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000008'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000009'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000010'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000011'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000012'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000013'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000014'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000015'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000016'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000017'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000018'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000019'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000020'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000021'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000022'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000023'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000024'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000025'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000026'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000027'
          }]
        })
      } else if(url.indexOf('/tooling/composite') !== -1 && compositeCallsCount === 1) {
        return Promise.resolve({
          compositeResponse: [{
            body: {
              message: 'Error'
            },
            httpStatusCode: 400,
            referenceId: '301000000000028'
          },{
            body: {
              message: 'Success'
            },
            httpStatusCode: 200,
            referenceId: '301000000000029'
          }
          ,{
            body: {
              message: 'Error'
            },
            httpStatusCode: 400,
            referenceId: '301000000000030'
          }
        ]});
      }
      return Promise.resolve({ records: [] });
    })
    .stdout()
    .command(['ha:flows:versions:delete', '--targetusername', 'test@org.com', '-k', '2', '--json'])
    .it('runs ha:flows:versions:delete --targetusername test@org.com -k 2 --json', (ctx) => {
        const result = JSON.parse(ctx.stdout)['result'] as Result;
        expect(result.succeed).to.equal(25);
        expect(result.failed).to.equal(3);
        expect(result.detail.length).to.equal(28);
    });
});
