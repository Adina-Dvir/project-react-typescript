// מייבאים כלים מ-Redux Toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// מייבאים את הפונקציות שמבצעות את הקריאות לשרת (API)
import {
    getChat,
    getChatById,
    addChat,
    deleteChat,
    updateChat
} from '../../services/chatApi';

// מצב התחלתי של הסטייט
const initialState = {
    chats: [],    // רשימת השיחות
    loading: false, // האם טוען כרגע נתונים
    error: '',      // הודעת שגיאה במקרה של תקלה
};

// שליפות מהשרת (API) באמצעות createAsyncThunk

// שליפת כל השיחות
export const fetchChats = createAsyncThunk('chats/fetchChats', async () => {
    const response = await getChat();
    return response;
});

// שליפת שיחה לפי מזהה
export const fetchChatById = createAsyncThunk('chats/fetchChatById', async (id) => {
    const response = await getChatById(id);
    return response;
});

// יצירת שיחה חדשה
export const createChat = createAsyncThunk('chats/createChat', async (chatData) => {
    return await addChat(chatData);
});

// מחיקת שיחה לפי מזהה
export const removeChat = createAsyncThunk('chats/removeChat', async (id) => {
    await deleteChat(id);
    return id;
});

// עדכון שיחה לפי מזהה
export const updateChatById = createAsyncThunk('chats/updateChatById', async ({ id, chatData }) => {
    const response = await updateChat(id, chatData);
    return response.data;
});

// יוצרים את ה-slice – סטייט + פעולות שמשפיעות עליו
const chatSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchChats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.chats = action.payload;
                state.loading = false;
            })
            .addCase(fetchChats.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            .addCase(removeChat.fulfilled, (state, action) => {
                state.chats = state.chats.filter(chat => chat.id !== action.payload);
            })
            .addCase(createChat.fulfilled, (state, action) => {
                state.chats.push(action.payload);
            })
            .addCase(updateChatById.fulfilled, (state, action) => {
                const index = state.chats.findIndex(chat => chat.id === action.payload.id);
                if (index !== -1) {
                    state.chats[index] = action.payload;
                }
            });
    }
});

// מייצאים את ה-reducer – נחבר אותו ל-store
export default chatSlice.reducer;
