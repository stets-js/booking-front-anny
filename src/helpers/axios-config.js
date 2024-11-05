import axios from "axios";


axios.defaults.baseURL = "https://tomato-app-uht7j.ondigitalocean.app";
axios.defaults.headers.common["Accept"] = "application/json";

axios.interceptors.request.use(
    config => {
      const bookingToken = localStorage.getItem('booking-service');
      
      if (bookingToken) {
        config.headers['Authorization'] = `Bearer ${bookingToken}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  
  axios.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('booking-service');
      }
  
      return Promise.reject(error);
    }
  );

export default axios;
