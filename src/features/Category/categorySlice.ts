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
export const fetchCategories= createAsyncThunk<Category[]>('categories/fetchCategories',async()=>{
    const response=await getCategory(); // קורא לפונקציה שמביאה את הקטגוריות מהשרת
    return response;
})

// שליפת קטגוריה לפי מזהה
export const fetchCategoryById = createAsyncThunk<Category,number>('categories/fetchCategoryById', async (id:number) => {
    const response = await getCategoryById(id);
    return response;
  });
// יצירת קטגוריה חדשה
export const createCategory = createAsyncThunk<Category,Omit<Category,'id'>>('categories/createCategory', async (categoryData) => {
    return await addCategory(categoryData);
  });
  // מחיקת קטגוריה לפי מזהה
export const removeCategory = createAsyncThunk<number,number>('categories/removeCategory', async (id:number) => {
    await deleteCategory(id);
    return id; // מחזיר את ה-id כדי שנוכל להסיר אותו מהסטייט
  });
  //עדכון קטגוריה לפי מזהה
  export const updateCategoryById = createAsyncThunk<Category,{id:number,categoryData:Omit<Category,'id'>}>('categories/updateCategoryById', async ({ id, categoryData }) => {
    const updatedCategory = await updateCategory(id, categoryData);
    return updatedCategory;
  });
  // יוצרים את ה-slice – זה בעצם הסטייט + הפונקציות שמשפיעות עליו
const categorySlice= createSlice({
    name: 'categories',   // שם ה-slice
    initialState,         // הסטייט ההתחלתי
    reducers:{} ,     // כרגע אין reducers רגילים
    extraReducers:(builder)=>{// כאן מוסיפים תגובות לפעולות האסינכרוניות שיצרנו למעלה
        builder.addCase(fetchCategories.pending,(state:CategoryState)=>{
            state.loading=true; // התחלת שליפה - מציין שטוען
        })
        .addCase(fetchCategories.fulfilled, (state:CategoryState, action) => {
        state.categories = action.payload; // קיבלנו נתונים – שומרים אותם
        state.loading = false;
        })
        .addCase(fetchCategories.rejected, (state:CategoryState, action) => {
            state.error = action.error.message ?? ''; // שגיאה – שומרים את ההודעה
            state.loading = false;
        })

        .addCase(removeCategory.fulfilled, (state:CategoryState, action) => {
        // הסרה מהסטייט של הקטגוריה לפי ה-id
        state.categories = state.categories.filter(category => category.categoryId!== action.payload);
        })
        .addCase(createCategory.fulfilled, (state:CategoryState, action) => {
        // מוסיפים את הקטגוריה החדשה לסטייט
        state.categories.push(action.payload);
        })
        .addCase(updateCategoryById.fulfilled, (state:CategoryState, action) => {
        // עדכון קטגוריה קיימת
        const index = state.categories.findIndex(category => category.categoryId === action.payload.categoryId);
        if (index !== -1) {
          state.categories[index] = action.payload; // מחליפים את הקיים בחדש
        }
        });
 
    }
    
});
// מייצאים את ה-reducer – זה מה שנחבר ל-store
export default categorySlice.reducer;
