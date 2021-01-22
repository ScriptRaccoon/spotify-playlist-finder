import { showCurrentUser } from "./user.js";
import { showPlaylists } from "./playlist.js";

$(() => {
    showCurrentUser();
});

$("#titleInput").keydown((e) => {
    if (e.key === "Enter") {
        makeRequest();
    }
});

$("#findBtn").click(makeRequest);

async function makeRequest() {
    const options = {
        title: $("#titleInput").val(),
        case: $("#caseInput").prop("checked"),
        exact: $("#exactInput").prop("checked"),
        useId: $("#useId").prop("checked"),
        id: $("#idInput").val(),
        save: $("#saveInput").prop("checked"),
    };
    disableForm();
    await showPlaylists(options);
    enableForm();
}

function disableForm() {
    $(".formControl input").prop("disabled", true).css("cursor", "not-allowed");
    $("#findBtn").prop("disabled", true).css("opacity", 0.5).css("cursor", "not-allowed");
}

function enableForm() {
    $(".formControl input").prop("disabled", false).css("cursor", "default");
    $("#findBtn").prop("disabled", false).css("opacity", 1).css("cursor", "pointer");
}

$("#useId")
    .prop("checked", false)
    .change(() => {
        $("#idContainer").slideToggle();
    });

$(".fa-question-circle").click(() => $("#saveInfo").slideToggle());

$(".fa-home").click(() => {
    sessionStorage.clear();
    window.location.href = "/";
});
