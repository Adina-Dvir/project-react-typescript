import type {Comment,CommentState} from '../../type/commentType'; // מייבאים את הטיפוס של תגובה
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
const initialState:CommentState = {
    comments: [],   // רשימת ההודעות
    loading: false, // האם טוען כרגע נתונים
    error: '',      // הודעת שגיאה במקרה של תקלה
};

// שליפות מהשרת (API) באמצעות createAsyncThunk

// שליפת כל ההודעות
export const fetchComments = createAsyncThunk<Comment[],void,{ rejectValue: string }>('comments/fetchComments', async  (_, { rejectWithValue }) => {
    try {
      const response = await getComment();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error fetching comments');
    }
});

// שליפת הודעה לפי מזהה
export const fetchCommentById = createAsyncThunk('comments/fetchCommentById', async (id:number) => {
    const response = await getCommentById(id);
    return response;
});

// יצירת הודעה חדשה
export const createComment = createAsyncThunk<Comment,Partial<Omit<Comment,'id'>>>('comments/createComment', async (commentData) => {
    return await addComment(commentData);
});

// מחיקת הודעה לפי מזהה
export const removeComment = createAsyncThunk<number,number>('comments/removeComment', async (id:number) => {
    await deleteComment(id);
    return id;
});

// עדכון הודעה לפי מזהה
export const updateCommentById = createAsyncThunk<Comment, { id: number; commentData: Partial<Comment> },{rejectValue:string}>('comments/updateCommentById', async ({ id, commentData },{rejectWithValue}) => {
try {
      const response = await updateComment(id, commentData);
      return response; // או response.data לפי מה שהפונקציה מחזירה
    } catch (error: any) {
      // מחזיר ערך דחייה עם הודעת השגיאה
      return rejectWithValue(error.message || 'Error updating comment');
    }
});

// יוצרים את ה-slice – סטייט + פעולות שמשפיעות עליו
const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.pending, (state:CommentState) => {
                state.loading = true;
            })
            .addCase(fetchComments.fulfilled, (state:CommentState, action) => {
                state.comments = action.payload;
                state.loading = false;
            })
            .addCase(fetchComments.rejected, (state:CommentState, action) => {
                state.error = action.error.message ?? '';
                state.loading = false;
            })
            .addCase(removeComment.fulfilled, (state:CommentState, action) => {
                state.comments = state.comments.filter(comment => comment.commentId !== action.payload);
            })
            .addCase(createComment.fulfilled, (state:CommentState, action) => {
                state.comments.push(action.payload);
            })
            .addCase(updateCommentById.fulfilled, (state:CommentState, action) => {
                const index = state.comments.findIndex(comment => comment.commentId === action.payload.commentId);
                if (index !== -1) {
                    state.comments[index] = action.payload;
                }
            });
    }
});

// מייצאים את ה-reducer – נחבר אותו ל-store
export default commentSlice.reducer;
