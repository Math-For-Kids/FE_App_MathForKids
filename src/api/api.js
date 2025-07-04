import axios from "axios";

const Api = axios.create({
  baseURL: "http://10.66.186.5:3004",
  headers: {
    "Content-Type": "application/json",
  },
});

export default Api;
