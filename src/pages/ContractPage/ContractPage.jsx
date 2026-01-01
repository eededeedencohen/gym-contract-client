// src/pages/ContractPage/ContractPage.jsx
import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import useGymMembers from "../../hooks/useGymMembers";
import {
  uploadSignatureImage,
  checkSignatureExists,
} from "../../services/gymMemberService";
import styles from "./ContractPage.module.css";

const ContractPage = () => {
  const { loading, members, addMember, editMember, removeMember } =
    useGymMembers();
  const [selectedMember, setSelectedMember] = useState(null);
  const [contractData, setContractData] = useState(null);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [showEditMemberForm, setShowEditMemberForm] = useState(false);
  const [editMemberData, setEditMemberData] = useState({ memberName: "" });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadedImagePath, setUploadedImagePath] = useState(null);
  const [existingSignature, setExistingSignature] = useState(null);
  const [isCheckingSignature, setIsCheckingSignature] = useState(false);
  const signatureRef = useRef(null);

  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    monthlyFee: "",
    paymentMethod: "cash",
    notes: "",
    memberName: "",
    memberID: "",
  });

  const [newMemberData, setNewMemberData] = useState({
    memberName: "",
    memberID: "",
  });

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
  };

  const handleNewMemberChange = (e) => {
    const { name, value } = e.target;
    setNewMemberData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNewMember = async () => {
    if (!newMemberData.memberName || !newMemberData.memberID) {
      alert("נא למלא את כל השדות");
      return;
    }

    try {
      const createdMember = await addMember(newMemberData);
      alert("חבר מועדון נוסף בהצלחה!");
      setNewMemberData({ memberName: "", memberID: "" });
      setShowAddMemberForm(false);
      setSelectedMember(createdMember);
    } catch (err) {
      alert("שגיאה בהוספת חבר מועדון: " + err.message);
    }
  };

  const handleEditMemberChange = (e) => {
    setEditMemberData({ memberName: e.target.value });
  };

  const handleStartEdit = () => {
    setEditMemberData({ memberName: selectedMember.memberName });
    setShowEditMemberForm(true);
  };

  const handleUpdateMember = async () => {
    if (!editMemberData.memberName.trim()) {
      alert("נא להזין שם");
      return;
    }

    try {
      const updatedMember = await editMember(
        selectedMember.memberID,
        editMemberData
      );
      alert("חבר מועדון עודכן בהצלחה!");
      setSelectedMember(updatedMember);
      setShowEditMemberForm(false);
      setEditMemberData({ memberName: "" });
    } catch (err) {
      alert("שגיאה בעדכון חבר מועדון: " + err.message);
    }
  };

  const handleDeleteMember = async (memberID) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את חבר המועדון?")) {
      return;
    }

    try {
      await removeMember(memberID);
      alert("חבר מועדון נמחק בהצלחה!");
      if (selectedMember?.memberID === memberID) {
        setSelectedMember(null);
      }
    } catch (err) {
      alert("שגיאה במחיקת חבר מועדון: " + err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearSignature = () => {
    signatureRef.current?.clear();
    setUploadedImagePath(null);
    setExistingSignature(null);
  };

  const handleCheckExistingSignature = async () => {
    if (!selectedMember) {
      alert("נא לבחור חבר מועדון קודם");
      return;
    }

    try {
      setIsCheckingSignature(true);
      const result = await checkSignatureExists(selectedMember.memberID);

      if (result.exists) {
        setExistingSignature(result.imageUrl);
        alert("נמצאה חתימה קיימת!");
      } else {
        setExistingSignature(null);
        alert("לא נמצאה חתימה קיימת לחבר מועדון זה");
      }
    } catch (err) {
      alert("שגיאה בבדיקת חתימה: " + err.message);
    } finally {
      setIsCheckingSignature(false);
    }
  };

  const handleUploadSignature = async () => {
    if (signatureRef.current?.isEmpty()) {
      alert("נא לחתום על החוזה קודם");
      return;
    }

    try {
      setIsUploadingImage(true);

      // המרת החתימה ל-Blob
      const canvas = signatureRef.current.getCanvas();
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png");
      });

      const fileName = `${selectedMember?.memberID || "unknown"}.png`;

      const result = await uploadSignatureImage(blob, fileName);
      setUploadedImagePath(result.filePath);
      alert(`התמונה הועלתה בהצלחה!\nנתיב: ${result.filePath}`);
    } catch (err) {
      alert("שגיאה בהעלאת התמונה: " + err.message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleGenerateContract = () => {
    if (!selectedMember) {
      alert("נא לבחור חבר מועדון");
      return;
    }

    if (!signatureRef.current?.isEmpty()) {
      const signatureData = signatureRef.current.toDataURL();

      const contract = {
        member: {
          id: selectedMember._id,
          memberName: selectedMember.memberName,
          memberID: selectedMember.memberID,
        },
        contract: {
          startDate: formData.startDate,
          endDate: formData.endDate,
          monthlyFee: parseFloat(formData.monthlyFee),
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
          signature: signatureData,
          uploadedSignaturePath: uploadedImagePath,
          generatedAt: new Date().toISOString(),
        },
      };

      setContractData(contract);
    } else {
      alert("נא לחתום על החוזה");
    }
  };

  const handleCopyJson = () => {
    if (contractData) {
      navigator.clipboard.writeText(JSON.stringify(contractData, null, 2));
      alert("JSON הועתק ללוח");
    }
  };

  const handleDownloadJson = () => {
    if (contractData) {
      const blob = new Blob([JSON.stringify(contractData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contract-${selectedMember?.memberName?.replace(
        /\s+/g,
        "-"
      )}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadSignature = () => {
    if (contractData?.contract?.signature) {
      const a = document.createElement("a");
      a.href = contractData.contract.signature;
      a.download = `signature-${selectedMember?.memberName?.replace(
        /\s+/g,
        "-"
      )}-${Date.now()}.png`;
      a.click();
    }
  };

  if (loading) {
    return <div className={styles.container}>טוען נתונים...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>יצירת חוזה חבר מועדון</h1>

      {!contractData ? (
        <div className={styles.formSection}>
          {/* Member Selection */}
          <div className={styles.section}>
            <h2>בחירת חבר מועדון</h2>

            <button
              onClick={() => setShowAddMemberForm(!showAddMemberForm)}
              className={styles.button}
              style={{ marginBottom: "15px" }}
            >
              {showAddMemberForm ? "ביטול" : "+ הוסף חבר מועדון חדש"}
            </button>

            {showAddMemberForm && (
              <div className={styles.addMemberForm}>
                <h3>הוספת חבר מועדון חדש</h3>
                <div className={styles.formGroup}>
                  <label>שם מלא:</label>
                  <input
                    type="text"
                    name="memberName"
                    value={newMemberData.memberName}
                    onChange={handleNewMemberChange}
                    className={styles.input}
                    placeholder="הזן שם מלא"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>תעודת זהות:</label>
                  <input
                    type="text"
                    name="memberID"
                    value={newMemberData.memberID}
                    onChange={handleNewMemberChange}
                    className={styles.input}
                    placeholder="הזן מספר ת.ז"
                  />
                </div>
                <button
                  onClick={handleAddNewMember}
                  className={styles.generateButton}
                  disabled={loading}
                >
                  {loading ? "מוסיף..." : "הוסף חבר מועדון"}
                </button>
              </div>
            )}

            <select
              className={styles.select}
              onChange={(e) => {
                const member = members.find((m) => m._id === e.target.value);
                handleMemberSelect(member);
              }}
              value={selectedMember?._id || ""}
            >
              <option value="">בחר חבר מועדון</option>
              {members?.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.memberName} - ת.ז: {member.memberID}
                </option>
              ))}
            </select>

            {selectedMember && (
              <div className={styles.memberInfo}>
                <h3>פרטי החבר</h3>
                {!showEditMemberForm ? (
                  <>
                    <p>
                      <strong>שם:</strong> {selectedMember.memberName}
                    </p>
                    <p>
                      <strong>ת.ז:</strong> {selectedMember.memberID}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "10px",
                      }}
                    >
                      <button
                        onClick={handleStartEdit}
                        className={styles.button}
                        disabled={loading}
                      >
                        ערוך שם
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteMember(selectedMember.memberID)
                        }
                        className={styles.clearButton}
                        style={{ backgroundColor: "#dc3545" }}
                        disabled={loading}
                      >
                        מחק חבר מועדון
                      </button>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className={styles.formGroup}>
                      <label>שם חדש:</label>
                      <input
                        type="text"
                        value={editMemberData.memberName}
                        onChange={handleEditMemberChange}
                        className={styles.input}
                        placeholder="הזן שם חדש"
                      />
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={handleUpdateMember}
                        className={styles.generateButton}
                        disabled={loading}
                      >
                        {loading ? "מעדכן..." : "שמור שינויים"}
                      </button>
                      <button
                        onClick={() => {
                          setShowEditMemberForm(false);
                          setEditMemberData({ memberName: "" });
                        }}
                        className={styles.clearButton}
                        disabled={loading}
                      >
                        ביטול
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Contract Details */}
          <div className={styles.section}>
            <h2>פרטי החוזה</h2>
            <div className={styles.formGroup}>
              <label>תאריך התחלה:</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>תאריך סיום:</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>תשלום חודשי (₪):</label>
              <input
                type="number"
                name="monthlyFee"
                value={formData.monthlyFee}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="הזן סכום"
              />
            </div>

            <div className={styles.formGroup}>
              <label>אמצעי תשלום:</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="cash">מזומן</option>
                <option value="credit">כרטיס אשראי</option>
                <option value="bank_transfer">העברה בנקאית</option>
                <option value="check">צ'ק</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>הערות:</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className={styles.textarea}
                rows="4"
                placeholder="הערות נוספות..."
              />
            </div>
          </div>

          {/* Signature Section */}
          <div className={styles.section}>
            <h2>חתימה</h2>

            {existingSignature && (
              <div
                style={{
                  marginBottom: "15px",
                  border: "2px solid #4CAF50",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <h3 style={{ color: "#4CAF50", marginTop: 0 }}>
                  חתימה קיימת במערכת:
                </h3>
                <img
                  src={existingSignature}
                  alt="חתימה קיימת"
                  style={{
                    maxWidth: "100%",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                  }}
                />
              </div>
            )}

            <div className={styles.signatureContainer}>
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  className: styles.signatureCanvas,
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handleCheckExistingSignature}
                className={styles.button}
                disabled={isCheckingSignature || loading || !selectedMember}
                style={{ backgroundColor: "#2196F3" }}
              >
                {isCheckingSignature ? "בודק..." : "בדוק חתימה קיימת"}
              </button>
              <button
                onClick={handleClearSignature}
                className={styles.clearButton}
              >
                נקה חתימה
              </button>
              <button
                onClick={handleUploadSignature}
                className={styles.button}
                disabled={isUploadingImage || loading || !selectedMember}
              >
                {isUploadingImage ? "מעלה..." : "העלה חתימה לשרת"}
              </button>
            </div>
            {uploadedImagePath && (
              <p style={{ marginTop: "10px", color: "green" }}>
                ✓ התמונה הועלתה: {uploadedImagePath}
              </p>
            )}
          </div>

          <button
            onClick={handleGenerateContract}
            className={styles.generateButton}
            disabled={!selectedMember}
          >
            צור חוזה
          </button>
        </div>
      ) : (
        <div className={styles.jsonSection}>
          <h2>החוזה נוצר בהצלחה</h2>

          <div className={styles.buttonGroup}>
            <button onClick={handleCopyJson} className={styles.button}>
              העתק JSON
            </button>
            <button onClick={handleDownloadJson} className={styles.button}>
              הורד JSON
            </button>
            <button onClick={handleDownloadSignature} className={styles.button}>
              הורד תמונת חתימה
            </button>
            <button
              onClick={() => {
                setContractData(null);
                setSelectedMember(null);
                setFormData({
                  startDate: new Date().toISOString().split("T")[0],
                  endDate: "",
                  monthlyFee: "",
                  paymentMethod: "cash",
                  notes: "",
                });
                signatureRef.current?.clear();
              }}
              className={styles.button}
            >
              צור חוזה חדש
            </button>
          </div>

          <div className={styles.jsonDisplay}>
            <pre>{JSON.stringify(contractData, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractPage;
