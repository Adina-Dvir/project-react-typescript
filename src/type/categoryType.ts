
import type { Professional } from './professionalType';
export interface Category {
  categoryId: number;
  categoryName: string;
  categoryDescription?: string;
  professionals: Professional[]; // מערך של מקצוענים
}

export interface CategoryState {
  categories: Category[]; // מערך של קטגוריות
  loading: boolean; // האם הטעינה מתבצעת
  error: string; // הודעת שגיאה במקרה של תקלה
}