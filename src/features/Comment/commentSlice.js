// מייבאים כלים מ-Redux Toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// מייבאים את הפונקציות שמבצעות את הקריאות לשרת (API)
import {
    getComment,
    getCommentById,
    addComment,
    deleteComment,
    updateComment
} from '../../services/commentApi';

// מצב התחלתי של הסטייט
const initialState = {
    comments: [],   // רשימת ההודעות
    loading: false, // האם טוען כרגע נתונים
    error: '',      // הודעת שגיאה במקרה של תקלה
};

// שליפות מהשרת (API) באמצעות createAsyncThunk

// שליפת כל ההודעות
export const fetchComments = createAsyncThunk('comments/fetchComments', async () => {
    const response = await getComment();
    return response;
});

// שליפת הודעה לפי מזהה
export const fetchCommentById = createAsyncThunk('comments/fetchCommentById', async (id) => {
    const response = await getCommentById(id);
    return response;
});

// יצירת הודעה חדשה
export const createComment = createAsyncThunk('comments/createComment', async (commentData) => {
    return await addComment(commentData);
});

// מחיקת הודעה לפי מזהה
export const removeComment = createAsyncThunk('comments/removeComment', async (id) => {
    await deleteComment(id);
    return id;
});

// עדכון הודעה לפי מזהה
export const updateCommentById = createAsyncThunk('comments/updateCommentById', async ({ id, commentData }) => {
    const response = await updateComment(id, commentData);
    return response.data;
});

// יוצרים את ה-slice – סטייט + פעולות שמשפיעות עליו
const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.comments = action.payload;
                state.loading = false;
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            .addCase(removeComment.fulfilled, (state, action) => {
                state.comments = state.comments.filter(comment => comment.id !== action.payload);
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.comments.push(action.payload);
            })
            .addCase(updateCommentById.fulfilled, (state, action) => {
                const index = state.comments.findIndex(comment => comment.id === action.payload.id);
                if (index !== -1) {
                    state.comments[index] = action.payload;
                }
            });
    }
});

// מייצאים את ה-reducer – נחבר אותו ל-store
export default commentSlice.reducer;
