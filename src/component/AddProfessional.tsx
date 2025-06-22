import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProfessional } from '../services/professionalApi';
import type { AddProfessionalForm } from '../type/professionalType';
import '../css/addProfessional.css'

export default function AddProfessional() {
  const [formData, setFormData] = useState<Partial<AddProfessionalForm>>({});
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  // ✅ בדיקה אם המשתמש מחובר
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('עליך להתחבר לפני הוספת עסק');
      navigate('/login'); // שים כאן את הנתיב שלך לדף התחברות
    }
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
    if (image) data.append('fileImage', image);

    try {
      await addProfessional(data);
      alert('העסק נוסף בהצלחה!');
      navigate('/professionals');
    } catch (error) {
      alert('שגיאה בהוספה');
      console.error(error);
    }
  };

  return (
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
      <input type="file" onChange={handleFileChange} />
      <button type="submit">שלח</button>
    </form>
  );
}
