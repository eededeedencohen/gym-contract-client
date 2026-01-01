// import React, { useRef, useState } from "react";
// import SignatureCanvas from "react-signature-canvas";
// import {
//   createMember,
//   uploadSignatureImage,
//   checkSignatureExists,
// } from "../../services/gymMemberService";
// import styles from "./ContractPage.module.css";

// // --- וודא שהקובץ קיים בנתיב זה ---
// import LogoImage from "../../assets/images/shekel-logo.png";

// const ContractPage = () => {
//   // --- State Management ---
//   const [formData, setFormData] = useState({
//     fullName: "",
//     idNumber: "",
//   });

//   const [step, setStep] = useState("form"); // 'form', 'already_signed', 'success'
//   const [showModal, setShowModal] = useState(false);
//   const [isSignButtonAble, setIsSignButtonAble] = useState(false);
//   const [isSendButtonAble, setIsSendButtonAble] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   const sigCanvasRef = useRef({});

//   // --- Handlers ---
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     const updatedData = { ...formData, [name]: value };
//     setFormData(updatedData);

//     // בדיקת ולידציה בסיסית
//     if (
//       updatedData.fullName.trim().length > 1 &&
//       updatedData.idNumber.trim().length > 6
//     ) {
//       setIsSignButtonAble(true);
//     } else {
//       setIsSignButtonAble(false);
//     }
//   };

//   const handleSignClick = async () => {
//     if (!isSignButtonAble) return;

//     setLoading(true);
//     setErrorMsg("");

//     try {
//       const checkResult = await checkSignatureExists(formData.idNumber);

//       if (checkResult.exists) {
//         setStep("already_signed");
//       } else {
//         setShowModal(true);
//         setIsSendButtonAble(false);
//       }
//     } catch (err) {
//       console.error(err);
//       setErrorMsg("שגיאה בתקשורת עם השרת. אנא נסה שנית.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCanvasBegin = () => {
//     setIsSendButtonAble(true);
//   };

//   const handleClearSignature = () => {
//     sigCanvasRef.current.clear();
//     setIsSendButtonAble(false);
//   };

//   const handleSendForm = async () => {
//     if (!isSendButtonAble) return;

//     setLoading(true);
//     try {
//       // 1. יצירת משתמש (ניסיון אופטימי)
//       try {
//         await createMember({
//           memberName: formData.fullName,
//           memberID: formData.idNumber,
//         });
//       } catch (e) {
//         console.log("Member creation info:", e.message);
//       }

//       // 2. שמירת חתימה
//       const canvas = sigCanvasRef.current.getCanvas();
//       const blob = await new Promise((resolve) => {
//         canvas.toBlob(resolve, "image/png");
//       });

//       const fileName = `${formData.idNumber}.png`;
//       await uploadSignatureImage(blob, fileName);

//       setShowModal(false);
//       setStep("success");
//     } catch (err) {
//       alert("שגיאה בשמירת החוזה: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Render Functions (Status Screens) ---

