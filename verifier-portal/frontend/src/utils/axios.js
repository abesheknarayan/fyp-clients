import axios from "axios";
import { config } from "../config/config";

export const axiosInstance = axios.create({
    baseURL: config.serviceBaseURL || "http://localhost:4000",
    withCredentials: true
})