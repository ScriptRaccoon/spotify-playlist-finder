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
                const { id, name, description, external_urls } = playlist;
                console.log(playlist);
                let toAdd = true;
                if (options.title) {
                    const tracks = await getTracks(id);
                    if (options.case && options.exact) {
                        toAdd = tracks.some((track) => track.name === options.title);
                    } else if (options.case && !options.exact) {
                        toAdd = tracks.some((track) =>
                            track.name.includes(options.title)
                        );
                    } else if (!options.case && options.exact) {
                        toAdd = tracks.some(
                            (track) =>
                                track.name.toLowerCase() === options.title.toLowerCase()
                        );
                    } else if (!options.case && !options.exact) {
                        toAdd = tracks.some((track) =>
                            track.name.toLowerCase().includes(options.title.toLowerCase())
                        );
                    }
                }

                if (toAdd) {
                    showPlaylist(playlist);
                    playlists.push({ id, name, description, external_urls });
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
    const playlistContainer = $("<a></a>")
        .attr("id", playlist.id)
        .attr("href", playlist.external_urls.spotify)
        .attr("target", "_blank")
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
    let txt = `${playlists.length} playlists have been found`;
    if (!options.title) {
        txt += ". These are all your playlists since you didn't specify a title.";
    }
    summary.text(txt);
}
