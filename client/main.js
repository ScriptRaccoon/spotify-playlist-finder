const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("code")) {
    console.log("your code is:", urlParams.get("code"));
}
