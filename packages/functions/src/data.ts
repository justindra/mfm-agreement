import { ApiHandler } from 'sst/node/api';
import { Time } from '@mfm-agreement/core/time';
import {
  getAllVideoDurations,
  getAllVideoIdsInPlaylist,
  getChannelDetails,
} from '@mfm-agreement/core/youtube-api';
import type { Duration } from 'tinyduration';
import chunk from 'lodash.chunk';

const MFM_CHANNEL_ID = 'UCyaN6mg5u8Cjy2ZI4ikWaug';
const MFM_FULL_EPISODE_PLAYLIST_ID = 'PLWloxQyF_2n4aCanY4Y45HLTY2zoeZF8U';
const TIME_IT_TAKES_TO_SUBSCRIBE_SECONDS = 12;

/**
 * Calculate the total duration in seconds from a list of durations
 * @param durations List of durations to sum up
 * @returns
 */
function calculateTotalDurationInSeconds(durations: Duration[]) {
  const total = durations.reduce(
    (acc, val) =>
      acc +
      (val?.hours || 0) * 60 * 60 +
      (val?.minutes || 0) * 60 +
      (val?.seconds || 0),
    0
  );
  return total;
}

export const handler = ApiHandler(async (_evt) => {
  const channelDetails = await getChannelDetails(MFM_CHANNEL_ID);

  // Get the list of podcast ids
  const ids = await getAllVideoIdsInPlaylist(MFM_FULL_EPISODE_PLAYLIST_ID);
  console.log(`Found ${ids.length} episodes`);

  // Video list can only do a max of 50 ids at a time, so make sure we chunk it
  const chunks = chunk(ids, 50);

  const durations = (
    await Promise.all(chunks.map(async (chunk) => getAllVideoDurations(chunk)))
  ).reduce((acc, val) => acc.concat(val), []);

  const totalDurationInSeconds = calculateTotalDurationInSeconds(durations);

  console.log(`Total duration: ${totalDurationInSeconds} seconds`);
  console.log(
    `Total followers required: ${
      totalDurationInSeconds / TIME_IT_TAKES_TO_SUBSCRIBE_SECONDS
    } followers`
  );

  console.log(
    `Total subscribers: ${channelDetails.statistics.subscriberCount}`
  );

  return {
    body: `Hello world. The time is ${Time.now()}`,
  };
});
