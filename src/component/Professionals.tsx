// src/components/ProfessionalsList.jsx
import React, { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux"; // מייבאים את הטייפ של ה-Redux
import { fetchProfessionals } from "../features/Professional/professionalSlice"; // מייבאים את הפעולה לשליפת העסקים
import "../css/professionals.css"; // עיצוב מותאם
import type { Professional } from "../type/professionalType"; // מייבאים את הטיפוס של מקצוען
import type {AppDispatch, RootState } from '../store/store'; // טייפ של ה-Redux root state


const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function Professionals() {
  const dispatch = useAppDispatch();

  // מביאים את הנתונים מתוך ה-Redux store
  const { professionals, loading, error } = useSelector((state:RootState) => state.professionals);

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
      {professionals.map((professional:Professional) => (
        <div className="professional-card" key={professional.professionalId}>
          <div className="circle-icon">
            {professional.professionalName ? professional.professionalName.charAt(0).toUpperCase() : "?"}
          </div>
          <h3>{professional.professionalName}</h3>
          <p>{professional.professionalPhone}</p>
          <p className="address">{professional.professionalAdress}</p>
          <div className="buttons">
            <button>View</button>
            <button>Add to favourites</button>
          </div>
        </div>
      ))}
    </div>
  );
}
