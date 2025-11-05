export type Professional = {
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
  uploadDate?: string;
  professionalPlace?: string;
  profile?: string;
  city?: string;
  categoryId?: number;
  images?: ProfessionalImage[];
};

export interface ProfessionalState {
  professionals: Professional[];
  loading: boolean;
  error: string;
}
// src/type/AddProfessionalForm.ts

export interface AddProfessionalForm {
  ProfessionalName: string;
  ProfessionalPhone: string;
  ProfessionalEmail?: string;
  ProfessionalAdress?: string;
  ProfessionalPassword:string;
  City?: string;
  ProfessionalDescription?: string;
  ProfessionalPlace?: string;
  PriceRange?: string;
  CategoryId?: number;
  //uploadDate?: string | Date;
  //imageUrls?: string;
  //fileImage: File; // חובה אם את דורשת תמונה
  fileImages: File[]; // לא arrImage

}
export type ProfessionalImage = {
  imageId: number;
  fileName: string;
  imageBase64: string; // מחרוזת שמכילה את ה-URL של התמונה – תיווצר מהשרת
  professionalId: number;
};
