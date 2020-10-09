import axios from "axios";

const api = axios.create({ baseURL: process.env.REACT_APP_BACKEND_URL });

const fetchUsers = (params) => api.get("/users", { params });

const uploadUsers = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/users/upload", formData);
};

const createUser = (body) => api.post("/users/new", body);

export { fetchUsers, uploadUsers, createUser };
