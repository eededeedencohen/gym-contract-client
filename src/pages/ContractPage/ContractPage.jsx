// src/pages/ContractPage/ContractPage.jsx
import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import useGymMembers from "../../hooks/useGymMembers";
import styles from "./ContractPage.module.css";

const ContractPage = () => {
  const { signContract, loading } = useGymMembers();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userID: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sigCanvas = useRef(null);

  const handleSave = async () => {
    if (sigCanvas.current.isEmpty()) return alert("חובה לחתום");

    const signature = sigCanvas.current
      .getTrimmedCanvas()
      .toDataURL("image/png");

    try {
      await signContract({ ...formData, sign: signature });
      alert("החוזה נחתם בהצלחה!");
      setIsModalOpen(false);
    } catch (e) {
      alert("שגיאה ברישום");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.contractCard}>
        <h2>הנחיות לשימוש במנוי חדר הכושר - שק"ל</h2>
        <div className={styles.scrollText}>
          <p>מקבל השירות מודע לכך שהמנוי ניתן לתקופה של שלושה חודשים...</p>
          {/* כאן תכניס את כל הטקסט שסיפקת */}
          <p>המנוי כולל כניסה לחדר הכושר והסטודיו בתיאום מראש...</p>
        </div>

        <div className={styles.inputs}>
          <input
            placeholder="שם פרטי"
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
          <input
            placeholder="שם משפחה"
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
          <input
            placeholder="תעודת זהות"
            onChange={(e) =>
              setFormData({ ...formData, userID: e.target.value })
            }
          />
        </div>

        <button className={styles.signBtn} onClick={() => setIsModalOpen(true)}>
          לחתימה
        </button>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>חתום כאן</h3>
            <div className={styles.canvasContainer}>
              <SignatureCanvas
                ref={sigCanvas}
                canvasProps={{ className: styles.sigPad }}
              />
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => sigCanvas.current.clear()}>נקה</button>
              <button onClick={handleSave} disabled={loading}>
                {loading ? "שומר..." : "אשר ושלח"}
              </button>
              <button onClick={() => setIsModalOpen(false)}>ביטול</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractPage;
