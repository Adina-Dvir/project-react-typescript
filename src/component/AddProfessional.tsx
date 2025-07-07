import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProfessional } from '../services/professionalApi';
import { getCategory, addCategory } from '../services/categoryApi';
import type { AddProfessionalForm } from '../type/professionalType';
import '../css/addProfessional.css';

//import './categoryModal.css'; // הוספנו קובץ CSS למודאל
export default function AddProfessional() {
  const [formData, setFormData] = useState<Partial<AddProfessionalForm>>({});
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('עליך להתחבר לפני הוספת עסק');
      navigate('/login');
    }

getCategory()
  .then((res) => setCategories(res.map(c => c.categoryName))) // ✅ שומר רק את השמות
  .catch(console.error);

  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();

    for (const key in formData) {
      if (formData[key as keyof AddProfessionalForm]) {
        data.append(key, formData[key as keyof AddProfessionalForm]!.toString());
      }
    }

    if (selectedCategory) {
      data.append('category', selectedCategory);
    }

    if (image) {
      data.append('fileImage', image);
    }

    try {
      await addProfessional(data);
      alert('העסק נוסף בהצלחה!');
      navigate('/professionals');
    } catch (error) {
      alert('שגיאה בהוספה');
      console.error(error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory) return;
    try {
      await addCategory({
        categoryName: newCategory,
        categoryDescription:  'תיאור ברירת מחדל',
        professionals:[] // ⬅ אם הוא מערך, שלחי אותו ריק
});
      setCategories([...categories, newCategory]);
      setSelectedCategory(newCategory);
      setNewCategory('');
      setShowModal(false);
    } catch (error) {
      alert('שגיאה בהוספת הקטגוריה');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="add-form">
        <h2>הוספת עסק חדש</h2>
        <input name="professionalName" placeholder="שם העסק" onChange={handleChange} required />
        <input name="professionalPhone" placeholder="טלפון" onChange={handleChange} required />
        <input name="professionalEmail" placeholder="אימייל" onChange={handleChange} />
        <input name="professionalAdress" placeholder="כתובת" onChange={handleChange} />
        <input name="subject" placeholder="תחום" onChange={handleChange} />
        <input name="professionalDescription" placeholder="תיאור" onChange={handleChange} />
        <input name="professionalPlace" placeholder="אזור" onChange={handleChange} />
        <input name="priceRange" placeholder="טווח מחירים" onChange={handleChange} />

        <label>קטגוריה:</label>
        <select onChange={(e) => {
          if (e.target.value === '__add_new__') {
            setShowModal(true);
          } else {
            setSelectedCategory(e.target.value);
          }
        }} value={selectedCategory || ''}>
          <option value="">בחר קטגוריה</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          <option value="__add_new__">➕ הוסף קטגוריה חדשה</option>
        </select>

        <input type="file" onChange={handleFileChange} />
        <button type="submit">שלח</button>
      </form>

      {/* מודאל */}
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
    </>
  );
}
