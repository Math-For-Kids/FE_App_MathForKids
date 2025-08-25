import axios from "axios";

const Api = axios.create({
  baseURL: "http://192.168.1.4:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default Api;
