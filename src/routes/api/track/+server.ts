
import { error, json } from "@sveltejs/kit";
import { LASTFM_API_KEY } from "$env/static/private";

export const GET = async ({ url }) => {
  try {
    const mbid = url.searchParams.get("mbid");
    if (!mbid) {
      throw error(400, "Missing required parameter: mbid");
    }

    const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LASTFM_API_KEY}&mbid=${mbid}&format=json`;
    const res = await fetch(apiUrl);

    if (!res.ok) {
      throw error(res.status, "Failed to fetch track info from Last.fm");
    }

    const data = await res.json();

    if (!data.track) {
      throw error(404, "Track not found");
    }

    return json(
      data,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (err) {
    console.error(err);
    throw error(500, "Internal Server Error");
  }
};
