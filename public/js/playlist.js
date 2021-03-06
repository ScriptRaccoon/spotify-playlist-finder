import { user_id } from "./user.js";
import { headers } from "./token.js";
import { getTracks } from "./tracks.js";

async function getPlaylists(options) {
    if (options.save) {
        const storedPlaylists = await localforage.getItem("storedPlaylists");
        if (storedPlaylists) {
            for (const playlist of storedPlaylists) {
                const { tracks } = playlist;
                await showRelevantTracksOfPlaylist(playlist, options, tracks);
            }
        } else {
            const allPlaylists = [];
            let url = `https://api.spotify.com/v1/users/${user_id}/playlists`;
            try {
                while (url) {
                    const response = await fetch(url, { headers });
                    const data = await response.json();
                    if (data.error) {
                        throw new Error(data.error.status + ": " + data.error.message);
                    }
                    for (const playlist of data.items) {
                        const { id, name, description, external_urls } = playlist;
                        const tracks = await getTracks(id);
                        allPlaylists.push({
                            id,
                            name,
                            description,
                            external_urls,
                            tracks,
                        });
                        await showRelevantTracksOfPlaylist(playlist, options, tracks);
                    }
                    url = data.next || null;
                }
                await localforage.setItem("storedPlaylists", allPlaylists);
                $("#snapShotControls").show().css("display", "flex");
                $("#deleteBtn").show();
            } catch (err) {
                console.error(err.message);
                window.alert(err.message);
            }
        }
    } else {
        let url = `https://api.spotify.com/v1/users/${user_id}/playlists`;
        try {
            while (url) {
                const response = await fetch(url, { headers });
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error.status + ": " + data.error.message);
                }
                for (const playlist of data.items) {
                    await showRelevantTracksOfPlaylist(playlist, options);
                }
                url = data.next || null;
            }
        } catch (err) {
            console.error(err.message);
            window.alert(err.message);
        }
    }
}

async function showRelevantTracksOfPlaylist(playlist, options, tracks) {
    const { id, name, description, external_urls } = playlist;
    if (!tracks) {
        tracks = await getTracks(id);
    }
    let relevantTracks = [];
    if (options.title) {
        if (options.useId && options.id) {
            relevantTracks = tracks.filter((track) => track.id === options.id);
        } else if (options.case && options.exact) {
            relevantTracks = tracks.filter((track) => track.name === options.title);
        } else if (options.case && !options.exact) {
            relevantTracks = tracks.filter((track) => track.name.includes(options.title));
        } else if (!options.case && options.exact) {
            relevantTracks = tracks.filter(
                (track) => track.name.toLowerCase() === options.title.toLowerCase()
            );
        } else if (!options.case && !options.exact) {
            relevantTracks = tracks.filter((track) =>
                track.name.toLowerCase().includes(options.title.toLowerCase())
            );
        }
    }
    if (relevantTracks.length > 0) {
        showPlaylist({
            id,
            name,
            description,
            external_urls,
            relevantTracks,
        });
    }
}

function showPlaylist(playlist) {
    const playlistContainer = $("<div></div>")
        .attr("id", playlist.id)
        .addClass("playlistContainer")
        .appendTo("#playlists");
    const playlistHeader = $("<div></div>").appendTo(playlistContainer);
    const playlistName = $("<a></a>")
        .addClass("playlistName")
        .html(playlist.name)
        .attr("target", "_blank")
        .attr("href", playlist.external_urls.spotify)
        .appendTo(playlistHeader);
    const playlistDescription = $("<small></small>")
        .addClass("playlistDescription")
        .html(playlist.description)
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
            .html(`${artistNames} – ${track.name}`);
        $("<li></li>").append(link).addClass("trackListing").appendTo(trackContainer);
    }
}

export async function showPlaylists(options) {
    $("#playlists").html("");
    const summary = $("<div></div>").addClass("summary").appendTo("#playlists");
    const spinner = $("<div></div>").addClass("spinner").appendTo("#playlists");
    await getPlaylists(options);
    spinner.remove();
    const numberOfPlaylists = $(".playlistName").length;
    const numberOfTracks = $(".track").length;
    summary.text(
        `${numberOfTracks} tracks in ${numberOfPlaylists} playlists have been found.`
    );
}
