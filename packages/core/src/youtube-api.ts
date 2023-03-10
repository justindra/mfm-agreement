import fetch from 'node-fetch';
import { Config } from 'sst/node/config';
import { parse } from 'tinyduration';

type APIResponse<TKind extends string, TItem> = {
  kind: TKind;
  etag: string;
  items: TItem[];
  pageInfo: { totalResults: number; resultsPerPage: number };
};

async function fetchYoutube<TResponse>(
  url: string,
  params: Record<string, string | number | boolean | undefined>
) {
  const searchUrl = new URL(url);
  // Set the API Key
  searchUrl.searchParams.set('key', Config.GOOGLE_API_KEY);

  // Set all the other parameters
  Object.entries(params).forEach(([key, value]) =>
    value ? searchUrl.searchParams.set(key, value.toString()) : undefined
  );
  const searchRes = await fetch(searchUrl.toString());
  return searchRes.json() as TResponse;
}

type PlaylistItem = {
  kind: 'youtube#playlistItem';
  etag: string;
  id: string;
  contentDetails: { videoId: string; videoPublishedAt: string };
  status: { privacyStatus: 'public' | 'private' | 'unlisted' };
};

type PlaylistItemResponse = APIResponse<
  'youtube#playlistItemListResponse',
  PlaylistItem
> & {
  prevPageToken?: string;
  nextPageToken?: string;
};

/**
 * Get all the video ids that is in a given playlist. Only returns the public videos.
 * @param playlistId The id of the playlist to get the videos from
 * @param pageToken The page token to get the next page of videos
 * @returns
 */
export async function getAllVideoIdsInPlaylist(
  playlistId: string,
  pageToken?: string
) {
  const searchRes = await fetchYoutube<PlaylistItemResponse>(
    'https://www.googleapis.com/youtube/v3/playlistItems',
    {
      playlistId,
      part: 'id,contentDetails,status',
      maxResults: 50,
      pageToken: pageToken,
    }
  );

  // Set the ids
  const ids = searchRes.items
    // We only count the public videos
    .filter((val) => val.status.privacyStatus === 'public')
    .map((item) => item.contentDetails.videoId);

  // If there is a next page token, then we want to get the ids from that page too
  if (searchRes.nextPageToken) {
    const nextIds = await getAllVideoIdsInPlaylist(searchRes.nextPageToken);
    ids.push(...nextIds);
  }
  // Return the ids
  return ids;
}

type VideoListItem = {
  kind: 'youtube#video';
  etag: string;
  id: string;
  contentDetails: {
    duration: string;
    dimension: '2d';
    definition: 'hd' | 'sd';
    caption: 'false' | 'true';
    licensedContent: boolean;
    contentRating: {};
    projection: 'rectangular';
  };
};

/**
 * Given a list of video ids, get the duration of each video
 * @param ids The ids of the videos to get (max 50)
 * @returns
 */
export async function getAllVideoDurations(ids: string[]) {
  const res = await fetchYoutube<
    APIResponse<'youtube#videoListResponse', VideoListItem>
  >('https://youtube.googleapis.com/youtube/v3/videos', {
    part: 'id,contentDetails',
    id: ids.join(','),
  });

  // Parse the duration and return that
  return res.items.map((item) => {
    return parse(item.contentDetails.duration);
  });
}

type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

type ChannelListItem = {
  kind: 'youtube#channel';
  etag: string;
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl: string;
    publishedAt: string;
    thumbnails: { default: Thumbnail; medium: Thumbnail; high: Thumbnail };
    localized: {
      title: string;
      description: string;
    };
    country: 'US';
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
    videoCount: string;
  };
};

/**
 * Get the details of a channel
 * @param channelId The id of the channel to get the details of
 * @returns
 */
export async function getChannelDetails(channelId: string) {
  const res = await fetchYoutube<
    APIResponse<'youtube#channelListResponse', ChannelListItem>
  >('https://youtube.googleapis.com/youtube/v3/channels', {
    part: 'id,snippet,statistics',
    id: channelId,
  });

  // Return the channel
  return res.items[0];
}
