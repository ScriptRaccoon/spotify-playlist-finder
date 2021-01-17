const urlParams = new URLSearchParams(window.location.search);
let token = urlParams.get("token");

$("#findBtn").click(() => {
    window.location.href = `/findplaylists?token=${token}`;
});
