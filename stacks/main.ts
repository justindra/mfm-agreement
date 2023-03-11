import { StackContext, Table, Cron, AstroSite } from 'sst/constructs';
import { Config } from 'sst/constructs';
import {
  getRemovalPolicy,
  getWebDomain,
  HOSTED_ZONE,
  isProduction,
} from './utils';

export function Main({ app, stack }: StackContext) {
  const google = Config.Secret.create(stack, 'GOOGLE_API_KEY');

  const table = new Table(stack, 'table', {
    fields: {
      pk: 'string',
      sk: 'string',
      gsi1pk: 'string',
      gsi1sk: 'string',
      gsi2pk: 'string',
      gsi2sk: 'string',
    },
    primaryIndex: {
      partitionKey: 'pk',
      sortKey: 'sk',
    },
    globalIndexes: {
      gsi1: {
        partitionKey: 'gsi1pk',
        sortKey: 'gsi1sk',
      },
      gsi2: {
        partitionKey: 'gsi2pk',
        sortKey: 'gsi2sk',
      },
    },
    cdk: {
      table: { removalPolicy: getRemovalPolicy(app) },
    },
  });

  const site = new AstroSite(stack, 'site', {
    path: 'apps/web/',
    customDomain: {
      hostedZone: HOSTED_ZONE,
      domainName: getWebDomain(app),
    },
    bind: [table],
  });

  new Cron(stack, 'cron', {
    schedule: 'rate(1 day)',
    job: {
      function: {
        handler: 'packages/functions/src/cron.handler',
        bind: [table, google.GOOGLE_API_KEY],
      },
    },
    enabled: isProduction(app.stage),
  });

  stack.addOutputs({
    URL: site.url || 'localhost',
  });
}
