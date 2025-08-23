import axios from "axios";

const Api = axios.create({
  baseURL: "http://172.20.10.11:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default Api;
