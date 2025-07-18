import axios from "axios";

const Api = axios.create({
  baseURL: "http://10.64.229.44:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default Api;
