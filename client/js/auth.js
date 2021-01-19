const storedToken = sessionStorage.getItem("access_token");

if (storedToken) {
    window.location.href = `/finder.html?access_token=${storedToken}`;
}
