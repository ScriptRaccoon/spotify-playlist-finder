import { headers } from "./token.js";

const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getTracks(playlistId) {
    const tracks = [];
    let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    try {
        while (url) {
            const response = await fetch(url, { headers });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error.status + ": " + data.error.message);
            }
            const trackItems = data.items;
            trackItems.forEach((item) => {
                if (item.track) {
                    const { name, id, artists, external_urls } = item.track;
                    tracks.push({ name, id, artists, external_urls });
                }
            });
            url = data.next || null;
        }
        return tracks;
    } catch (err) {
        console.error(err.message);
        window.alert(err.message);
        return [];
    }
}
