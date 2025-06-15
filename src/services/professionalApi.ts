import axios from 'axios';
// 🧾 תבנית שמייצגת את ProfessionalsDto מהשרת (C#)
export interface Professional {
  professionalId: number;
  professionalName?: string;
  professionalAdress?: string;
  professionalDescription?: string;
  priceRange?: string;
  professionalPhone?: string;
  professionalEmail?: string;
  subject?: string;
  years?: number;
  professionalPassword?: string;
  uploadDate?: string; // DateTime מ־C# לרוב מתקבל כמחרוזת
  arrImage?: Uint8Array; // byte[] → Uint8Array או string (תלוי אם זה base64)
  professionalPlace?: string;
  profile?: string;
  city?: string;
  categoryId?: number;
  fileImage?: File; // IFormFile → File ב-TypeScript
}
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
export const addProfessional = async (
  professionalData: Omit<Professional, 'professionalId'>
): Promise<Professional> => {
  try {
    const formData = new FormData();
    for (const key in professionalData) {
      const value = professionalData[key as keyof typeof professionalData];
      if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    }

    const response = await axios.post<Professional>(
      'https://localhost:7111/api/Professional',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding professional:", error);
    throw error;
  }
};

// ✏️ מעדכן איש מקצוע קיים
export const updateProfessional = async (
  id: number,
  professionalData: Professional
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
