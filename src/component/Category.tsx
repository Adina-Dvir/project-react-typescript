// components/Categories.js
import  { useEffect, useState } from "react";
import { getCategory } from "../services/categoryApi"; // שירות שמביא את הקטגוריות מהשרת
import '../css/category.css'; // קובץ עיצוב ייעודי
import type {Category} from '../type/categoryType.js'

export default function Categories() {
  // יצירת state לאחסון הקטגוריות שהתקבלו מהשרת
  const [categories, setCategories] = useState<Category[]>([]);

  // state עבור שגיאה אפשרית אם הבקשה לשרת נכשלת
  const [error, setError] = useState<string|null>(null);

  // useEffect פועל ברגע שהקומפוננטה נטענת בפעם הראשונה
  useEffect(() => {
    const fetchData = async () => {
      try {
        // קריאה לשרת דרך פונקציית השירות
        const data = await getCategory();

        // שמירת התוצאה ב-state
        setCategories(data);
      } catch (err) {
        // טיפול בשגיאה - נציג הודעה מתאימה במסך
        console.error("שגיאה בטעינת הקטגוריות:", err);
        setError("אירעה שגיאה בטעינת הקטגוריות.");
      }
    };

    fetchData();
  }, []);

  // הצגת הודעת שגיאה אם הייתה
  if (error) return <div className="categories-error">{error}</div>;

  return (
    <div className="categories-wrapper">
      {categories.map((category) => (
        <div key={category.categoryId} className="category-card">
          <div className="category-header">
            {/* לוגו של האתר או סמל */}
            <img
              src="/images/logo-circle.png" // שימי את הקובץ הזה בתיקיית public/images
              alt="My Bcard"
              className="category-logo"
            />
          </div>

          {/* שם הקטגוריה */}
          <h3 className="category-title">{category.categoryName}</h3>

          {/* תיאור קצר */}
          <p className="category-description">{category.categoryDescription}</p>

          {/* כפתורים */}
          <div className="category-buttons">
            <button className="view-btn">View Category</button>
            <button className="add-btn">Add a Professional</button>
          </div>
        </div>
      ))}
    </div>
  );
}
