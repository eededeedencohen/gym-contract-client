// src/services/authService.jsx
import httpClient from "./index";

export const loginAdmin = async (username, password) => {
  try {
    // הנתיב הזה צריך להיות תואם לנתיב שיצרת בשרת
    // בשרת הגדרנו: router.post('/login', ...) בתוך gymRoutes
    // לכן הנתיב המלא הוא /gyms/login (בהנחה ש-gymRoutes תחת /gyms)
    const response = await httpClient.post("/gyms/login", {
      username,
      password,
    });

    // אם השרת מחזיר טוקן
    if (response.data.token) {
      localStorage.setItem("gym_auth_token", response.data.token);
    }

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network Error" };
  }
};

export const logoutAdmin = () => {
  localStorage.removeItem("gym_auth_token");
  window.location.href = "/login"; // רענון והעברה לדף לוגין
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("gym_auth_token");
};
