// import { Axios } from "axios";
// import { DOMAIN } from "../constants";

// const httpClient = new Axios({
//   baseURL: DOMAIN + "/api/v1/",
// });

// export default httpClient;
// src/services/index.jsx
import axios from "axios";
import { DOMAIN } from "../constants";

const httpClient = axios.create({
  baseURL: `${DOMAIN}/api/v1`,
});

// --- הוספת Interceptor (מיירט) ---
// פונקציה זו רצה לפני כל בקשה שיוצאת מהדפדפן
httpClient.interceptors.request.use(
  (config) => {
    // שליפת הטוקן מהזיכרון המקומי
    const token = localStorage.getItem("gym_auth_token");

    // אם יש טוקן, מוסיפים אותו לכותרת Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- הוספת Interceptor לתגובות (טיפול בשגיאות אבטחה) ---
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // אם השרת מחזיר 401 (לא מורשה), נמחק את הטוקן ונזרוק ללוגין
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("gym_auth_token");
      // אופציונלי: כאן אפשר לעשות reload או הפניה, אבל עדיף לטפל בזה בקומפוננטות
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default httpClient;
