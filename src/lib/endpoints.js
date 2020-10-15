const baseURL = "http://localhost:3100/api";

const Endpoints = {
    search: query => baseURL + "/search?query=" + query,
    signIn: baseURL + "/google-signin",

    syncUp: baseURL + "/sync-up",
    syncDown: baseURL + "/sync-down",
}

export default Endpoints;