//   if (step === "success") {
//     return (
//       <div className={styles.container}>
//         <div className={styles.card}>
//           <div className={styles.successIcon}>✓</div>
//           <h2 className={styles.title}>הטופס נשלח בהצלחה!</h2>
//           <p style={{ fontSize: "1.1rem" }}>
//             תודה רבה, <strong>{formData.fullName}</strong>.
//           </p>
//           <p
//             style={{ color: "#7f8c8d", fontSize: "0.95rem", marginTop: "10px" }}
//           >
//             אישור החתימה נקלט במערכת העמותה.
//           </p>
//           <button
//             className={styles.buttonPrimary}
//             onClick={() => window.location.reload()}
//             style={{ marginTop: "30px", width: "auto", padding: "12px 40px" }}
//           >
//             סיום ויציאה
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (step === "already_signed") {
//     return (
//       <div className={styles.container}>
//         <div className={styles.card}>
//           <div className={styles.warningIcon}>!</div>
//           <h2 className={styles.title}>משתמש זה כבר חתום</h2>
//           <p style={{ fontSize: "1.1rem" }}>
//             מספר זהות <strong>{formData.idNumber}</strong> מופיע כבר במאגר.
//           </p>
//           <button
//             className={styles.buttonSecondary}
//             onClick={() => {
//               setStep("form");
//               setFormData({ fullName: "", idNumber: "" });
//               setIsSignButtonAble(false);
//             }}
//             style={{ marginTop: "30px" }}
//           >
//             חזרה לטופס
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // --- Main Render (Form) ---
//   return (
//     <div className={styles.container}>
//       <div className={styles.paper}>
//         {/* לוגו וכותרת */}
//         <div className={styles.header}>
//           <img src={LogoImage} alt="לוגו שק'ל" className={styles.logoImage} />
//           <h1 className={styles.mainTitle}>הסכם שימוש ומנוי חדר כושר</h1>
//         </div>

//         {/* תוכן ההסכם */}
//         <div className={styles.content}>
//           <ol className={styles.rulesList}>
//             <li>המנוי הינו לתקופה של שלושה חודשים, ומתחדש בכל רבעון.</li>
//             <li>
//               <strong>תנאי לזכאות:</strong> הגעה פיזית ל-3 אימונים בחודש לפחות
//               (סה"כ 9 ביקורים ב-3 חודשים).
//             </li>
//             <li>
//               העמותה משמשת כגורם מתווך ומסבסד בלבד. האחריות בתוך המתחם חלה על
//               הנהלת חדר הכושר.
//             </li>
//             <li>
//               אי עמידה במכסת הביקורים תגרור העברת זכות המנוי למקבל שירות אחר.
//             </li>
//             <li>ידוע לי כי חדר הכושר מדווח לעמותה על נוכחותי במתקן.</li>
//             <li>הכניסה לחדר הכושר והסטודיו בתיאום מראש בלבד.</li>
//             <li>
//               לעמותה שמורה הזכות להפסיק את המנוי בהתאם לשיקול דעתה המקצועי.
//             </li>
//           </ol>

//           <h3 className={styles.subTitle}>נהלי חדר הכושר פרופיט:</h3>
//           <ol className={styles.rulesList}>
//             <li>בכניסה הראשונה חובה להציג תעודה מזהה.</li>
//             <li>
//               השימוש במתקנים מותנה בהשלמת רישום בקבלה, חתימה על תקנון והצהרת
//               בריאות.
//             </li>
//             <li>חובה להגיע לאימון בבגדי ספורט ונעלי ספורט סגורות.</li>
//             <li>
//               <strong>חובה להצטייד במגבת אישית בכל אימון.</strong>
//             </li>
//             <li>יש להקפיד על החזרת הציוד למקומו בסיום התרגיל.</li>
//           </ol>

//           <p className={styles.footerNote}>
//             שים לב: פתיחת המנוי תתאפשר אך ורק למי שקיבל אישור פרטני (לפי שם
//             ות.ז) מרכז התחום בעמותה.
//           </p>
//         </div>

//         {/* טופס פרטים */}
//         <div className={styles.formArea}>
//           <h3>אישור ופרטי החותם</h3>

//           <div className={styles.inputGroup}>
//             <label>שם מלא</label>
//             <input
//               type="text"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleInputChange}
//               placeholder="הקלד\י את שמך המלא" // to do להתאים גם לגברים וגם לנשים
//               autoComplete="name"
//             />
//           </div>
//           <div className={styles.inputGroup}>
//             <label>מספר תעודת זהות</label>
//             <input
//               type="text" // Text allows leading zeros
//               name="idNumber"
//               value={formData.idNumber}
//               onChange={handleInputChange}
//               placeholder="הקלד\י 9 ספרות"
//               maxLength={9}
//               inputMode="numeric"
//             />
//           </div>

//           {errorMsg && <div className={styles.error}>⚠️ {errorMsg}</div>}

//           <button
//             className={`${styles.buttonPrimary} ${
//               !isSignButtonAble ? styles.disabled : ""
//             }`}
//             onClick={handleSignClick}
//             disabled={!isSignButtonAble || loading}
//           >
//             {loading ? "מבצע בדיקה..." : "אני מאשר/ת ומעוניין/ת לחתום"}
//           </button>
//         </div>
//       </div>

//       {/* Modal / Popup לחתימה */}
//       {showModal && (
//         <div className={styles.modalOverlay}>
//           <div className={styles.modalContent}>
//             <h3>חתימה דיגיטלית</h3>
//             <p style={{ color: "#7f8c8d", marginBottom: "10px" }}>
//               אנא חתום בתוך המסגרת באמצעות האצבע או העכבר:
//             </p>

//             <div className={styles.signatureWrapper}>
//               <SignatureCanvas
//                 ref={sigCanvasRef}
//                 penColor="#2c3e50"
//                 canvasProps={{ className: styles.sigCanvas }}
//                 onBegin={handleCanvasBegin}
//               />
//             </div>

//             <div className={styles.modalButtons}>
//               <button
//                 className={`${styles.buttonPrimary} ${
//                   !isSendButtonAble ? styles.disabled : ""
//                 }`}
//                 onClick={handleSendForm}
//                 disabled={!isSendButtonAble || loading}
//                 style={{ width: "60%" }}
//               >
//                 {loading ? "שולח..." : "אשר ושלח טופס"}
//               </button>
//               <button
//                 className={styles.buttonClear}
//                 onClick={handleClearSignature}
//               >
//                 נקה
//               </button>
//             </div>

//             <button
//               className={styles.closeModal}
//               onClick={() => setShowModal(false)}
//             >
//               ביטול וחזרה
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ContractPage;

import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  createMember,
  uploadSignatureImage,
  checkSignatureExists,
} from "../../services/gymMemberService";
import styles from "./ContractPage.module.css";

