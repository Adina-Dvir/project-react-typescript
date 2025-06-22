import axios from 'axios';
// 🧾 תבנית שמייצגת את ProfessionalsDto מהשרת (C#)
import type{Professional,ProfessionalState}from '../type/professionalType'; // מייבאים את הטיפוס של איש מקצוע
// 📥 מביא את כל אנשי המקצוע
export const getProfessional = async (): Promise<Professional[]> => {
  try {
    const response = await axios.get<Professional[]>('https://localhost:7111/api/Professional');
    console.log("Fetched professionals:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching professionals:", error);
    throw error;
  }
};

// 📥 מביא איש מקצוע לפי מזהה
export const getProfessionalById = async (id: number): Promise<Professional> => {
  try {
    const response = await axios.get<Professional>(`https://localhost:7111/api/Professional/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching professional with id ${id}:`, error);
    throw error;
  }
};

// ➕ מוסיף איש מקצוע חדש (ללא professionalId)
export const addProfessional = async (formData: FormData): Promise<void> => {
  await axios.post('https://localhost:7111/api/Professional', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};


// ✏️ מעדכן איש מקצוע קיים
export const updateProfessional = async (
  id: number,
  professionalData: Partial<Omit<Professional, 'professionalId'>>
): Promise<Professional> => {
  try {
    const response = await axios.put<Professional>(
      `https://localhost:7111/api/Professional/${id}`,
      professionalData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating professional with id ${id}:`, error);
    throw error;
  }
};

// ❌ מוחק איש מקצוע לפי מזהה
export const deleteProfessional = async (id: number): Promise<void> => {
  try {
    await axios.delete(`https://localhost:7111/api/Professional/${id}`);
  } catch (error) {
    console.error(`Error deleting professional with id ${id}:`, error);
    throw error;
  }
};
