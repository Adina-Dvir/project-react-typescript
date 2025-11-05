// components/Categories.tsx

import { useEffect, useState } from "react"; // שימוש ב-hooks לניהול מצב וטעינה
import { getCategory } from "../services/categoryApi"; // פונקציה שמביאה קטגוריות מהשרת
import '../css/category.css'; // קובץ CSS מותאם לקומפוננטה
import type { Category } from '../type/categoryType.js'; // טיפוס נתונים של קטגוריה
import { Link, useNavigate } from 'react-router-dom'; // ניווט בין דפים

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]); // רשימת קטגוריות
  const [error, setError] = useState<string | null>(null); // משתנה לשמירת שגיאה אם קיימת
  const navigate = useNavigate(); // שימוש בפונקציית ניווט מ־React Router

  // useEffect פועל פעם אחת בעת טעינת הקומפוננטה – שולף את הקטגוריות
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCategory(); // קריאה ל־API
        setCategories(data); // שמירת הקטגוריות ב־state
      } catch (err) {
        console.error("שגיאה בטעינת הקטגוריות:", err);
        setError("אירעה שגיאה בטעינת הקטגוריות."); // אם יש שגיאה – עדכון ה־state
      }
    };

    fetchData(); // הפעלת הקריאה
  }, []);

  // פונקציה שמנווטת לעמוד הוספת עסק
  const handleAddProfessionalClick = () => {
    navigate('/addProfessional');
  };

  // הצגת הודעת שגיאה אם יש כזו
  if (error) return <div className="categories-error">{error}</div>;

  return (
    <div className="categories-wrapper">
      {categories.map((category) => (
        <div key={category.categoryId} className="category-card">
          <div className="category-header">
            <img
              src="/images/logo-circle.png" // תמונת לוגו מהתיקייה public/images
              alt="My Bcard"
              className="category-logo"
            />
          </div>

          <h3 className="category-title">{category.categoryName}</h3> {/* כותרת */}
          <p className="category-description">{category.categoryDescription}</p> {/* תיאור */}

          <div className="category-buttons">
            {/* קישור לעמוד הקטגוריה */}
            <Link to={`/categories/${category.categoryId}`} className="view-btn">
              View Category
            </Link>

            {/* כפתור שמנווט לעמוד הוספת עסק */}
            <button className="add-btn" onClick={handleAddProfessionalClick}>
              Add a Professional
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
