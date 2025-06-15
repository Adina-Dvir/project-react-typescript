// מייבאים כלים מ-Redux Toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// מייבאים את הפונקציות שמבצעות את הקריאות לשרת (API)
import {
    getProfessional,
    getProfessionalById,
    addProfessional,
    deleteProfessional,
    updateProfessional
} from '../../services/professionalApi';

// מצב התחלתי של הסטייט
const initialState = {
    professionals: [],  // רשימת העסקים
    loading: false,     // האם טוען כרגע נתונים
    error: '',          // הודעת שגיאה במקרה של תקלה
};

// שליפות מהשרת (API) באמצעות createAsyncThunk – כל אחת מהן מגדירה פעולה אסינכרונית שנוכל להשתמש בה ב-redux

// שליפת כל העסקים
export const fetchProfessionals = createAsyncThunk('professionals/fetchProfessionals', async () => {
    const response = await getProfessional(); // קריאה לשרת לשליפת העסקים
    return response;
});

// שליפת עסק לפי מזהה
export const fetchProfessionalById = createAsyncThunk('professionals/fetchProfessionalById', async (id) => {
    const response = await getProfessionalById(id);
    return response;
});

// יצירת עסק חדש
export const createProfessional = createAsyncThunk('professionals/createProfessional', async (professionalData) => {
    return await addProfessional(professionalData);
});

// מחיקת עסק לפי מזהה
export const removeProfessional = createAsyncThunk('professionals/removeProfessional', async (id) => {
    await deleteProfessional(id);
    return id; // מחזיר את ה-id כדי שנוכל להסיר אותו מהסטייט
});

// עדכון עסק לפי מזהה
export const updateProfessionalById = createAsyncThunk('professionals/updateProfessionalById', async ({ id, professionalData }) => {
    const response = await updateProfessional(id, professionalData);
    return response.data;
});

// יוצרים את ה-slice – זה בעצם הסטייט + הפונקציות שמשפיעות עליו
const professionalSlice = createSlice({
    name: 'professionals',     // שם ה-slice
    initialState,              // הסטייט ההתחלתי
    reducers: {},              // כרגע אין reducers רגילים
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfessionals.pending, (state) => {
                state.loading = true; // התחלת שליפה - מציין שטוען
            })
            .addCase(fetchProfessionals.fulfilled, (state, action) => {
                state.professionals = action.payload; // קיבלנו נתונים – שומרים אותם
                state.loading = false;
            })
            .addCase(fetchProfessionals.rejected, (state, action) => {
                state.error = action.error.message; // שגיאה – שומרים את ההודעה
                state.loading = false;
            })
            .addCase(removeProfessional.fulfilled, (state, action) => {
                // הסרה מהסטייט של העסק לפי ה-id
                state.professionals = state.professionals.filter(p => p.id !== action.payload);
            })
            .addCase(createProfessional.fulfilled, (state, action) => {
                // מוסיפים את העסק החדש לסטייט
                state.professionals.push(action.payload);
            })
            .addCase(updateProfessionalById.fulfilled, (state, action) => {
                // עדכון עסק קיים
                const index = state.professionals.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.professionals[index] = action.payload; // מחליפים את הקיים בחדש
                }
            });
    }
});

// מייצאים את ה-reducer – זה מה שנחבר ל-store
export default professionalSlice.reducer;
