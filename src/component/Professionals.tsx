// ייבוא React וה־Hooks הדרושים
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// טיפוסים מותאמים ל־Redux
import type { TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from '../store/store';

// אקשן לטעינת אנשי מקצוע מה־Redux Slice
import { fetchProfessionals } from "../features/Professional/professionalSlice";

// פונקציה חיצונית להוספת קליק לצפייה בעסק
import { addClickForProfessional } from "../services/professionalApi";

// עיצוב CSS לדף
import "../css/professionals.css";

// טיפוס של Professional
import type { Professional } from "../type/professionalType";

// ספריית ניווט
import { Link, useNavigate } from "react-router-dom";

// שימוש בטיפוסים מוגדרים מראש
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// קומפוננטה להצגת רשימת אנשי מקצוע
export default function Professionals() {
  const dispatch = useAppDispatch(); // יצירת dispatch לפעולות Redux
  const navigate = useNavigate(); // ניווט עם React Router

  // שליפת הנתונים מה־Redux store
  const { professionals, loading, error } = useAppSelector((state) => state.professionals);

  // טעינת אנשי מקצוע כאשר הקומפוננטה עולה
  useEffect(() => {
    console.log("📣 useEffect ran – dispatching fetchProfessionals");
    dispatch(fetchProfessionals());
  }, [dispatch]);

  // הדפסה לקונסול לבדיקת הנתונים
  console.log("Professionals from Redux:", professionals);

  // במצב טעינה
  if (loading) return <p>Loading...</p>;

  // במקרה של שגיאה
  if (error) return <p>Error: {error}</p>;

  // לחיצה על כפתור צפייה – מוסיפה קליק ופותחת את עמוד הפרופיל
  const handleViewClick = async (professionalId: number) => {
    try {
      await addClickForProfessional(professionalId); // קריאה לשרת להוספת קליק
      navigate(`/professional/${professionalId}`); // ניווט לעמוד של איש מקצוע
    } catch (err) {
      console.error("Failed to add click", err);
      navigate(`/professional/${professionalId}`); // מנווט גם במקרה של שגיאה
    }
  };

  return (
    <div className="professionals-container">
      {/* במקרה ואין תוצאות */}
      {professionals.length === 0 ? (
        <p>לא נמצאו עסקים להצגה.</p>
      ) : (
        // הצגת כל אנשי המקצוע
        professionals.map((professional: Professional) => (
          <div className="professional-card" key={professional.professionalId}>
            {/* אייקון עיגול עם האות הראשונה של השם */}
            <div className="circle-icon">
              {professional.professionalName ? professional.professionalName.charAt(0).toUpperCase() : "?"}
            </div>

            {/* שם, טלפון, כתובת */}
            <h3>{professional.professionalName}</h3>
            <p>{professional.professionalPhone}</p>
            <p className="address">{professional.professionalAdress}</p>

            {/* כפתורי פעולה */}
            <div className="buttons">
              <button onClick={() => handleViewClick(professional.professionalId)} className="btn-view">
                View
              </button>
              <button>Add to favourites</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
