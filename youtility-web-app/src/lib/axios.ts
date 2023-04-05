import axios from "axios";

export const BASE_URL = process.env.BASE_URL || "http://youtility-api.azurewebsites.net";

axios.defaults.baseURL = BASE_URL;

export { axios };