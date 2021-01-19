const urlParams = new URLSearchParams(window.location.search);
const access_token = urlParams.get("access_token");
const refresh_token = urlParams.get("refresh_token");
const expires_in = urlParams.get("expires_in");
export const headers = {
    Authorization: `Bearer ${access_token}`,
};

if (expires_in && refresh_token) {
    setTimeout(() => {
        window.alert("A new access token has to be generated");
        window.location.href = `/newtoken?token=${refresh_token}`;
    }, 1000 * parseInt(expires_in));
}
