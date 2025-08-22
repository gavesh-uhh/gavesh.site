
import { error, json } from "@sveltejs/kit";
import { LASTFM_API_KEY } from "$env/static/private";

export const GET = async ({ url }) => {
  try {
    const mbid = url.searchParams.get("mbid");
    if (!mbid) {
      throw error(400, "Missing required parameter: mbid");
    }
    const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&mbid=${mbid}&api_key=${LASTFM_API_KEY}&format=json`;
    const res = await fetch(apiUrl);

   

    const data = await res.json();

    if (!data.artist) {
      throw error(404, "Artist not found");
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
