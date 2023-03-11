import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Attribute, EntityConfiguration } from 'electrodb';
import { Table } from 'sst/node/table';

export const Client = new DynamoDBClient({
  region: process.env.MODE === 'test' ? 'ap-southeast-2' : undefined,
});

export const Configuration: EntityConfiguration = {
  table: Table.table.tableName,
  client: Client,
};

export const AUDIT_FIELDS: Record<string, Attribute> = {
  createdAt: {
    type: 'string',
    set: () => new Date().toISOString(),
    readOnly: true,
  },
  updatedAt: {
    type: 'string',
    watch: '*',
    set: () => new Date().toISOString(),
    readOnly: true,
  },
};

export * as Dynamo from './dynamo';
