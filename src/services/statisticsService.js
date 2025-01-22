// services/statisticservice.js
import axios from "axios";

let API_URL = process.env.VUE_APP_API_URL;
console.log("API_URL:", API_URL);
API_URL = API_URL + "/statistics";

export async function getAllStatistics() {
  try {
    const response = await axios.get(API_URL);
    if (response.data.status) {
      return {
        status: response.data.status,
        msg: response.data.msg,
        data: response.data.data,
      };
    } else {
      return {
        status: false,
        msg: response.data.msg || "Error fetching statistics",
      };
    }
  } catch (error) {
    return {
      status: false,
      msg: "Error fetching statistics",
      error: error.message,
    };
  }
}
