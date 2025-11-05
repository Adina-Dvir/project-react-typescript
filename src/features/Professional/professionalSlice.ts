import type { Professional, ProfessionalState } from '../../type/professionalType'; // מייבאים את הטיפוס Professional
// מייבאים כלים מ-Redux Toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// מייבאים את הפונקציות שמבצעות את הקריאות לשרת (API)
import {
    getProfessional,
    getProfessionalById,
    addProfessional,
    deleteProfessional,
    updateProfessional,
    getProfessionalByCategory
} from '../../services/professionalApi';

// מצב התחלתי של הסטייט
const initialState:ProfessionalState= {
    professionals: [],  // רשימת העסקים
    loading: false,     // האם טוען כרגע נתונים
    error: '',          // הודעת שגיאה במקרה של תקלה
};

// שליפות מהשרת (API) באמצעות createAsyncThunk – כל אחת מהן מגדירה פעולה אסינכרונית שנוכל להשתמש בה ב-redux

// שליפת כל העסקים
export const fetchProfessionals = createAsyncThunk<Professional[]>('professionals/fetchProfessionals', async () => {
    const response = await getProfessional(); // קריאה לשרת לשליפת העסקים
    return response;
});

// שליפת עסק לפי מזהה
export const fetchProfessionalById = createAsyncThunk<Professional,number>('professionals/fetchProfessionalById', async (id:number) => {
    const response = await getProfessionalById(id);
    return response;
});

// יצירת עסק חדש
export const createProfessional = createAsyncThunk<Professional, Partial<Omit<Professional, "professionalId">>>(
  'professionals/createProfessional',
  async (professionalData) => {
    const formData = new FormData();
    
    // נוסיף את הנתונים לפורמט של FormData
for (const key in professionalData) {
  if (
    Object.prototype.hasOwnProperty.call(professionalData, key) &&
    (professionalData as any)[key] !== undefined
  ) {
    formData.append(key, (professionalData as any)[key]);
  }
}


    // קריאה ל-API ושמירה של העסק
    const response = await addProfessional(formData);
    return response;  // כאן אנחנו מחזירים את ה-professional שנוצר
  }
);




// מחיקת עסק לפי מזהה
export const removeProfessional = createAsyncThunk('professionals/removeProfessional', async (id:number) => {
    await deleteProfessional(id);
    return id; // מחזיר את ה-id כדי שנוכל להסיר אותו מהסטייט
});
// פעולה לשליפת עסקים לפי קטגוריה
export const fetchProfessionalsByCategory = createAsyncThunk<Professional[], number>(
  'professionals/fetchProfessionalsByCategory',
  async (categoryId: number) => {
    const response = await getProfessionalByCategory(categoryId.toString()); // קריאה ל-API לשליפת העסקים
    return response;
  }
);

// עדכון עסק לפי מזהה
export const updateProfessionalById = createAsyncThunk<Professional, { id: number; professionalData: Partial<Omit< Professional,'professionalId'>> }>('professionals/updateProfessionalById', async ({ id, professionalData }) => {
    const updatedProfessional = await updateProfessional(id, professionalData);
    return updatedProfessional;
});

// יוצרים את ה-slice – זה בעצם הסטייט + הפונקציות שמשפיעות עליו
const professionalSlice = createSlice({
    name: 'professionals',     // שם ה-slice
    initialState,              // הסטייט ההתחלתי
    reducers: {},              // כרגע אין reducers רגילים
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfessionals.pending, (state:ProfessionalState) => {
                state.loading = true; // התחלת שליפה - מציין שטוען
            })
            .addCase(fetchProfessionals.fulfilled, (state:ProfessionalState, action) => {
                state.professionals = action.payload; // קיבלנו נתונים – שומרים אותם
                state.loading = false;
            })
            .addCase(fetchProfessionals.rejected, (state:ProfessionalState, action) => {
                state.error = action.error.message ?? ''; // שגיאה – שומרים את ההודעה
                state.loading = false;
            })
            .addCase(removeProfessional.fulfilled, (state:ProfessionalState, action) => {
                // הסרה מהסטייט של העסק לפי ה-id
                state.professionals = state.professionals.filter((p:Professional) => p.professionalId !== action.payload);
            })
            .addCase(createProfessional.fulfilled, (state, action) => {
                // מוסיפים את העסק החדש לסטייט
                state.professionals.push(action.payload);
            })
            .addCase(updateProfessionalById.fulfilled, (state, action) => {
                // עדכון עסק קיים
                const index = state.professionals.findIndex((p:Professional) => p.professionalId === action.payload.professionalId);
                if (index !== -1) {
                    state.professionals[index] = action.payload; // מחליפים את הקיים בחדש
                }
            })
            .addCase(fetchProfessionalsByCategory.pending, (state: ProfessionalState) => {
    state.loading = true;
})
.addCase(fetchProfessionalsByCategory.fulfilled, (state: ProfessionalState, action) => {
    state.professionals = action.payload;
    state.loading = false;
})
.addCase(fetchProfessionalsByCategory.rejected, (state: ProfessionalState, action) => {
    state.error = action.error.message ?? '';
    state.loading = false;
});
    }
});

// מייצאים את ה-reducer – זה מה שנחבר ל-store
export default professionalSlice.reducer;
