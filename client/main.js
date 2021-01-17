const urlParams = new URLSearchParams(window.location.search);
let token = urlParams.get("token");
let display_name, id;

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
        display_name = data["display_name"];
        id = data["id"];
        $("#display_name").text(display_name);
    } catch (err) {
        window.alert(err.message);
        return null;
    }
}

$("#findBtn").click(() => {
    console.log("I will list your playlists...");
});
