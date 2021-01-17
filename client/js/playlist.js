import { user_id } from "./user.js";
import { headers } from "./token.js";
import { hasTrack } from "./tracks.js";

async function getPlaylists(options) {
    const playlists = [];
    let url = `https://api.spotify.com/v1/users/${user_id}/playlists`;
    try {
        while (url) {
            const response = await fetch(url, { headers });
            const data = await response.json();
            for (const playlist of data.items) {
                const { id, name, description } = playlist;
                console.log("check for playlist " + name);
                if (!options.title) {
                    console.log("add it");
                    playlists.push({ id, name, description });
                } else {
                    const hastrack = await hasTrack(id, options.title);
                    if (hastrack) {
                        console.log("add it");
                        playlists.push({ id, name, description });
                    }
                }
                // await new Promise((resolve) => setTimeout(resolve, 5000));
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

export async function showPlaylists(options) {
    $("#playlists").html("");
    const playlists = await getPlaylists(options);
    $("<div></div>")
        .text(`${playlists.length} playlists have been found`)
        .addClass("summary")
        .appendTo("#playlists");
    playlists.forEach((playlist) => showPlaylist(playlist));
}
