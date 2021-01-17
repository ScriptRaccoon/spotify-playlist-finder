import { user_id } from "./user.js";
import { headers } from "./token.js";
import { showTracks } from "./tracks.js";

export let playlists = [];

async function getPlaylists() {
    let url = `https://api.spotify.com/v1/users/${user_id}/playlists`;
    try {
        while (url) {
            const response = await fetch(url, { headers });
            const data = await response.json();
            data.items.forEach((playlist) => {
                const { id, name, description } = playlist;
                playlists.push({ id, name, description });
            });
            url = data.next || null;
        }
        return playlists;
    } catch (err) {
        window.alert(err.message);
    }
}

function showPlaylist(playlist) {
    const playlistContainer = $("<div></div>")
        .attr("id", playlist.id)
        .addClass("playlistContainer")
        .click(() => showTracks(playlist.id))
        .appendTo("#playlists");
    const playlistName = $("<div></div>")
        .addClass("playlistName")
        .text(playlist.name)
        .appendTo(playlistContainer);
    const playlistDescription = $("<small></small>")
        .addClass("playlistDescription")
        .text(playlist.description)
        .appendTo(playlistContainer);
}

export async function showPlaylists() {
    await getPlaylists();
    playlists.forEach((playlist) => showPlaylist(playlist));
}
