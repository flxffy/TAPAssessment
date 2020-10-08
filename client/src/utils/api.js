import axios from "axios";

const api = axios.create({ baseURL: process.env.REACT_APP_BACKEND_URL });

const fetchUsers = (params) => api.get("/users", { params });

export { fetchUsers };
