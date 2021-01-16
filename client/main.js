const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("token")) {
    console.log("your token is:", urlParams.get("token"));
}
