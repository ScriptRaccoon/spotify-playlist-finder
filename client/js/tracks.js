import { headers } from "./token.js";

async function getTracks(playlistId) {
    const tracks = [];
    let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    try {
        while (url) {
            const response = await fetch(url, { headers });
            const data = await response.json();
            const trackItems = data.items;
            trackItems.forEach((item) => {
                const { name, id, artists } = item.track;
                const artistNames = artists.map((x) => x.name);
                tracks.push({ name, id, artistNames });
            });
            url = data.next || null;
        }
        return tracks;
    } catch (err) {
        window.alert(err.message);
    }
}

export async function showTracks(playlistId) {
    const tracks = await getTracks(playlistId);
    console.log(tracks);
}
