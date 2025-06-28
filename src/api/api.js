import axios from "axios";

const Api = axios.create({
  baseURL: "http://10.10.34.225:3002",
  headers: {
    "Content-Type": "application/json",
  },
});

export default Api;
