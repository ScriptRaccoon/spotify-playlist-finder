const urlParams = new URLSearchParams(window.location.search);
const access_token = urlParams.get("access_token");
const expire_time = urlParams.get("expire_time");

export const headers = {
    Authorization: `Bearer ${access_token}`,
};

if (access_token) {
    sessionStorage.setItem("access_token", access_token);
    sessionStorage.setItem("expire_time", expire_time);
}
