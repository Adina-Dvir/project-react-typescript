import {configureStore} from '@reduxjs/toolkit';
import categoryReducer from '../features/Category/categorySlice';
import professionalReducer from '../features/Professional/professionalSlice'
import userReducer from '../features/User/userSlice'
//import chatReducer from '../features/Chat/chatSlice'
import commentReducer from '../features/Comment/commentSlice';

const store = configureStore({
    reducer: {
        //הקטגוריות
        category: categoryReducer,
            //המקצוען
        professionals: professionalReducer,     
          //המשתמשים
      //  user: userReducer,      
          //הצ'אט
       // chat: chatReducer,  
           //התגובות
        comments:commentReducer,
    },
});
export default store;
// //הקוד הזה יוצר את הסטור של הרדוקס, שבו נשמרים כל הסטייטים של האפליקציה
// טיפוס סטייט שורש - מייצג את צורת כל הסטייט ברדוקס
export type RootState = ReturnType<typeof store.getState>;

// טיפוס dispatch - מייצג את פונקציית השליחה לסטור
export type AppDispatch = typeof store.dispatch;