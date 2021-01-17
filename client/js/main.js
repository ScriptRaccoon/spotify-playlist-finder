import { showCurrentUser } from "./user.js";
import { showPlaylists } from "./playlist.js";

$(() => {
    showCurrentUser();
});

$("#findBtn").click(() => {
    const options = {
        title: $("#titleInput").val(),
        case: $("#caseInput").prop("checked"),
        exact: $("#exactInput").prop("checked"),
    };
    showPlaylists(options);
});
