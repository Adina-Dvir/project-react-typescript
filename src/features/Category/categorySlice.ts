import type {Category,CategoryState} from '../../type/categoryType'; // מייבאים את הטיפוס של קטגוריה
// מייבאים כלים מ-Redux Toolkit
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
//מייבאים את הפונקציות שמבצעות את הקריאות לשרת (API)
import{
    getCategory,
    getCategoryById,
    addCategory,
    deleteCategory,
    updateCategory
} from '../../services/categoryApi';
//מצב התחלתי של הסטייט
const initialState:CategoryState={//הוספתי שיהיה מסוג CategoryState
    // הסטייט ההתחלתי של הקטגוריות
    categories:[], // רשימת הקטגוריות
    loading:false,  // האם טוען כרגע נתונים
    error: '', // הודעת שגיאה במקרה של תקלה
};
// שליפות מהשרת (API) באמצעות createAsyncThunk – כל אחת מהן מגדירה פעולה אסינכרונית שנוכל להשתמש בה ב-redux

//שליפת כל הקטגוריות
export const fetchCategories= createAsyncThunk('categories/fetchCategories',async()=>{
    const response=await getCategory(); // קורא לפונקציה שמביאה את הקטגוריות מהשרת
    return response;
})

// שליפת קטגוריה לפי מזהה
export const fetchCategoryById = createAsyncThunk('categories/fetchCategoryById', async (id) => {
    const response = await getCategoryById(id);
    return response;
  });
// יצירת קטגוריה חדשה
export const createCategory = createAsyncThunk('categories/createCategory', async (categoryData) => {
    return await addCategory(categoryData);
  });
  // מחיקת קטגוריה לפי מזהה
export const removeCategory = createAsyncThunk('categories/removeCategory', async (id) => {
    await deleteCategory(id);
    return id; // מחזיר את ה-id כדי שנוכל להסיר אותו מהסטייט
  });
  //עדכון קטגוריה לפי מזהה
  export const updateCategoryById = createAsyncThunk('categories/updateCategoryById', async ({ id, categoryData }) => {
    const response = await updateCategory(id, categoryData);
    return response.data;
  });
  // יוצרים את ה-slice – זה בעצם הסטייט + הפונקציות שמשפיעות עליו
const categorySlice= createSlice({
    name: 'categories',   // שם ה-slice
    initialState,         // הסטייט ההתחלתי
    reducers:{} ,     // כרגע אין reducers רגילים
    extraReducers:(builder)=>{// כאן מוסיפים תגובות לפעולות האסינכרוניות שיצרנו למעלה
        builder.addCase(fetchCategories.pending,(state)=>{
            state.loading=true; // התחלת שליפה - מציין שטוען
        })
        .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload; // קיבלנו נתונים – שומרים אותם
        state.loading = false;
        })
        .addCase(fetchCategories.rejected, (state, action) => {
            state.error = action.error.message; // שגיאה – שומרים את ההודעה
            state.loading = false;
        })

        .addCase(removeCategory.fulfilled, (state, action) => {
        // הסרה מהסטייט של הקטגוריה לפי ה-id
        state.categories = state.categories.filter(category => category.id !== action.payload);
        })
        .addCase(createCategory.fulfilled, (state, action) => {
        // מוסיפים את הקטגוריה החדשה לסטייט
        state.categories.push(action.payload);
        })
        .addCase(updateCategoryById.fulfilled, (state, action) => {
        // עדכון קטגוריה קיימת
        const index = state.categories.findIndex(category => category.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload; // מחליפים את הקיים בחדש
        }
        });
 
    }
    
});
// מייצאים את ה-reducer – זה מה שנחבר ל-store
export default categorySlice.reducer;
