// 🧾 ממשק TypeScript המייצג את CommentDto מהשרת (C#)
export interface Comment {
  commentId: number;           // מזהה התגובה
  commentDate: string;         // תאריך יצירת התגובה (בפורמט ISO)
  userName: string;            // שם המשתמש
  rating: number;              // דירוג
  commentContent: string;      // תוכן התגובה
}

// טיפוס סטייט של ההודעות
export interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string;
}
