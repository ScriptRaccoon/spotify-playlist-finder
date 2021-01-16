// express
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
app.use(express.static("client"));

// url

const path = require("path");

console.log(path.dirname("__"));

//spotify credentials
const credentials = require("./credentials.js");

// spotify authorization
app.get("/authorize", function (req, res) {
    const scopes = "playlist-read-private playlist-read-collaborative";
    const redirect_url = req.protocol + "://" + req.headers.host + "/callback";
    res.redirect(
        "https://accounts.spotify.com/authorize" +
            "?response_type=code" +
            "&client_id=" +
            credentials.clientID +
            (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
            "&redirect_uri=" +
            encodeURIComponent(redirect_url)
    );
});

// callback after authorization
app.get("/callback", (req, res) => {
    res.send("this is the callback site");
});
