import {
  MFM_CHANNEL_ID,
  MFM_FULL_EPISODE_PLAYLIST_ID,
  TIME_IT_TAKES_TO_SUBSCRIBE_SECONDS,
} from '@mfm-agreement/core/constants';
import { createYouTubeData } from '@mfm-agreement/core/data';
import {
  getAllVideoDurations,
  getAllVideoIdsInPlaylist,
  getChannelDetails,
} from '@mfm-agreement/core/youtube-api';
import type { Duration } from 'tinyduration';
import chunk from 'lodash.chunk';
import { ScheduledHandler } from 'aws-lambda';

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

/**
 * Convert the total number of seconds to a Duration object
 * @param totalSeconds The total number of seconds
 * @returns
 */
const convertSecondsToDuration = (totalSeconds: number): Duration => {
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor(totalSeconds / (60 * 60)) - days * 24;
  const minutes = Math.floor(totalSeconds / 60) - days * 24 * 60 - hours * 60;
  const seconds =
    totalSeconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

  return { days, hours, minutes, seconds };
};

export const handler: ScheduledHandler = async () => {
  // Get the channel details
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

  const subscribers = parseInt(channelDetails.statistics.subscriberCount);

  const fanTimeSeconds = subscribers * TIME_IT_TAKES_TO_SUBSCRIBE_SECONDS;
  const fanTime = convertSecondsToDuration(fanTimeSeconds);

  const slackerType = fanTimeSeconds > totalDurationInSeconds ? 'mfm' : 'fans';

  const slackerResults =
    slackerType === 'mfm'
      ? {
          mfm: convertSecondsToDuration(
            fanTimeSeconds - totalDurationInSeconds
          ),
        }
      : {
          fans: Math.ceil(
            (totalDurationInSeconds - fanTimeSeconds) /
              TIME_IT_TAKES_TO_SUBSCRIBE_SECONDS
          ),
        };

  // Save the data to the database
  await createYouTubeData({
    channelId: MFM_CHANNEL_ID,
    date: new Date().toISOString(),
    episodes: ids.length,
    subscribers,
    contentLength: convertSecondsToDuration(totalDurationInSeconds),
    fanTime,
    slackerType,
    slackerResults,
  });
};
