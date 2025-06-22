export interface Professional {
  professionalId: number;
  professionalName: string;
  professionalAdress: string;
  professionalDescription: string;
  priceRange?: string;           // סימן ? = אופציונלי (יכול להיות undefined)
  professionalPhone: string;
  professionalEmail: string;
  subject: string;
  years?: number;                // אופציונלי (יכול להיות undefined)
  professionalPassword: string;
  uploadDate: string | Date;     // TypeScript לא מבין Date בברירת מחדל, אפשר גם מחרוזת
  imageUrls: string;
  professionalPlace: string;
  profile: string;
  city: string;
  categoryId: number;
}
export interface ProfessionalState {
  professionals: Professional[];
  loading: boolean;
  error: string;
}
// src/type/AddProfessionalForm.ts

export interface AddProfessionalForm {
  professionalName: string;
  professionalPhone: string;
  professionalEmail?: string;
  professionalAdress?: string;
  subject?: string;
  professionalDescription?: string;
  professionalPlace?: string;
  priceRange?: string;
  professionalPassword?: string;
  uploadDate?: string | Date;
  imageUrls?: string;
  fileImage: File; // חובה אם את דורשת תמונה
}
