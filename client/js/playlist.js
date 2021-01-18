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
                let toAdd = true;
                let relevantTracks = [];
                if (options.title) {
                    const tracks = await getTracks(id);
                    if (options.case && options.exact) {
                        relevantTracks = tracks.filter(
                            (track) => track.name === options.title
                        );
                    } else if (options.case && !options.exact) {
                        relevantTracks = tracks.filter((track) =>
                            track.name.includes(options.title)
                        );
                    } else if (!options.case && options.exact) {
                        relevantTracks = tracks.filter(
                            (track) =>
                                track.name.toLowerCase() === options.title.toLowerCase()
                        );
                    } else if (!options.case && !options.exact) {
                        relevantTracks = tracks.filter((track) =>
                            track.name.toLowerCase().includes(options.title.toLowerCase())
                        );
                    }
                    toAdd = relevantTracks.length > 0;
                }

                if (toAdd) {
                    showPlaylist({
                        id,
                        name,
                        description,
                        external_urls,
                        relevantTracks,
                    });
                    playlists.push({
                        id,
                        name,
                        description,
                        external_urls,
                        relevantTracks,
                    });
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
    const playlistName = $("<a></a>")
        .addClass("playlistName")
        .text(playlist.name)
        .attr("target", "_blank")
        .attr("href", playlist.external_urls.spotify)
        .appendTo(playlistContainer);
    const playlistDescription = $("<small></small>")
        .addClass("playlistDescription")
        .text(playlist.description)
        .appendTo(playlistContainer);
    const trackContainer = $("<ul></ul>")
        .addClass("trackContainer")
        .appendTo(playlistContainer);
    for (const track of playlist.relevantTracks) {
        const artistNames = track.artists.map((x) => x.name).join(", ");
        const link = $("<a></a>")
            .addClass("track")
            .attr("target", "_blank")
            .attr("href", track.external_urls.spotify)
            .text(`${artistNames} – ${track.name}`);
        $("<li></li>").append(link).appendTo(trackContainer);
    }
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
        txt += ". These are all of your playlists since you didn't specify a song title.";
    }
    summary.text(txt);
    return playlists;
}
