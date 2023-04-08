import axios from "axios";

export const BASE_URL = process.env.BASE_URL || "https://youtility-app.azurewebsites.net";

axios.defaults.baseURL = BASE_URL;

export { axios };