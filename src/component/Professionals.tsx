// src/components/ProfessionalsList.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux"; // טייפ של Redux
import { fetchProfessionals } from "../features/Professional/professionalSlice"; // פעולה לטעינת עסקים
import "../css/professionals.css"; // עיצוב
import type { Professional } from "../type/professionalType"; // טייפ של מקצוען
import type { AppDispatch, RootState } from '../store/store'; // טייפ של ה־Redux root state
import { Link, useNavigate } from "react-router-dom";
import { addClickForProfessional } from "../services/professionalApi"; // הייבוא של הפונקציה להוספת קליק

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function Professionals() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // מביאים את הנתונים מתוך ה־Redux store
  const { professionals, loading, error } = useAppSelector((state) => state.professionals);

  useEffect(() => {
    console.log("📣 useEffect ran – dispatching fetchProfessionals");
    dispatch(fetchProfessionals());
  }, [dispatch]);

  console.log("Professionals from Redux:", professionals);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // פונקציה שמוסיפה קליק ופותחת את עמוד הפרופיל
  const handleViewClick = async (professionalId: number) => {
    try {
      await addClickForProfessional(professionalId);
      // לאחר ההוספה ניווט לדף העסק
      navigate(`/professional/${professionalId}`);
    } catch (err) {
      console.error("Failed to add click", err);
      // בכל מקרה ננווט גם אם יש שגיאה
      navigate(`/professional/${professionalId}`);
    }
  };

  return (
    <div className="professionals-container">
      {professionals.map((professional: Professional) => (
        <div className="professional-card" key={professional.professionalId}>
          <div className="circle-icon">
            {professional.professionalName ? professional.professionalName.charAt(0).toUpperCase() : "?"}
          </div>
          <h3>{professional.professionalName}</h3>
          <p>{professional.professionalPhone}</p>
          <p className="address">{professional.professionalAdress}</p>
          <div className="buttons">
            <button onClick={() => handleViewClick(professional.professionalId)} className="btn-view">
              View
            </button>
            <button>Add to favourites</button>
          </div>
        </div>
      ))}
    </div>
  );
}
