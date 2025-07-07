import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProfessionalById } from "../services/professionalApi";
import type { Professional } from "../type/professionalType";
import '../css/ProfessionalPage.css';

export default function ProfessionalPage() {
  const { id } = useParams<{ id: string }>();
  const [professional, setProfessional] = useState<Professional | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const prof = await getProfessionalById(Number(id));
        setProfessional(prof);
      } catch (error) {
        console.error("שגיאה בטעינת העסק:", error);
      }
    };

    loadData();
  }, [id]);

  if (!professional) return <p>טוען...</p>;

  return (
    <div className="page-container">
      <div className="left-panel">
       {professional.images && professional.images.length > 0 ? (
  <div className="image-gallery">
    {professional.images.map((imgObj, index) => (
      <img
        key={index}
        src={`data:image/jpeg;base64,${imgObj.imagePath}`}
        alt={imgObj.fileName}
        className="thumbnail"
      />
    ))}
  </div>
) : (
  <img
    src="/images/default-professional.jpg"
    alt={professional.professionalName}
    className="main-image"
  />
)}

      </div>

      <div className="right-panel">
        <h2>{professional.professionalName}</h2>
        <p><strong>Phone:</strong> {professional.professionalPhone}</p>
        <p><strong>Email:</strong> {professional.professionalEmail}</p>
        <p><strong>Address:</strong> {professional.professionalAdress}</p>
        <p><strong>City:</strong> {professional.city}</p>
        <p><strong>Price:</strong> {professional.priceRange}</p>
        <p><strong>Experience:</strong> {professional.years ?? 'לא הוזן'}</p>
        <p><strong>About:</strong> {professional.professionalDescription}</p>
      </div>
    </div>
  );
}
