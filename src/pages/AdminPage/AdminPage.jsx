import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import styles from "./AdminPage.module.css";
// ייבוא הסטיילים של דף החוזה כדי להבטיח זהות מוחלטת
import contractStyles from "../ContractPage/ContractPage.module.css";
import { getAllMembers } from "../../services/gymMemberService";
import { DOMAIN } from "../../constants";
import LogoImage from "../../assets/images/shekel-logo.png";
import EyeIcon from "../../assets/icons/eye.svg";

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

  const getSigningDate = (member) => {
    if (member.createdAt) {
      return new Date(member.createdAt).toLocaleDateString("he-IL");
    }
    if (member._id) {
      const timestamp = parseInt(member._id.substring(0, 8), 16) * 1000;
      return new Date(timestamp).toLocaleDateString("he-IL");
    }
    return "לא ידוע";
  };

  const handleViewContract = (member) => {
    setSelectedMember(member);
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
    document.body.style.overflow = "auto";
  };

  const handleDownloadPDF = async () => {
    if (!contractRef.current) return;

    // 1. יצירת שכפול של האלמנט (כדי לא לשנות את מה שרואים על המסך)
    const clone = contractRef.current.cloneNode(true);

    // 2. כפיית עיצוב דסקטופ על השכפול
    // הגדרות כלליות לנייר
    clone.style.width = "800px"; // רוחב קבוע של דסקטופ
    clone.style.maxWidth = "none";
    clone.style.minHeight = "auto";
    clone.style.padding = "70px 60px"; // ה-Padding של הדסקטופ
    clone.style.margin = "0";
    clone.style.position = "fixed";
    clone.style.top = "-10000px"; // הסתרה מחוץ למסך
    clone.style.left = "0";
    clone.style.zIndex = "-1000";
    clone.style.backgroundColor = "#ffffff";
    clone.style.direction = "rtl"; // וידוא כיוון

    // תיקון כותרת (שתהיה גדולה כמו בדסקטופ)
    const title = clone.querySelector('[data-id="header-title"]');
    if (title) title.style.fontSize = "2.2rem";

    // תיקון שורת החתימות (שורה אחת במקום עמודה)
    const sigRow = clone.querySelector('[data-id="signature-row"]');
    if (sigRow) {
      sigRow.style.display = "flex";
      sigRow.style.flexDirection = "row"; // שורה!
      sigRow.style.justifyContent = "space-between";
      sigRow.style.alignItems = "flex-end";
      sigRow.style.gap = "20px";
    }

    // תיקון אזור הפרטים
    const sigDetails = clone.querySelector('[data-id="signature-details"]');
    if (sigDetails) {
      sigDetails.style.width = "auto";
      sigDetails.style.textAlign = "right";
    }

    // תיקון אזור התמונה
    const sigImage = clone.querySelector('[data-id="signature-image"]');
    if (sigImage) {
      sigImage.style.width = "auto";
      sigImage.style.marginTop = "0";
      sigImage.style.minWidth = "200px";
      sigImage.style.textAlign = "center";
    }

    // 3. הוספת השכפול ל-body (חובה כדי ש-html2canvas יוכל לצלם אותו)
    document.body.appendChild(clone);

    try {
      // 4. צילום השכפול
      const canvas = await html2canvas(clone, {
        scale: 2, // איכות גבוהה
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: 1200, // מדמה מסך רחב
      });

      // 5. יצירת PDF
      const imgData = canvas.toDataURL("image/png");
      const imgWidthPx = canvas.width;
      const imgHeightPx = canvas.height;

      const pdfWidth = 210; // A4 width mm
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
    } finally {
      // 6. ניקוי - מחיקת השכפול
      document.body.removeChild(clone);
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
              <th>תאריך חתימה</th>
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
                  <td>
                    <div
                      className={styles.mobileLabel}
                      style={{ display: "none" }}
                    >
                      שם:
                    </div>
                    {member.memberName}
                  </td>
                  <td>
                    <div
                      className={styles.mobileLabel}
                      style={{ display: "none" }}
                    >
                      ת.ז:
                    </div>
                    {member.memberID}
                  </td>
                  <td>
                    <div
                      className={styles.mobileLabel}
                      style={{ display: "none" }}
                    >
                      תאריך:
                    </div>
                    {getSigningDate(member)}
                  </td>
                  <td>
                    <button
                      className={`${styles.actionBtn} ${styles.viewBtn}`}
                      onClick={() => handleViewContract(member)}
                      title="צפה בחוזה החתום"
                    >
                      <img
                        src={EyeIcon}
                        alt="צפייה"
                        className={styles.eyeIcon}
                      />
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
          <button className={styles.mobileCloseBtn} onClick={handleCloseModal}>
            ✕
          </button>

          <div className={styles.backdrop} onClick={handleCloseModal}></div>

          <div
            className={styles.scrollContainer}
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseModal();
            }}
          >
            <div className={styles.contractWrapper}>
              <div
                ref={contractRef}
                className={contractStyles.paper}
                style={{
                  margin: "0 auto",
                  minHeight: "auto",
                  // שימוש ב-inline style דינמי למובייל - לא משפיע על ההורדה כי אנחנו משכפלים ודורסים
                  padding: window.innerWidth < 600 ? "30px 20px" : "70px 60px",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                <div className={contractStyles.header}>
                  <img
                    src={LogoImage}
                    alt="לוגו שק'ל"
                    className={contractStyles.logoImage}
                  />
                  <h1
                    data-id="header-title"
                    className={contractStyles.mainTitle}
                    style={{
                      fontSize: window.innerWidth < 600 ? "1.5rem" : "2.2rem",
                    }}
                  >
                    הסכם שימוש ומנוי חדר כושר
                  </h1>
                </div>

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
                    data-id="signature-row"
                    style={{
                      display: "flex",
                      flexDirection: window.innerWidth < 600 ? "column" : "row",
                      justifyContent: "space-between",
                      gap: "20px",
                    }}
                  >
                    <div
                      data-id="signature-details"
                      style={{
                        lineHeight: "1.8",
                        fontSize: "1rem",
                        color: "#333",
                        width: window.innerWidth < 600 ? "100%" : "auto",
                      }}
                    >
                      <div>
                        <strong>שם מלא:</strong> {selectedMember.memberName}
                      </div>
                      <div>
                        <strong>תעודת זהות:</strong> {selectedMember.memberID}
                      </div>
                      <div>
                        <strong>תאריך:</strong> {getSigningDate(selectedMember)}
                      </div>
                    </div>

                    <div
                      data-id="signature-image"
                      style={{
                        textAlign: "center",
                        minWidth: "180px",
                        width: window.innerWidth < 600 ? "100%" : "auto",
                        marginTop: window.innerWidth < 600 ? "20px" : "0",
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
