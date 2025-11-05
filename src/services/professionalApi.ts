import axios from 'axios';
import type { Professional } from '../type/professionalType';
import type { EmailDetails } from '../type/emailType'; // תוודאי שהטיפוס קיים

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

// 📤 שליחת מייל לעסק
export const sendEmailToProfessional = async (emailDetails: EmailDetails): Promise<void> => {
  try {
    await axios.post('https://localhost:7111/api/Professional/send-email', emailDetails, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error sending email:", error);
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

// ➕ מוסיף עסק
export const addProfessional = async (professionalData: FormData): Promise<Professional> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error("אין טוקן - המשתמש לא מחובר");
  }

  console.log("טוקן שנשלח:", token);

  const response = await axios.post('https://localhost:7111/api/Professional', professionalData, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json" // ✅ נדרש כדי לוודא תגובה נכונה
    },
    withCredentials: false
  });

  return response.data;
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

// 🧠 לפי קטגוריה
export async function getProfessionalByCategory(categoryId: string) {
  const res = await fetch(`/api/profrssional/byCategory/${categoryId}`);
  if (!res.ok) throw new Error("Failed to fetch professional by category");
  return res.json();
}
