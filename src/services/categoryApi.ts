// 📦 ייבוא ספריית axios לשליחת בקשות HTTP
import axios from 'axios';
import type{Category} from '../type/categoryType'; // מייבאים את הטיפוס של קטגוריה
// 🧾 הגדרת ממשק טיפוסים לקטגוריה
// export interface Category {
//   id: number;
//   name: string;
//   categoryDescription: string;      // מייצג את CategoryDescription

// }

// 📥 מביא את כל הקטגוריות מהשרת
export const getCategory = async (): Promise<Category[]> => {
  try {
    const response = await axios.get<Category[]>('https://localhost:7111/api/Category');
    //🔽 פונקציה אסינכרונית שמחזירה מערך של קטגוריות (Category[]).
    console.log("Fetched category:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

// 📥 מביא קטגוריה לפי מזהה
export const getCategoryById = async (id: number): Promise<Category> => {
  try {
    console.log("1: ", id);
    const response = await axios.get<Category>(`http://localhost:7111/api/Category/${id}`);
    console.log("2: ", id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    throw error;
  }
};

// ➕ מוסיף קטגוריה חדשה (ללא id כי הוא נוצר אוטומטית בשרת)
export const addCategory = async (categoryData: Omit<Category, 'categoryId'>): Promise<Category> => {
  try {
    console.log(categoryData);
    const response = await axios.post<Category>('http://localhost:7111/api/Category', categoryData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

// ✏️ מעדכן קטגוריה קיימת לפי id
export const updateCategory = async (id: number, categoryData: Category): Promise<Category> => {
  try {
    console.log("id, categoryData", id, categoryData);
    const response = await axios.put<Category>(`http://localhost:7111/api/Category/${id}`, categoryData);
    console.log("response", response);
    console.log("response.data", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating category with id ${id}:`, error);
    throw error;
  }
};

// ❌ מוחק קטגוריה לפי מזהה
export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await axios.delete(`http://localhost:7111/api/Category/${id}`);
  } catch (error) {
    console.error(`Error deleting category with id ${id}:`, error);
    throw error;
  }
};
