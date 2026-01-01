import httpClient from "./index";

const normalize = (data) =>
  typeof data === "string" ? JSON.parse(data) : data;

export const getAllMembers = async () => {
  try {
    const res = await httpClient.get("/gyms");
    const payload = normalize(res.data);
    return payload.data.gyms || [];
  } catch (err) {
    console.error("Failed to fetch members:", err.message);
    throw err;
  }
};

export const createMember = async (memberData) => {
  try {
    const res = await httpClient.post("/gyms", JSON.stringify(memberData), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const payload = normalize(res.data);
    return payload.data.gym;
  } catch (err) {
    console.error("Failed to create member:", err.message);
    throw err;
  }
};

export const updateMember = async (memberID, updateData) => {
  try {
    const res = await httpClient.patch(
      `/gyms/${memberID}`,
      JSON.stringify(updateData),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const payload = normalize(res.data);
    return payload.data.gym;
  } catch (err) {
    console.error("Failed to update member:", err.message);
    throw err;
  }
};

export const deleteMember = async (memberID) => {
  try {
    await httpClient.delete(`/gyms/${memberID}`);
    // 204 No Content - no JSON response
    return { success: true };
  } catch (err) {
    console.error("Failed to delete member:", err.message);
    throw err;
  }
};

export const uploadSignatureImage = async (imageBlob, fileName) => {
  try {
    const formData = new FormData();
    formData.append("image", imageBlob, fileName);

    const res = await httpClient.post("/gyms/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const payload = normalize(res.data);
    return payload.data;
  } catch (err) {
    console.error("Failed to upload image:", err.message);
    throw err;
  }
};

export const checkSignatureExists = async (memberID) => {
  try {
    const res = await httpClient.get(`/gyms/image/${memberID}`);

    // בדיקת סטטוס התגובה
    if (res.status === 200) {
      return {
        exists: true,
        imageUrl: `${httpClient.defaults.baseURL}gyms/image/${memberID}`,
      };
    } else if (res.status === 404) {
      return { exists: false };
    } else {
      return { exists: false };
    }
  } catch (err) {
    // אם נכשל (404 וכו'), החתימה לא קיימת
    console.log("Signature check error:", err.message);
    return { exists: false };
  }
};
