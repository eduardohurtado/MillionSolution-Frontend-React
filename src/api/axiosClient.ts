import axios from "axios";
import { API_URI } from "../enums/enums";

const axiosClient = axios.create({
  baseURL: API_URI.docker, // Backend API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
