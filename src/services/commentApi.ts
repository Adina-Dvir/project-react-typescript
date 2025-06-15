// 📦 ייבוא axios לשליחת בקשות HTTP
import axios from 'axios';

// 🧾 ממשק TypeScript המייצג את CommentDto מהשרת (C#)
export interface Comment {
  commentId: number;           // מזהה התגובה
  commentDate: string;         // תאריך יצירת התגובה (בפורמט ISO)
  userName: string;            // שם המשתמש
  rating: number;              // דירוג
  commentContent: string;      // תוכן התגובה
}

// 📥 מביא את כל התגובות
export const getComment = async (): Promise<Comment[]> => {
  try {
    const response = await axios.get<Comment[]>('https://localhost:7111/api/comment');
    return response.data;
  } catch (error) {
    console.error("Error fetching comment:", error);
    throw error;
  }
};

// 📥 מביא תגובה לפי מזהה
export const getCommentById = async (id: number): Promise<Comment> => {
  try {
    const response = await axios.get<Comment>(`https://localhost:7111/api/comment/getCommentById/${id}`);
    console.log("תגובה:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching comment by id:", error);
    throw error;
  }
};

// ➕ מוסיף תגובה חדשה
export const addComment = async (commentData: Omit<Comment, 'commentId'>): Promise<Comment> => {
  try {
    const response = await axios.post<Comment>(
      'https://localhost:7111/api/commentController/addComment',
      commentData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

// ❌ מוחק תגובה לפי מזהה
export const deleteComment = async (id: number): Promise<void> => {
  try {
    await axios.delete(`https://localhost:7111/api/commentController/deleteComment/${id}`);
  } catch (error) {
    console.error(`Error deleting comment with id ${id}:`, error);
    throw error;
  }
};

// ✏️ מעדכן תגובה לפי מזהה
export const updateComment = async (id: number, commentData: Comment): Promise<Comment> => {
  try {
    const response = await axios.put<Comment>(
      `https://localhost:7111/api/commentController/updateComment/${id}`,
      commentData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating comment with id ${id}:`, error);
    throw error;
  }
};

// ➕ מוסיף תגובה שמשויכת לאתר מסוים
export const addCommentForSite = async (commentData: Omit<Comment, 'commentId'>): Promise<Comment> => {
  try {
    const response = await axios.post<Comment>(
      'https://localhost:7111/api/commentController/addCommentForSite',
      commentData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding comment for site:", error);
    throw error;
  }
};

// 📥 מביא את כל התגובות שמשויכות לאתר
export const getCommentForSite = async (): Promise<Comment[]> => {
  try {
    const response = await axios.get<Comment[]>(
      'https://localhost:7111/api/commentController/getCommentsForSite'
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching comments for site:", error);
    throw error;
  }
};
