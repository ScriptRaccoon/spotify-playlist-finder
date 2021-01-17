import { showCurrentUser } from "./user.js";
import { showPlaylists } from "./playlist.js";

$(() => {
    showCurrentUser();
});

$("#findBtn").click(showPlaylists);
