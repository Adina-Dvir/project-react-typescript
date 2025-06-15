// src/components/ProfessionalsList.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfessionals } from "../features/Professional/professionalSlice"; // מייבאים את הפעולה לשליפת העסקים
import "../css/professionals.css"; // עיצוב מותאם

export default function professionals() {
  const dispatch = useDispatch();

  // מביאים את הנתונים מתוך ה-Redux store
  const { professionals, loading, error } = useSelector((state) => state.professionals);

  // כאשר הקומפוננטה עולה - קוראים ל-API דרך Redux thunk
  useEffect(() => {
    dispatch(fetchProfessionals());
  }, [dispatch]);

  console.log("Professionals from Redux:", professionals);

  // מציג הודעת טעינה אם עדיין טוען
  if (loading) return <p>Loading...</p>;

  // מציג שגיאה אם הייתה
  if (error) return <p>Error: {error}</p>;

  // מציג את הנתונים אם הכל תקין
  return (
    <div className="professionals-container">
      {professionals.map((professional) => (
        <div className="professional-card" key={professional.professionalId}>
          <div className="circle-icon">
            {professional.professionalName ? professional.name.charAt(0).toUpperCase() : "?"}
          </div>
          <h3>{professional.name}</h3>
          <p>{professional.phoneNumber}</p>
          <p className="address">{professional.address}</p>
          <div className="buttons">
            <button>View</button>
            <button>Add to favourites</button>
          </div>
        </div>
      ))}
    </div>
  );
}
