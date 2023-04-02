import axios from "axios";

export const BASE_URL = process.env.BASE_URL || "http://localhost:8000/api";

axios.defaults.baseURL = BASE_URL;

export { axios };