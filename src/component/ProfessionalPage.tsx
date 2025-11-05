// ייבוא React ו־Hooks רלוונטיים
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// ייבוא פונקציות שירות עבור אנשי מקצוע
import { getProfessionalById, sendEmailToProfessional } from "../services/professionalApi";

// טיפוס TypeScript של איש מקצוע
import type { Professional } from "../type/professionalType";

// ייבוא CSS מותאם לדף
import '../css/ProfessionalPage.css';

// קומפוננטה להצגת פרטי איש מקצוע מסוים
export default function ProfessionalPage() {
  const { id } = useParams<{ id: string }>(); // קבלת מזהה איש מקצוע מה-URL

  // סטייטים מקומיים
  const [professional, setProfessional] = useState<Professional | null>(null); // הנתונים על איש המקצוע
  const [subject, setSubject] = useState(''); // שדה נושא ההודעה
  const [body, setBody] = useState(''); // גוף ההודעה
  const [senderEmail, setSenderEmail] = useState(''); // האימייל של השולח
  const [status, setStatus] = useState<string | null>(null); // סטטוס השליחה
  const [showForm, setShowForm] = useState(false); // האם להציג את טופס המייל
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // תמונה נבחרת לתצוגה

  // טעינת נתוני איש מקצוע עם העלאת הקומפוננטה
  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        const prof = await getProfessionalById(Number(id)); // שליפת פרטי איש מקצוע לפי מזהה
        setProfessional(prof);
        if (prof.images && prof.images.length > 0) {
          setSelectedImage(prof.images[0].imageBase64); // הגדרת תמונה ראשית
        }
      } catch (error) {
        console.error("שגיאה בטעינת העסק:", error);
      }
    };
    loadData();
  }, [id]);

  // שליחת אימייל לאיש המקצוע
  const handleSendEmail = async () => {
    if (!professional?.professionalEmail) return;

    try {
      await sendEmailToProfessional({
        recipient: professional.professionalEmail,
        subject,
        msgBody: `${body}\n\nנשלח על ידי: ${senderEmail}`,
      });

      setStatus("הודעה נשלחה בהצלחה ✅");
      setSubject('');
      setBody('');
      setSenderEmail('');
      setShowForm(false);
    } catch (err) {
      console.error("שגיאה בשליחת המייל", err);
      setStatus("אירעה שגיאה בשליחה ❌");
    }
  };

  // במקרה שהנתונים עדיין לא נטענו
  if (!professional) return <p>טוען...</p>;

  return (
    <div className="page-container">
      {/* צד שמאל – תמונה ראשית וכפתורי תצוגה לתמונות */}
      <div className="left-panel">
        {selectedImage && (
          <img className="main-image" src={selectedImage} alt="תמונה ראשית" />
        )}
        <div className="image-tabs">
          {professional.images?.map((img, index) => (
            <button
              key={index}
              className={`tab-button ${selectedImage === img.imageBase64 ? 'active' : ''}`}
              onClick={() => setSelectedImage(img.imageBase64)}
            >
              IMAGE {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* צד ימין – פרטי איש מקצוע + טופס מייל */}
      <div className="right-panel">
        <h2>{professional.professionalName}</h2>
        <p><strong>טלפון:</strong> {professional.professionalPhone}</p>

        {/* קישור לגוגל מפות עם כתובת העסק */}
        <p>
          <strong>כתובת:</strong> {professional.professionalAdress} {professional.city}{' '}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${professional.professionalAdress}, ${professional.city}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            title="נווט בגוגל מפות"
            className="map-link"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              viewBox="0 0 16 16"
              style={{ verticalAlign: 'middle', marginRight: '4px' }}
            >
              <path d="M8 0a5.53 5.53 0 0 0-5.5 5.5c0 3.037 5.5 10.5 5.5 10.5s5.5-7.463 5.5-10.5A5.53 5.53 0 0 0 8 0zm0 7.5A2 2 0 1 1 8 3a2 2 0 0 1 0 4.5z" />
            </svg>
          </a>
        </p>

        <p><strong>תיאור:</strong> {professional.professionalDescription}</p>
        <p><strong>אימייל:</strong> {professional.professionalEmail}</p>

        {/* כפתור לפתיחת טופס שליחה */}
        <button onClick={() => setShowForm(!showForm)}>
          שלח מייל לעסק
        </button>

        {/* טופס שליחת מייל */}
        {showForm && (
          <div className="email-form-popup">
            <h4>טופס שליחת הודעה</h4>
            <input
              type="email"
              placeholder="האימייל שלך"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="נושא ההודעה"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <textarea
              placeholder="תוכן ההודעה"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <button onClick={handleSendEmail}>שלח מייל</button>
            {status && <p className="status-msg">{status}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
