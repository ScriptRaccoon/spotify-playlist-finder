const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");
export const headers = {
    Authorization: `Bearer ${token}`,
};
