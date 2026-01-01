import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  createMember,
  uploadSignatureImage,
  checkSignatureExists,
} from "../../services/gymMemberService";
import styles from "./ContractPage.module.css";
// לוגו של שק"ל - אם יש לך קובץ תמונה שמור, ניתן לייבא אותו. כרגע נשתמש בטקסט או פלייסהולדר
// import shekelLogo from "../../assets/shekel_logo.png";

const ContractPage = () => {
  // --- State Management ---
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
  });

  // States for Flowchart Logic
  const [step, setStep] = useState("form"); // 'form', 'already_signed', 'success'
  const [showModal, setShowModal] = useState(false);
  const [isSignButtonAble, setIsSignButtonAble] = useState(false);
  const [isSendButtonAble, setIsSendButtonAble] = useState(false);
  const [loading, FLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const sigCanvasRef = useRef({});

  // --- Handlers ---

  // עדכון שדות הקלט ובדיקה אם הכפתור הראשי צריך להיות פעיל
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    // Flowchart: "fields full name and ID full -> sign button is Able"
    if (
      updatedData.fullName.trim().length > 1 &&
      updatedData.idNumber.trim().length > 6
    ) {
      setIsSignButtonAble(true);
    } else {
      setIsSignButtonAble(false);
    }
  };

  // לחיצה על "חתום על הנחיות"
  const handleSignClick = async () => {
    if (!isSignButtonAble) return;

    FLoading(true);
    setErrorMsg("");

    try {
      // Flowchart check: משתמש קיים במערכת? (לפי בדיקת חתימה)
      const checkResult = await checkSignatureExists(formData.idNumber);

      if (checkResult.exists) {
        // Branch 1: משתמש קיים -> הודעה שהוא כבר חתם
        setStep("already_signed");
      } else {
        // Branch 2: משתמש לא קיים -> Popup Sign
        setShowModal(true);
        // Reset modal state
        setIsSendButtonAble(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("אירעה שגיאה בבדיקת הנתונים. נסה שנית.");
    } finally {
      FLoading(false);
    }
  };

  // זיהוי שהמשתמש התחיל לחתום
  const handleCanvasBegin = () => {
    // Flowchart: "Signature area touched -> Send button is Able"
    setIsSendButtonAble(true);
  };

  const handleClearSignature = () => {
    sigCanvasRef.current.clear();
    // Flowchart: "Click clear -> Send button disabled"
    setIsSendButtonAble(false);
  };

  const handleSendForm = async () => {
    if (!isSendButtonAble) return;

    FLoading(true);
    try {
      // 1. יצירת המשתמש במערכת (אם לא קיים)
      // אנחנו משתמשים ב-try/catch נפרד כי יכול להיות שהוא קיים אך ללא חתימה
      try {
        await createMember({
          memberName: formData.fullName,
          memberID: formData.idNumber,
        });
      } catch (e) {
        // מתעלמים משגיאה אם המשתמש כבר קיים (למשל סטטוס 409), וממשיכים להעלאת החתימה
        console.log(
          "Member creation skipped or failed, proceeding to signature upload:",
          e.message
        );
      }

      // 2. המרת החתימה לתמונה
      const canvas = sigCanvasRef.current.getCanvas();
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png");
      });

      // 3. העלאת החתימה
      const fileName = `${formData.idNumber}.png`;
      await uploadSignatureImage(blob, fileName);

      // Flowchart: "Click send -> Success Component"
      setShowModal(false);
      setStep("success");
    } catch (err) {
      alert("שגיאה בשמירת החוזה: " + err.message);
    } finally {
      FLoading(false);
    }
  };

  // --- Render Functions ---

  // מסך הצלחה
  if (step === "success") {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.title}>הטופס נשלח בהצלחה!</h2>
          <p>תודה רבה, {formData.fullName}.</p>
          <button
            className={styles.buttonPrimary}
            onClick={() => window.location.reload()}
            style={{ marginTop: "20px" }}
          >
            סיום וחזרה להתחלה
          </button>
        </div>
      </div>
    );
  }

  // מסך "כבר חתום"
  if (step === "already_signed") {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.warningIcon}>!</div>
          <h2 className={styles.title}>משתמש זה כבר חתום במערכת</h2>
          <p>מספר זהות {formData.idNumber} מופיע במאגר כמי שביצע חתימה.</p>
          <button
            className={styles.buttonSecondary}
            onClick={() => {
              setStep("form");
              setFormData({ fullName: "", idNumber: "" });
              setIsSignButtonAble(false);
            }}
          >
            חזרה
          </button>
        </div>
      </div>
    );
  }

  // המסך הראשי (Form)
  return (
    <div className={styles.container}>
      <div className={styles.paper}>
        {/* לוגו וכותרת */}
        <div className={styles.header}>
          {/* ניתן להוסיף כאן תמונה עם <img src={shekelLogo} ... /> */}
          <div className={styles.logoText}>
            שק"ל - שילוב קהילתי לאנשים עם מוגבלויות
          </div>
          <h1 className={styles.mainTitle}>
            הנחיות לשימוש במנוי חדר הכושר - שק"ל - מועדון חברתי
          </h1>
        </div>

        {/* תוכן המסמך */}
        <div className={styles.content}>
          <ol className={styles.rulesList}>
            <li>
              מקבל השירות מודע לכך שהמנוי ניתן לתקופה של שלושה חודשים, ומתחדש כל
              פעם בשלושה חודשים.
            </li>
            <li>
              "מקבל השירות מבין כי התנאי להפעלת המנוי הוא הגעתו הפיזית ל-3
              ביקורים בחודש לפחות (סה"כ 9 הגעות לאימון או לשיעור במהלך תקופה של
              3 חודשים)."
            </li>
            <li>
              מקבל השירות מבין ומצהיר כי רק שק"ל היא הגורם המתווך והמסבסד וכל מה
              שקורה בחדר הכושר הוא באחריות חדר הכושר בלבד ולא של שק"ל.
            </li>
            <li>
              מקבל השירות מבין שאם לא יעמוד בתנאי המנוי, המנוי יועבר למקבל שירות
              אחר ולא תוכל להיות לו טענה בנושא.
            </li>
            <li>
              מקבל השירות מצהיר כי הוא מודע ומסכים לכך שחדר הכושר ידווח על
              נוכחותו.
            </li>
            <li>המנוי כולל כניסה לחדר הכושר והסטודיו בתיאום מראש.</li>
            <li>
              לשק"ל יש את הזכות להפסיק את המנוי בהתאם לשיקול דעתה ולמקבל השירות
              לא יהיה טענה בנושא.
            </li>
          </ol>

          <h3 className={styles.subTitle}>
            חדר הכושר פרופיט – כללים והנחיות לשימוש:
          </h3>
          <ol className={styles.rulesList}>
            <li>בפעם הראשונה יש להגיע עם תעודה מזהה.</li>
            <li>
              הכניסה והשימוש במתקני חדר הכושר מותנים בהשלמת הליך הרישום בקבלה,
              הכולל חתימה על תקנון והצהרת בריאות כחוק.
            </li>
            <li>
              חובה תמיד להגיע עם בגדי ספורט ונעלי ספורט, אחרת לא יתאפשר אימון.
            </li>
            <li>חובה להתאמן עם מגבת בכל אימון, ללא מגבת לא יתאפשר אימון.</li>
            <li>יש להחזיר את המשקולות או הציוד בסיום התרגיל למקום.</li>
          </ol>

          <p className={styles.footerNote}>
            פתיחת כרטיס מנוי תתאפשר רק למי שקיבל אישור לפי שם ות.ז מהעמותה.
          </p>
        </div>

        {/* אזור קלט וכפתור חתימה */}
        <div className={styles.formArea}>
          <div className={styles.inputGroup}>
            <label>שם מלא:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="הכנס שם מלא"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>תעודת זהות:</label>
            <input
              type="text" // שיניתי ל-text כדי לאפשר אפס מוביל במידת הצורך
              name="idNumber"
              value={formData.idNumber}
              onChange={handleInputChange}
              placeholder="הכנס מספר ת.ז"
              maxLength={9}
            />
          </div>

          {errorMsg && <div className={styles.error}>{errorMsg}</div>}

          <button
            className={`${styles.buttonPrimary} ${
              !isSignButtonAble ? styles.disabled : ""
            }`}
            onClick={handleSignClick}
            disabled={!isSignButtonAble || loading}
          >
            {loading ? "בודק..." : "חתום על הנחיות"}
          </button>
        </div>
      </div>

      {/* Modal / Popup לחתימה */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>חתימה דיגיטלית</h3>
            <p>אנא חתום בתיבה למטה:</p>

            <div className={styles.signatureWrapper}>
              <SignatureCanvas
                ref={sigCanvasRef}
                penColor="black"
                canvasProps={{ className: styles.sigCanvas }}
                onBegin={handleCanvasBegin}
              />
            </div>

            <div className={styles.modalButtons}>
              <button
                className={styles.buttonClear}
                onClick={handleClearSignature}
              >
                נקה חתימה
              </button>
              <button
                className={`${styles.buttonPrimary} ${
                  !isSendButtonAble ? styles.disabled : ""
                }`}
                onClick={handleSendForm}
                disabled={!isSendButtonAble || loading}
              >
                {loading ? "שולח..." : "שלח טופס"}
              </button>
            </div>
            <button
              className={styles.closeModal}
              onClick={() => setShowModal(false)}
            >
              ביטול
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractPage;
