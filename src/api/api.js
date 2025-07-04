import axios from "axios";

const Api = axios.create({
  baseURL: "http://10.66.185.240:3002",
  headers: {
    "Content-Type": "application/json",
  },
});

export default Api;
