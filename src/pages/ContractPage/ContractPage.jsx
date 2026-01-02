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

//   // פונקציה חדשה: גלילה אוטומטית למרכז בעת כניסה לשדה (Focus)
//   const handleInputFocus = (e) => {
//     const target = e.target;
//     // Timeout של 300ms נותן למקלדת זמן להיפתח/להתייצב לפני הגלילה
//     setTimeout(() => {
//       target.scrollIntoView({
//         behavior: "smooth",
//         block: "center", // ממקם את השדה במרכז הגובה של המסך
//         inline: "nearest",
//       });
//     }, 300);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     // --- הגבלת תעודת זהות למספרים בלבד ---
//     if (name === "idNumber") {
//       if (!/^\d*$/.test(value)) {
//         return;
//       }
//     }
//     // ---------------------------------------------

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
//               onFocus={handleInputFocus} // הוספת הגלילה כאן
//               placeholder="הקלד\י את שמך המלא"
//               autoComplete="name"
//             />
//           </div>
//           <div className={styles.inputGroup}>
//             <label>מספר תעודת זהות</label>
//             <input
//               type="text"
//               name="idNumber"
//               value={formData.idNumber}
//               onChange={handleInputChange}
//               onFocus={handleInputFocus} // הוספת הגלילה כאן
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  createMember,
  uploadSignatureImage,
  checkSignatureExists,
} from "../../services/gymMemberService";
import styles from "./ContractPage.module.css";

// --- וודא שהקובץ קיים בנתיב זה ---
import LogoImage from "../../assets/images/shekel-logo.png";

