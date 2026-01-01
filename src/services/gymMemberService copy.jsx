// // src/services/gymMemberService.jsx
// import httpClient from "./index";

// const normalize = (data) =>
//   typeof data === "string" ? JSON.parse(data) : data;

// export const createGymMember = async (memberData) => {
//   try {
//     const res = await httpClient.post("/gym-members", memberData);
//     const payload = normalize(res.data);
//     return payload.data.member;
//   } catch (err) {
//     console.error(
//       "Failed to create gym member:",
//       err.response?.data?.message || err.message
//     );
//     throw err;
//   }
// };

// export const getAllMembers = async () => {
//   try {
//     const res = await httpClient.get("/gym-members");
//     const payload = normalize(res.data);
//     return payload.data.members || [];
//   } catch (err) {
//     console.error("Failed to fetch members:", err.message);
//     throw err;
//   }
// };

// src/services/gymMemberService.jsx


//=====================================================
//=====================================================
import httpClient from "./index";

const normalize = (data) =>
  typeof data === "string" ? JSON.parse(data) : data;

export const createGymMember = async (memberData) => {
  try {
    const res = await httpClient.post("/gym-members", memberData);
    const payload = normalize(res.data);

    // בדיקה אם השרת החזיר תשובת הצלחה
    if (payload.status !== "success") {
      throw new Error(payload.message || "Unknown server error");
    }

    // רק אם הצלחנו, מחזירים את הממבר
    return payload.data.member;
  } catch (err) {
    // חילוץ הודעת השגיאה האמיתית מהשרת
    const errorMsg =
      err.response?.data?.message || err.message || "Network Error";
    console.error("Failed to create gym member:", errorMsg);
    throw new Error(errorMsg); // זריקת השגיאה כדי שהקומפוננטה תציג אותה
  }
};

export const getAllMembers = async () => {
  try {
    const res = await httpClient.get("/gym-members");
    const payload = normalize(res.data);
    return payload.data?.members || [];
  } catch (err) {
    console.error("Failed to fetch members:", err.message);
    throw err;
  }
};
