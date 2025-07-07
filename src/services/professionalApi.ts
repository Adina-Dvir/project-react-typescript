import axios from 'axios';
import type { Professional, ProfessionalState } from '../type/professionalType';

const baseUrl = 'https://localhost:7111/api/Professional';
// ➕ מוסיף קליק לעסק לפי מזהה
export const addClickForProfessional = async (professionalId: number): Promise<void> => {
  try {
    await axios.post(
      'https://localhost:7111/api/Trending',
      { professionalId },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error("Error adding click:", error);
    throw error;
  }
};

// 📥 מביא את כל אנשי המקצוע
export const getProfessional = async (): Promise<Professional[]> => {
  try {
    const response = await axios.get<Professional[]>(baseUrl);
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
    const response = await axios.get<Professional>(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching professional with id ${id}:`, error);
    throw error;
  }
};

// 🔥 מביא את חמשת אנשי המקצוע הכי טרנדיים
export const getTrendingProfessionals = async (): Promise<Professional[]> => {
  try {
    const response = await axios.get<Professional[]>('https://localhost:7111/api/Trending/top5');
    console.log("Fetched trending professionals:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching trending professionals:", error);
    throw error;
  }
};


// ➕ מוסיף איש מקצוע חדש (ללא professionalId)
export const addProfessional = async (formData: FormData): Promise<void> => {
  const token = localStorage.getItem('token');
  console.log("טוקן שנשלח:", token);

  await axios.post(baseUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
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
      `${baseUrl}/${id}`,
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
    await axios.delete(`${baseUrl}/${id}`);
  } catch (error) {
    console.error(`Error deleting professional with id ${id}:`, error);
    throw error;
  }
  
};

