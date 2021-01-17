import { headers } from "./token.js";

export let user_name, user_id;

async function getCurrentUser() {
    const url = "https://api.spotify.com/v1/me";
    try {
        const response = await fetch(url, { headers });
        const data = await response.json();
        user_name = data["display_name"];
        user_id = data["id"];
        return { user_name, user_id };
    } catch (err) {
        window.alert(err.message);
        return null;
    }
}

export async function showCurrentUser() {
    await getCurrentUser();
    $("#user_name").text(user_name);
    $("#welcome").show();
    $("#findBtn").show();
}
