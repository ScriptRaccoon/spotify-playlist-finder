const urlParams = new URLSearchParams(window.location.search);
let token = urlParams.get("token");
let user_name, user_id;

getCurrentUser();

async function getCurrentUser() {
    if (!token) return;
    const url = "https://api.spotify.com/v1/me";
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    try {
        const response = await fetch(url, { method: "GET", headers: headers });
        const data = await response.json();
        user_name = data["display_name"];
        user_id = data["id"];
        $("#user_name").text(user_name);
    } catch (err) {
        window.alert(err.message);
        return null;
    }
}

$("#findBtn").click(async () => {
    if (!token || !user_id) return;
    console.log("I will list your playlists...");
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    let url = `https://api.spotify.com/v1/users/${user_id}/playlists`;
    try {
        while (url) {
            const response = await fetch(url, { method: "GET", headers: headers });
            const data = await response.json();
            data.items.forEach((playlist) => {
                console.log(playlist);
                const playlistContainer = $("<div></div>")
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
            });
            url = data.next || null;
        }
    } catch (err) {
        window.alert(err.message);
    }
});
