$("#authBtn").click(() => {
    window.location.href = "/authorize";
});

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("error")) {
    $("#errorMessage").show().append(urlParams.get("error"));
}
