import { Entity, EntityItem } from 'electrodb';
import { AUDIT_FIELDS, Dynamo } from './dynamo';

const duration = {
  type: 'map',
  properties: {
    days: { type: 'number' },
    hours: { type: 'number' },
    minutes: { type: 'number' },
    seconds: { type: 'number' },
  },
} as const;

export const YouTubeDataEntity = new Entity(
  {
    model: {
      version: '1',
      entity: 'data',
      service: 'mfm',
    },
    attributes: {
      ...AUDIT_FIELDS,
      channelId: { type: 'string', required: true },
      date: { type: 'string', required: true },
      episodes: { type: 'number' },
      subscribers: { type: 'number' },
      contentLength: duration,
      fanTime: duration,
      slackerType: {
        type: ['mfm', 'fans'],
        required: true,
      },
      slackerResults: {
        type: 'map',
        properties: {
          fans: { type: 'number' },
          mfm: duration,
        },
      },
    },
    indexes: {
      dataByDate: {
        pk: { field: 'pk', composite: ['channelId'] },
        sk: { field: 'sk', composite: ['date'] },
      },
    },
  },
  Dynamo.Configuration
);

export type Info = EntityItem<typeof YouTubeDataEntity>;

export type CreateYouTubeDataParams = Info;

/**
 * Create a new data point in the system.
 * @param params The data point to add to the system
 * @returns
 */
export async function createYouTubeData(params: CreateYouTubeDataParams) {
  const data = (await YouTubeDataEntity.create(params).go()).data;
  return data;
}

export async function getLatestYouTubeData(channelId: string) {
  const data = (
    await YouTubeDataEntity.query
      .dataByDate({ channelId })
      .go({ limit: 1, order: 'desc' })
  ).data;

  return data[0];
}
