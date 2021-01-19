const access_token = sessionStorage.getItem("access_token");
const expire_time = parseInt(sessionStorage.getItem("expire_time"));

const now = new Date().getTime();

if (access_token && expire_time && now < expire_time - 5 * 60 * 1000) {
    document.getElementById("authForm").innerHTML =
        "You are already authenticated and will be redirected in 5 seconds.";
    setTimeout(() => {
        window.location.href = `/finder.html?access_token=${access_token}&expire_time=${expire_time}`;
    }, 5000);
}
