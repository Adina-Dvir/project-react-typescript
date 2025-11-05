/*
  קובץ: AddProfessionalDocumented.tsx
  תיאור כללי:
  ----------------
  קומפוננטת React (עם TypeScript) להוספת איש מקצוע/עסק חדש.
  הקומפוננטה מציגה טופס, שולחת את הנתונים ל‑API, מאפשרת העלאת
  תמונות והוספת קטגוריה חדשה במידת הצורך.
  *** הקוד המקורי נשמר אחד‑לאחד – נוספו רק הערות ותיעוד בעברית. ***
*/

// ===== ייבוא ספריות React ושירותי ניווט =====
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ===== ייבוא קריאות API =====
import { addProfessional } from '../services/professionalApi';
import { getCategory, addCategory } from '../services/categoryApi';

// ===== טיפוסי TypeScript =====
import type { AddProfessionalForm } from '../type/professionalType';

// ===== עיצוב =====
import '../css/addProfessional.css';

// טיפוס פנימי לקטגוריה
interface Category {
  categoryId: number;
  categoryName: string;
}

// ------------------------------------------------------
// קומפוננטת AddProfessional 
// ------------------------------------------------------
export default function AddProfessional() {
  // --- מצבי טופס ---
  const [formData, setFormData] = useState<Partial<AddProfessionalForm>>({}); // נתוני הטופס
  const [images, setImages] = useState<File[]>([]);                           // תמונות שנבחרו
  const [categories, setCategories] = useState<Category[]>([]);               // רשימת קטגוריות קיימות
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null); // קטגוריה נבחרת
  const [showModal, setShowModal] = useState(false);                          // האם להציג מודל הוספת קטגוריה
  const [newCategory, setNewCategory] = useState('');                         // שם קטגוריה חדשה
  const navigate = useNavigate();                                             // להחלפת נתיב צד‑לקוח

  // --------------------------------------------------
  // useEffect – רץ בהעלאת הקומפוננטה בלבד
  // --------------------------------------------------
  useEffect(() => {
    // 1. בדיקה בסיסית – האם המשתמש מחובר (token בלוקל סטורג')
    const token = localStorage.getItem('token');
    if (!token) {
      alert('עליך להתחבר לפני הוספת עסק');
      navigate('/login');
    }

    // 2. שליפת רשימת קטגוריות קיימות מהשרת
    getCategory()
      .then((res) => setCategories(res))
      .catch(console.error);
  }, []); // מערך תלות ריק ⇒ ריצה פעם אחת

  // --------------------------------------------------
  // handleChange – עדכון נתוני טופס כלליים
  // --------------------------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --------------------------------------------------
  // handleFileChange – קבצי תמונות
  // --------------------------------------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  // --------------------------------------------------
  // handleSubmit – שליחת הטופס ל‑API
  // --------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // מניעת רענון דף

    const data = new FormData(); // FormData מאפשר שליחת קבצים + טקסט

    // הוספת שדות רק אם מולאו (נמנע שדות ריקים)
    if (formData.ProfessionalName) data.append('ProfessionalName', formData.ProfessionalName);
    if (formData.ProfessionalPhone) data.append('ProfessionalPhone', formData.ProfessionalPhone);
    if (formData.ProfessionalEmail) data.append('ProfessionalEmail', formData.ProfessionalEmail);
    if (formData.ProfessionalAdress) data.append('ProfessionalAdress', formData.ProfessionalAdress);
    if (formData.City) data.append('City', formData.City);
    if (formData.ProfessionalDescription) data.append('ProfessionalDescription', formData.ProfessionalDescription);
    if (formData.ProfessionalPlace) data.append('ProfessionalPlace', formData.ProfessionalPlace);
    if (formData.PriceRange) data.append('PriceRange', formData.PriceRange);
    if (formData.ProfessionalPassword) data.append('ProfessionalPassword', formData.ProfessionalPassword);

    // קטגוריה נבחרת (אם יש)
    if (selectedCategoryId !== null) {
      data.append('CategoryId', selectedCategoryId.toString());
    }

    // תמונות
    images.forEach((img) => {
      data.append('fileImages', img);
    });

    // (אופציונלי) token → ניתן להוסיף לכותרת בבקשה; כאן לשם דוגמה – מאוחזר אך לא בשימוש
    const token = localStorage.getItem('token');

    try {
      await addProfessional(data); // קריאה ל‑API
      alert('העסק נוסף בהצלחה!');
      navigate('/professionals');  // מעבר לרשימת עסקים
    } catch (error: any) {
      alert('שגיאה בהוספה: ' + (error.response?.data || ''));
      console.error(error);
    }
  };

  // --------------------------------------------------
  // handleAddCategory – הוספת קטגוריה חדשה דרך המודל
  // --------------------------------------------------
  const handleAddCategory = async () => {
    if (!newCategory) return;
    try {
      const added = await addCategory({
        categoryName: newCategory,
        categoryDescription: 'תיאור ברירת מחדל', // כרגע תיאור קבוע
        professionals: []
      });

      // עדכון ה‑state המקומי עם הקטגוריה החדשה
      setCategories([...categories, added]);
      setSelectedCategoryId(added.categoryId);
      setNewCategory('');
      setShowModal(false);
    } catch (error) {
      alert('שגיאה בהוספת הקטגוריה');
    }
  };

  // --------------------------------------------------
  // JSX – מבנה הטופס והמודל
  // --------------------------------------------------
  return (
    <div className="form-container">
      {/* טופס הוספת עסק */}
      <form onSubmit={handleSubmit} className="add-form">
        <h2>הוספת עסק חדש</h2>

        {/* שדות טקסט */}
        <input name="ProfessionalName" placeholder="שם העסק" onChange={handleChange} required />
        <input name="ProfessionalPhone" placeholder="טלפון" onChange={handleChange} required />
        <input name="ProfessionalEmail" placeholder="אימייל" onChange={handleChange} />
        <input name="ProfessionalAdress" placeholder="כתובת" onChange={handleChange} />
        <input name="ProfessionalPassword" placeholder="סיסמא" onChange={handleChange} />
        <input name="City" placeholder="עיר" onChange={handleChange} />
        <input name="ProfessionalDescription" placeholder="תיאור" onChange={handleChange} />
        <input name="professionalPlace" placeholder="אזור" onChange={handleChange} />
        <input name="PriceRange" placeholder="טווח מחירים" onChange={handleChange} />

        {/* בחירת קטגוריה */}
        <label>קטגוריה:</label>
        <select
          onChange={(e) => {
            const value = e.target.value;
            if (value === '__add_new__') {
              setShowModal(true); // פותח מודל הוספת קטגוריה
            } else {
              setSelectedCategoryId(Number(value));
            }
          }}
          value={selectedCategoryId?.toString() || ''}
        >
          <option value="">בחר קטגוריה</option>
          {categories.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.categoryName}
            </option>
          ))}
          <option value="__add_new__">➕ הוסף קטגוריה חדשה</option>
        </select>

        {/* העלאת תמונות */}
        <label>תמונות:</label>
        <input type="file" multiple onChange={handleFileChange} />

        {/* כפתור שליחה */}
        <button type="submit">שלח</button>
      </form>

      {/* מודל הוספת קטגוריה */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>הוספת קטגוריה חדשה</h3>
            <input
              type="text"
              placeholder="שם הקטגוריה"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleAddCategory}>שמור</button>
              <button onClick={() => setShowModal(false)}>ביטול</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
