import { showCurrentUser } from "./user.js";
import { showPlaylists } from "./playlist.js";

$(() => {
    showCurrentUser();
});

$("#findBtn").click(() => {
    const options = {
        title: $("#titleInput").val(),
        artist: $("#artistInput").val(),
    };
    showPlaylists(options);
});
