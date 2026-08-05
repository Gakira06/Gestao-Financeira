import axios from "axios";

export const api = axios.create({
  baseURL: "https://api-financas-xh9b.onrender.com",
});