// --- וודא שהקובץ קיים בנתיב זה ---
import LogoImage from "../../assets/images/shekel-logo.png";

const ContractPage = () => {
  // --- State Management ---
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
  });

  const [step, setStep] = useState("form"); // 'form', 'already_signed', 'success'
  const [showModal, setShowModal] = useState(false);
  const [isSignButtonAble, setIsSignButtonAble] = useState(false);
  const [isSendButtonAble, setIsSendButtonAble] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const sigCanvasRef = useRef({});

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // --- תיקון: הגבלת תעודת זהות למספרים בלבד ---
    if (name === "idNumber") {
      // הביטוי הרגולרי /^\d*$/ בודק שהמחרוזת מכילה רק ספרות (או ריקה)
      if (!/^\d*$/.test(value)) {
        return; // אם יש תו שאינו מספר, מתעלמים מהשינוי
      }
    }
    // ---------------------------------------------

    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    // בדיקת ולידציה בסיסית
    if (
      updatedData.fullName.trim().length > 1 &&
      updatedData.idNumber.trim().length > 6
    ) {
      setIsSignButtonAble(true);
    } else {
      setIsSignButtonAble(false);
    }
  };

  const handleSignClick = async () => {
    if (!isSignButtonAble) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const checkResult = await checkSignatureExists(formData.idNumber);

      if (checkResult.exists) {
        setStep("already_signed");
      } else {
        setShowModal(true);
        setIsSendButtonAble(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("שגיאה בתקשורת עם השרת. אנא נסה שנית.");
    } finally {
      setLoading(false);
    }
  };

  const handleCanvasBegin = () => {
    setIsSendButtonAble(true);
  };

  const handleClearSignature = () => {
    sigCanvasRef.current.clear();
    setIsSendButtonAble(false);
  };

  const handleSendForm = async () => {
    if (!isSendButtonAble) return;

    setLoading(true);
    try {
      // 1. יצירת משתמש (ניסיון אופטימי)
      try {
        await createMember({
          memberName: formData.fullName,
          memberID: formData.idNumber,
        });
      } catch (e) {
        console.log("Member creation info:", e.message);
      }

      // 2. שמירת חתימה
      const canvas = sigCanvasRef.current.getCanvas();
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png");
      });

      const fileName = `${formData.idNumber}.png`;
      await uploadSignatureImage(blob, fileName);

      setShowModal(false);
      setStep("success");
    } catch (err) {
      alert("שגיאה בשמירת החוזה: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Render Functions (Status Screens) ---

  if (step === "success") {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.title}>הטופס נשלח בהצלחה!</h2>
          <p style={{ fontSize: "1.1rem" }}>
            תודה רבה, <strong>{formData.fullName}</strong>.
          </p>
          <p
            style={{ color: "#7f8c8d", fontSize: "0.95rem", marginTop: "10px" }}
          >
            אישור החתימה נקלט במערכת העמותה.
          </p>
          <button
            className={styles.buttonPrimary}
            onClick={() => window.location.reload()}
            style={{ marginTop: "30px", width: "auto", padding: "12px 40px" }}
          >
            סיום ויציאה
          </button>
        </div>
      </div>
    );
  }

  if (step === "already_signed") {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.warningIcon}>!</div>
          <h2 className={styles.title}>משתמש זה כבר חתום</h2>
          <p style={{ fontSize: "1.1rem" }}>
            מספר זהות <strong>{formData.idNumber}</strong> מופיע כבר במאגר.
          </p>
          <button
            className={styles.buttonSecondary}
            onClick={() => {
              setStep("form");
              setFormData({ fullName: "", idNumber: "" });
              setIsSignButtonAble(false);
            }}
            style={{ marginTop: "30px" }}
          >
            חזרה לטופס
          </button>
        </div>
      </div>
    );
  }

  // --- Main Render (Form) ---
  return (
    <div className={styles.container}>
      <div className={styles.paper}>
        {/* לוגו וכותרת */}
        <div className={styles.header}>
          <img src={LogoImage} alt="לוגו שק'ל" className={styles.logoImage} />
          <h1 className={styles.mainTitle}>הסכם שימוש ומנוי חדר כושר</h1>
        </div>

        {/* תוכן ההסכם */}
        <div className={styles.content}>
          <ol className={styles.rulesList}>
            <li>המנוי הינו לתקופה של שלושה חודשים, ומתחדש בכל רבעון.</li>
            <li>
              <strong>תנאי לזכאות:</strong> הגעה פיזית ל-3 אימונים בחודש לפחות
              (סה"כ 9 ביקורים ב-3 חודשים).
            </li>
            <li>
              העמותה משמשת כגורם מתווך ומסבסד בלבד. האחריות בתוך המתחם חלה על
              הנהלת חדר הכושר.
            </li>
            <li>
              אי עמידה במכסת הביקורים תגרור העברת זכות המנוי למקבל שירות אחר.
            </li>
            <li>ידוע לי כי חדר הכושר מדווח לעמותה על נוכחותי במתקן.</li>
            <li>הכניסה לחדר הכושר והסטודיו בתיאום מראש בלבד.</li>
            <li>
              לעמותה שמורה הזכות להפסיק את המנוי בהתאם לשיקול דעתה המקצועי.
            </li>
          </ol>

          <h3 className={styles.subTitle}>נהלי חדר הכושר פרופיט:</h3>
          <ol className={styles.rulesList}>
            <li>בכניסה הראשונה חובה להציג תעודה מזהה.</li>
            <li>
              השימוש במתקנים מותנה בהשלמת רישום בקבלה, חתימה על תקנון והצהרת
              בריאות.
            </li>
            <li>חובה להגיע לאימון בבגדי ספורט ונעלי ספורט סגורות.</li>
            <li>
              <strong>חובה להצטייד במגבת אישית בכל אימון.</strong>
            </li>
            <li>יש להקפיד על החזרת הציוד למקומו בסיום התרגיל.</li>
          </ol>

          <p className={styles.footerNote}>
            שים לב: פתיחת המנוי תתאפשר אך ורק למי שקיבל אישור פרטני (לפי שם
            ות.ז) מרכז התחום בעמותה.
          </p>
        </div>

        {/* טופס פרטים */}
        <div className={styles.formArea}>
          <h3>אישור ופרטי החותם</h3>

          <div className={styles.inputGroup}>
            <label>שם מלא</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="הקלד\י את שמך המלא"
              autoComplete="name"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>מספר תעודת זהות</label>
            <input
              type="text" // נשאר Text כדי לאפשר אפס מוביל
              name="idNumber"
              value={formData.idNumber}
              onChange={handleInputChange}
              placeholder="הקלד\י 9 ספרות"
              maxLength={9}
              inputMode="numeric" // פותח מקלדת מספרים בנייד
            />
          </div>

          {errorMsg && <div className={styles.error}>⚠️ {errorMsg}</div>}

          <button
            className={`${styles.buttonPrimary} ${
              !isSignButtonAble ? styles.disabled : ""
            }`}
            onClick={handleSignClick}
            disabled={!isSignButtonAble || loading}
          >
            {loading ? "מבצע בדיקה..." : "אני מאשר/ת ומעוניין/ת לחתום"}
          </button>
        </div>
      </div>

      {/* Modal / Popup לחתימה */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>חתימה דיגיטלית</h3>
            <p style={{ color: "#7f8c8d", marginBottom: "10px" }}>
              אנא חתום בתוך המסגרת באמצעות האצבע או העכבר:
            </p>

            <div className={styles.signatureWrapper}>
              <SignatureCanvas
                ref={sigCanvasRef}
                penColor="#2c3e50"
                canvasProps={{ className: styles.sigCanvas }}
                onBegin={handleCanvasBegin}
              />
            </div>

            <div className={styles.modalButtons}>
              <button
                className={`${styles.buttonPrimary} ${
                  !isSendButtonAble ? styles.disabled : ""
                }`}
                onClick={handleSendForm}
                disabled={!isSendButtonAble || loading}
                style={{ width: "60%" }}
              >
                {loading ? "שולח..." : "אשר ושלח טופס"}
              </button>
              <button
                className={styles.buttonClear}
                onClick={handleClearSignature}
              >
                נקה
              </button>
            </div>

            <button
              className={styles.closeModal}
              onClick={() => setShowModal(false)}
            >
              ביטול וחזרה
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractPage;
