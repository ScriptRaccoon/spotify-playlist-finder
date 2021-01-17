import { user_id } from "./user.js";
import { headers } from "./token.js";
import { getTracks } from "./tracks.js";

async function getPlaylists(options) {
    const playlists = [];
    let url = `https://api.spotify.com/v1/users/${user_id}/playlists`;
    try {
        while (url) {
            const response = await fetch(url, { headers });
            const data = await response.json();
            for (const playlist of data.items) {
                const { id, name, description } = playlist;
                if (!options.title) {
                    playlists.push({ id, name, description });
                } else {
                    const tracks = await getTracks(id);
                    const hasTrack = tracks.some((track) => track.name === options.title);
                    if (hasTrack) {
                        playlists.push({ id, name, description });
                    }
                }
            }
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

export async function showPlaylists(options) {
    $("#playlists").html("");
    const summary = $("<div></div>")
        .text(`Loading...`)
        .addClass("summary")
        .appendTo("#playlists");
    const playlists = await getPlaylists(options);
    summary.text(`${playlists.length} playlists have been found`);
    playlists.forEach((playlist) => showPlaylist(playlist));
}
