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