// רכיב המכיל את טקסט החוזה לשימוש חוזר
const ContractTerms = ({ styles }) => (
  <div className={styles.content}>
    <ol className={styles.rulesList}>
      <li>המנוי הינו לתקופה של שלושה חודשים, ומתחדש בכל רבעון.</li>
      <li>
        <strong>תנאי לזכאות:</strong> הגעה פיזית ל-3 אימונים בחודש לפחות (סה"כ 9
        ביקורים ב-3 חודשים).
      </li>
      <li>
        העמותה משמשת כגורם מתווך ומסבסד בלבד. האחריות בתוך המתחם חלה על הנהלת
        חדר הכושר.
      </li>
      <li>אי עמידה במכסת הביקורים תגרור העברת זכות המנוי למקבל שירות אחר.</li>
      <li>ידוע לי כי חדר הכושר מדווח לעמותה על נוכחותי במתקן.</li>
      <li>הכניסה לחדר הכושר והסטודיו בתיאום מראש בלבד.</li>
      <li>לעמותה שמורה הזכות להפסיק את המנוי בהתאם לשיקול דעתה המקצועי.</li>
    </ol>

    <h3 className={styles.subTitle}>נהלי חדר הכושר פרופיט:</h3>
    <ol className={styles.rulesList}>
      <li>בכניסה הראשונה חובה להציג תעודה מזהה.</li>
      <li>
        השימוש במתקנים מותנה בהשלמת רישום בקבלה, חתימה על תקנון והצהרת בריאות.
      </li>
      <li>חובה להגיע לאימון בבגדי ספורט ונעלי ספורט סגורות.</li>
      <li>
        <strong>חובה להצטייד במגבת אישית בכל אימון.</strong>
      </li>
      <li>יש להקפיד על החזרת הציוד למקומו בסיום התרגיל.</li>
    </ol>

    <p className={styles.footerNote}>
      שים לב: פתיחת המנוי תתאפשר אך ורק למי שקיבל אישור פרטני (לפי שם ות.ז) מרכז
      התחום בעמותה.
    </p>
  </div>
);

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

  // משתנה לשמירת תמונת החתימה להדפסה
  const [signatureData, setSignatureData] = useState(null);

  const sigCanvasRef = useRef({});
  const pdfRef = useRef(null); // רפרנס לאזור שיהפוך ל-PDF

  // --- Handlers ---

  const handleInputFocus = (e) => {
    const target = e.target;
    setTimeout(() => {
      target.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }, 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // --- הגבלת תעודת זהות למספרים בלבד ---
    if (name === "idNumber") {
      if (!/^\d*$/.test(value)) {
        return;
      }
    }
    // ---------------------------------------------

    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

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
      // שמירת החתימה לשימוש מקומי (ל-PDF) לפני שהמודל נסגר
      const canvas = sigCanvasRef.current.getCanvas();
      const sigDataUrl = canvas.toDataURL("image/png");
      setSignatureData(sigDataUrl);

      // 1. יצירת משתמש
      try {
        await createMember({
          memberName: formData.fullName,
          memberID: formData.idNumber,
        });
      } catch (e) {
        console.log("Member creation info:", e.message);
      }

      // 2. שמירת חתימה לשרת
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

  // --- פונקציה ליצירת והורדת PDF (עם תיקון גודל דף) ---
  const handleDownloadPDF = async () => {
    const element = pdfRef.current;
    if (!element) return;

    try {
      // 1. יצירת תמונה מה-HTML
      const canvas = await html2canvas(element, {
        scale: 2, // איכות גבוהה
        useCORS: true,
        backgroundColor: "#ffffff",
        // הגדרות קריטיות למניעת חיתוך:
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        width: element.offsetWidth,
        height: element.offsetHeight,
        x: 0,
        y: 0,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidthPx = canvas.width;
      const imgHeightPx = canvas.height;

      // 2. חישוב מימדים ל-PDF במילימטרים
      const pdfWidth = 210; // רוחב A4
      const pdfHeight = (imgHeightPx * pdfWidth) / imgWidthPx; // גובה יחסי

      // 3. יצירת PDF עם גודל דף מותאם אישית לתוכן
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      const fileName = `contract-${formData.idNumber}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error creating PDF:", error);
      alert("שגיאה ביצירת קובץ ה-PDF");
    }
  };

  // --- Render Functions (Status Screens) ---

  if (step === "success") {
    return (
      <div className={styles.container}>
        {/* כרטיס הצלחה - מוצג במסך רגיל */}
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

          <div className={styles.buttonGroup}>
            <button
              className={styles.buttonPrimary}
              onClick={handleDownloadPDF}
              style={{
                marginTop: "20px",
                width: "auto",
                padding: "12px 30px",
                background: "#3498db", // צבע כחול
              }}
            >
              📥 הורד טופס (PDF)
            </button>

            <button
              className={styles.buttonSecondary}
              onClick={() => window.location.reload()}
              style={{ marginTop: "20px", width: "auto", padding: "12px 30px" }}
            >
              סיום ויציאה
            </button>
          </div>
        </div>

        {/* --- אזור נסתר המשמש ליצירת ה-PDF --- */}
        <div
          ref={pdfRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: -1000,
            // הגדרות גודל:
            width: "210mm", // רוחב קבוע (A4)
            minHeight: "297mm", // גובה מינימלי
            height: "auto", // מאפשר לדף להתארך לפי התוכן!
            padding: "20mm",
            backgroundColor: "white",
            color: "black",
            direction: "rtl",
            fontFamily: "Arial, sans-serif",
            boxSizing: "border-box",
          }}
        >
          <div
            className={styles.header}
            style={{ borderBottom: "none", marginBottom: "20px" }}
          >
            <img
              src={LogoImage}
              alt="לוגו שק'ל"
              style={{ maxWidth: "150px" }}
            />
            <h1 style={{ fontSize: "24px", marginTop: "10px", color: "#000" }}>
              הסכם שימוש ומנוי חדר כושר
            </h1>
          </div>

          <div style={{ color: "#000" }}>
            <ContractTerms styles={styles} />
          </div>

          {/* --- אזור החתימה המעוצב והמשודרג --- */}
          <div
            style={{
              marginTop: "50px",
              backgroundColor: "#f9f9f9", // רקע אפור בהיר
              border: "1px solid #e0e0e0", // מסגרת עדינה
              borderRadius: "8px",
              padding: "25px",
              borderRight: "5px solid #8E44AD", // פס צבע מותג מימין
              pageBreakInside: "avoid",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                marginBottom: "25px",
                color: "#2c3e50",
                borderBottom: "1px solid #eee",
                paddingBottom: "10px",
              }}
            >
              אישור ופרטי החותם
            </h3>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              {/* צד ימין: הפרטים */}
              <div style={{ lineHeight: "1.8", fontSize: "16px" }}>
                <div>
                  <strong>שם מלא:</strong> {formData.fullName}
                </div>
                <div>
                  <strong>תעודת זהות:</strong> {formData.idNumber}
                </div>
                <div>
                  <strong>תאריך:</strong>{" "}
                  {new Date().toLocaleDateString("he-IL")}
                </div>
              </div>

              {/* צד שמאל: החתימה על קו */}
              <div style={{ textAlign: "center", minWidth: "200px" }}>
                <div
                  style={{
                    height: "80px",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    marginBottom: "5px",
                  }}
                >
                  {signatureData ? (
                    <img
                      src={signatureData}
                      alt="חתימה"
                      style={{
                        maxHeight: "75px",
                        maxWidth: "180px",
                      }}
                    />
                  ) : (
                    <span style={{ color: "#ccc", fontSize: "14px" }}>
                      (אין חתימה)
                    </span>
                  )}
                </div>
                {/* הקו מתחת לחתימה */}
                <div
                  style={{
                    borderTop: "1px solid #000",
                    width: "100%",
                    margin: "0 auto",
                  }}
                ></div>
                <div
                  style={{
                    fontSize: "14px",
                    marginTop: "5px",
                    fontWeight: "bold",
                  }}
                >
                  חתימת הלקוח
                </div>
              </div>
            </div>
          </div>
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
        <ContractTerms styles={styles} />

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
              onFocus={handleInputFocus}
              placeholder="הקלד\י את שמך המלא"
              autoComplete="name"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>מספר תעודת זהות</label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder="הקלד\י 9 ספרות"
              maxLength={9}
              inputMode="numeric"
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
