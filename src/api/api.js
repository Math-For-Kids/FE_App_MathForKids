import axios from "axios";

const Api = axios.create({
  baseURL: "http://192.168.2.10:3009",
  headers: {
    "Content-Type": "application/json",
  },
});

export default Api;
