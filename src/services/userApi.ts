import axios from 'axios';
import type { User } from '../type/userType';
// 📥 מביא את כל המשתמשים
export const getUser = async (): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>('https://localhost:7111/api/UserController');
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// 📥 מביא משתמש לפי מזהה
export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await axios.get<User>(`https://localhost:7111/api/UserController/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    throw error;
  }
};

// ➕ מוסיף משתמש חדש
export const addUser = async (userData: Omit<User, 'userId'>): Promise<User> => {
  try {
    const response = await axios.post<User>('https://localhost:7111/api/UserController', userData);
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

// ❌ מוחק משתמש לפי מזהה
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await axios.delete(`https://localhost:7111/api/UserController/${id}`);
  } catch (error) {
    console.error(`Error deleting user with id ${id}:`, error);
    throw error;
  }
};

// ✏️ מעדכן משתמש לפי מזהה
export const updateUser = async (id: number, userData: User): Promise<User> => {
  try {
    const response = await axios.put<User>(`https://localhost:7111/api/User/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with id ${id}:`, error);
    throw error;
  }
};

// 🔐 התחברות משתמש
export const userLogin = async (
  credentials: Pick<User, 'userEmail' | 'userPassword'>
): Promise<User> => {
  try {
    const response = await axios.post<User>('https://localhost:7111/api/User', credentials);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

// 📝 הרשמת משתמש חדש
export const userSignup = async (userData: Omit<User, 'userId'>): Promise<User> => {
  try {
    const response = await axios.post<User>('https://localhost:7111/api/User', userData);
    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};
