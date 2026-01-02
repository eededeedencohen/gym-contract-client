import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import styles from "./AdminPage.module.css";
// ייבוא הסטיילים של דף החוזה
import contractStyles from "../ContractPage/ContractPage.module.css";
import { getAllMembers } from "../../services/gymMemberService";
import { DOMAIN } from "../../constants";
import LogoImage from "../../assets/images/shekel-logo.png";
import eyeSVG from "../../assets/icons/eye.svg";

const AdminPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const contractRef = useRef(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const data = await getAllMembers();
      setMembers(data);
    } catch (error) {
      console.error("Error fetching members:", error);
      alert("שגיאה בטעינת הנתונים");
    } finally {
      setLoading(false);
    }
  };

  const handleViewContract = (member) => {
    setSelectedMember(member);
    document.body.style.overflow = "hidden"; // מניעת גלילה של דף הרקע
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
    document.body.style.overflow = "auto";
  };

  const handleDownloadPDF = async () => {
    const element = contractRef.current;
    if (!element) return;

    // הסתרת הכפתור זמנית או וידוא שלא מצלמים אותו (הוא מחוץ ל-REF אז זה בסדר)
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        // הגדרות חשובות למניעת חיתוך
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        x: 0,
        y: 0,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidthPx = canvas.width;
      const imgHeightPx = canvas.height;

      const pdfWidth = 210;
      const pdfHeight = (imgHeightPx * pdfWidth) / imgWidthPx;

      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`contract-${selectedMember.memberID}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("שגיאה ביצירת ה-PDF");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>ממשק ניהול - חדר כושר</h1>
        <p>רשימת חברים שחתמו על ההסכם</p>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>שם מלא</th>
              <th>תעודת זהות</th>
              <th>מזהה מערכת</th>
              <th style={{ width: "60px" }}>צפייה</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  טוען נתונים...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  אין נתונים להצגה
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member._id}>
                  <td>{member.memberName}</td>
                  <td>{member.memberID}</td>
                  <td style={{ fontSize: "0.8em", color: "#999" }}>
                    {member._id}
                  </td>
                  <td>
                    <button
                      className={`${styles.actionBtn} ${styles.viewBtn}`}
                      onClick={() => handleViewContract(member)}
                      title="צפה בחוזה החתום"
                    >
                      👁️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- Modal Structure --- */}
      {selectedMember && (
        <div className={styles.overlayContainer}>
          {/* 1. Backdrop (Click to close) */}
          <div className={styles.backdrop} onClick={handleCloseModal}></div>

          {/* 2. Scrollable Content Area */}
          <div
            className={styles.scrollContainer}
            onClick={(e) => {
              // סגירה בלחיצה על החלק הריק בצדדים
              if (e.target === e.currentTarget) handleCloseModal();
            }}
          >
            <div className={styles.contractWrapper}>
              {/* הנייר עצמו - משתמשים בעיצוב המקורי + התאמות */}
              <div
                ref={contractRef}
                className={contractStyles.paper}
                // דריסה ידנית של פדינג למובייל כדי להבטיח התאמה
                style={{
                  margin: "0 auto",
                  minHeight: "auto",
                  padding: window.innerWidth < 600 ? "30px 20px" : "70px 60px",
                  pointerEvents: "none", // מניעת אינטראקציה
                  userSelect: "none",
                }}
              >
                {/* --- Header --- */}
                <div className={contractStyles.header}>
                  <img
                    src={LogoImage}
                    alt="לוגו שק'ל"
                    className={contractStyles.logoImage}
                  />
                  <h1
                    className={contractStyles.mainTitle}
                    style={{
                      fontSize: window.innerWidth < 600 ? "1.5rem" : "2.2rem",
                    }}
                  >
                    הסכם שימוש ומנוי חדר כושר
                  </h1>
                </div>

                {/* --- Content --- */}
                <div className={contractStyles.content}>
                  <ol className={contractStyles.rulesList}>
                    <li>
                      המנוי הינו לתקופה של שלושה חודשים, ומתחדש בכל רבעון.
                    </li>
                    <li>
                      <strong>תנאי לזכאות:</strong> הגעה פיזית ל-3 אימונים בחודש
                      לפחות (סה"כ 9 ביקורים ב-3 חודשים).
                    </li>
                    <li>
                      העמותה משמשת כגורם מתווך ומסבסד בלבד. האחריות בתוך המתחם
                      חלה על הנהלת חדר הכושר.
                    </li>
                    <li>
                      אי עמידה במכסת הביקורים תגרור העברת זכות המנוי למקבל שירות
                      אחר.
                    </li>
                    <li>ידוע לי כי חדר הכושר מדווח לעמותה על נוכחותי במתקן.</li>
                    <li>הכניסה לחדר הכושר והסטודיו בתיאום מראש בלבד.</li>
                    <li>
                      לעמותה שמורה הזכות להפסיק את המנוי בהתאם לשיקול דעתה
                      המקצועי.
                    </li>
                  </ol>

                  <h3 className={contractStyles.subTitle}>
                    נהלי חדר הכושר פרופיט:
                  </h3>
                  <ol className={contractStyles.rulesList}>
                    <li>בכניסה הראשונה חובה להציג תעודה מזהה.</li>
                    <li>
                      השימוש במתקנים מותנה בהשלמת רישום בקבלה, חתימה על תקנון
                      והצהרת בריאות.
                    </li>
                    <li>חובה להגיע לאימון בבגדי ספורט ונעלי ספורט סגורות.</li>
                    <li>
                      <strong>חובה להצטייד במגבת אישית בכל אימון.</strong>
                    </li>
                    <li>יש להקפיד על החזרת הציוד למקומו בסיום התרגיל.</li>
                  </ol>

                  <p className={contractStyles.footerNote}>
                    שים לב: פתיחת המנוי תתאפשר אך ורק למי שקיבל אישור פרטני (לפי
                    שם ות.ז) מרכז התחום בעמותה.
                  </p>
                </div>

                {/* --- Signature Area --- */}
                <div
                  style={{
                    marginTop: "30px",
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "20px",
                    borderRight: "5px solid #8E44AD",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      marginBottom: "20px",
                      color: "#2c3e50",
                      borderBottom: "1px solid #eee",
                      paddingBottom: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    אישור ופרטי החותם
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: window.innerWidth < 600 ? "column" : "row",
                      justifyContent: "space-between",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        lineHeight: "1.8",
                        fontSize: "1rem",
                        color: "#333",
                        width: "100%",
                      }}
                    >
                      <div>
                        <strong>שם מלא:</strong> {selectedMember.memberName}
                      </div>
                      <div>
                        <strong>תעודת זהות:</strong> {selectedMember.memberID}
                      </div>
                      <div>
                        <strong>תאריך:</strong>{" "}
                        {new Date().toLocaleDateString("he-IL")}
                      </div>
                    </div>

                    <div
                      style={{
                        textAlign: "center",
                        minWidth: "180px",
                        width: window.innerWidth < 600 ? "100%" : "auto",
                      }}
                    >
                      <div
                        style={{
                          height: "90px",
                          display: "flex",
                          alignItems: "flex-end",
                          justifyContent: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <img
                          src={`${DOMAIN}/api/v1/gyms/image/${selectedMember.memberID}`}
                          alt="חתימה"
                          style={{
                            maxHeight: "80px",
                            maxWidth: "100%",
                            objectFit: "contain",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                      <div
                        style={{ borderTop: "1px solid #333", width: "100%" }}
                      ></div>
                      <div
                        style={{
                          fontSize: "0.9rem",
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
          </div>

          {/* 3. Fixed Footer Button (מחוץ לגלילה!) */}
          <div className={styles.fixedButtonContainer}>
            <button
              className={styles.downloadButton}
              onClick={handleDownloadPDF}
            >
              📥 הורד PDF להדפסה
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
