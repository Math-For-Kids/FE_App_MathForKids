import axios from "axios";

const Api = axios.create({
  baseURL: "http://10.64.229.83:3009",
  headers: {
    "Content-Type": "application/json",
  },
});

export default Api;
