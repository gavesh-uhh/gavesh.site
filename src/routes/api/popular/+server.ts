import { error, json } from "@sveltejs/kit";
import { LASTFM_API_KEY, LASTFM_API_USERNAME } from "$env/static/private";

export const GET = async () => {
  try {
    const tracks = await getTopTracks();
    if (
      !tracks || !tracks.toptracks || !tracks.toptracks.track ||
      tracks.toptracks.track.length === 0
    ) {
      throw error(404, "Data missing: No recent tracks found.");
    }

    const popularTracks = await Promise.all(
      tracks.toptracks.track.map(async (track: any) => ({
        track: trimTrack(track.name),
        artist: trimArtist(track.artist.name),
        image: await fetchTrackImage(track.mbid),
      }))
    );

    return json(
      {
        tracks: popularTracks,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    );
  } catch (err) {
    console.error(err);
    throw error(500, "Internal Server Error");
  }
};

const trimTrack = (fullStr: string) => {
  const cleanedString = fullStr.replace(/\s*\(.*?\)\s*/g, " ").trim();
  return cleanedString.length > 25
    ? cleanedString.split("-")[0]
    : cleanedString;
};

const trimArtist = (fullStr: string) => {
  return fullStr.replace(/\s{2,}/g, " ");
};

const fetchTrackImage = async (mbid: string) => {
  if (!mbid) return null;
  try {
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&mbid=${mbid}&api_key=${LASTFM_API_KEY}&format=json`
    );
    const data = await response.json();
    return data.track?.album?.image?.[2]?.["#text"] || null;
  } catch (error) {
    console.error("Error fetching track image:", error);
    return null;
  }
};

const getTopTracks = async () => {
  let callBackUrl =
    `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${LASTFM_API_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&period=1month `;
  const data = await fetch(callBackUrl);
  const response = await data.json();
  return response;
};
