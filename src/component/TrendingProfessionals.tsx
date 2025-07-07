import { useEffect, useState } from "react";
import { getTrendingProfessionals } from "../services/professionalApi";
import type { Professional } from "../type/professionalType";
import { Link } from "react-router-dom";
import "../css/TrendingProfessionals.css";

export default function TrendingProfessionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getTrendingProfessionals();
        setProfessionals(data);
      } catch (error) {
        console.error("שגיאה בטעינת העסקים הטרנדיים:", error);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="trending-container">
      <h2>🔥 העסקים הטרנדיים</h2>
      <div className="trending-list">
        {professionals.map((p) => (
          <Link
            key={p.professionalId}
            to={`/professional/${p.professionalId}`}
            className="trending-item"
          >
            <img
              src={
                p.images && p.images.length > 0
                  ? `data:image/jpeg;base64,${p.images[0].ImageData}`
                  : "/images/default-professional.jpg"
              }
              alt={p.professionalName}
            />
            <p>{p.professionalName}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
