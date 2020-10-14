const baseURL = "http://localhost:3100/api";

const Endpoints = {
    search: query => baseURL + "/search?query=" + query
}

export default Endpoints;
