// מייבאים כלים מ-Redux Toolkit
import type {User,UserState} from '../../type/userType'
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// מייבאים את הפונקציות שמבצעות את הקריאות לשרת (API)
import {
    getUser,
    getUserById,
    addUser,
    deleteUser,
    updateUser
} from '../../services/userApi';

// מצב התחלתי של הסטייט
const initialState:UserState = {
    users: [],       // רשימת המשתמשים
    loading: false,  // האם טוען כרגע נתונים
    error: '',       // הודעת שגיאה במקרה של תקלה
};

// שליפות מהשרת (API) באמצעות createAsyncThunk – כל אחת מהן מגדירה פעולה אסינכרונית שנוכל להשתמש בה ב-redux

// שליפת כל המשתמשים
export const fetchUsers = createAsyncThunk<User[]>('users/fetchUsers', async () => {
    const response = await getUser(); // קריאה לשרת לשליפת המשתמשים
    return response;
});

// שליפת משתמש לפי מזהה
export const fetchUserById = createAsyncThunk<User,number>('users/fetchUserById', async (id) => {
    const response = await getUserById(id);
    return response;
});

// יצירת משתמש חדש
export const createUser = createAsyncThunk<User,User>('users/createUser', async (userData) => {
    return await addUser(userData);
});

// מחיקת משתמש לפי מזהה
export const removeUser = createAsyncThunk<number,number>('users/removeUser', async (id) => {
    await deleteUser(id);
    return id; // מחזיר את ה-id כדי שנוכל להסיר אותו מהסטייט
});

// עדכון משתמש לפי מזהה
export const updateUserById = createAsyncThunk<User,{id:number;userData:User}>('users/updateUserById', async ({ id, userData }) => {
    const response = await updateUser(id, userData);
    return response;
});

// יוצרים את ה-slice – זה בעצם הסטייט + הפונקציות שמשפיעות עליו
const userSlice = createSlice({
    name: 'users',         // שם ה-slice
    initialState,          // הסטייט ההתחלתי
    reducers: {},          // כרגע אין reducers רגילים
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true; // התחלת שליפה - מציין שטוען
            })
                 .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.error.message || 'Something went wrong';
        state.loading = false;
      })
      .addCase(removeUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.users = state.users.filter(user => user.userId !== action.payload);
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users.push(action.payload);
      })
      .addCase(updateUserById.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.users.findIndex(user => user.userId === action.payload.userId);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      });
    }
});

// מייצאים את ה-reducer – זה מה שנחבר ל-store
export default userSlice.reducer;
