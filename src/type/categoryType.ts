
import type { Professional } from './professionalType';
export interface Category {
  categoryId: number;
  categoryName: string;
  categoryDescription?: string;
  professionals: Professional[]; // מערך של מקצוענים
}

export interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}