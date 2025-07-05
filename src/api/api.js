import axios from "axios";

const Api = axios.create({
  baseURL: "http://192.168.100.212:3004",
  headers: {
    "Content-Type": "application/json",
  },
});

export default Api;
