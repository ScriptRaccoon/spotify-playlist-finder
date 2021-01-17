const urlParams = new URLSearchParams(window.location.search);
let token = urlParams.get("token");

$("#findBtn").click(() => {
    window.location.href = `/findplaylists?token=${token}`;
});

$("#userBtn").click(() => {
    getCurrentUser();
});

async function getCurrentUser() {
    console.log(token);
    const url = "https://api.spotify.com/v1/me";
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    try {
        const response = await fetch(url, headers);
        console.log(response);
    } catch (err) {
        console.log(err.message);
        return null;
    }
}
