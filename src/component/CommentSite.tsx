// ייבוא ריאקט ופונקציות רלוונטיות לניהול סטייט ואירועים
import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";

// ייבוא Redux - hooks לאינטראקציה עם ה־store
import { useDispatch, useSelector } from "react-redux";
import { fetchComments, createComment } from "../features/Comment/commentSlice";
import { unwrapResult } from "@reduxjs/toolkit";

// ייבוא טיפוסים מה־store
import type { RootState, AppDispatch } from "../store/store";
import type { Comment } from "../type/commentType";

// ייבוא קובץ CSS לדף התגובות
import "../css/commentSite.css";

// קומפוננטת React פונקציונלית
const CommentsSite: React.FC = () => {
  // משתנים לשמירת תוכן תגובה חדשה, דירוג, ושם משתמש
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(1);
  const [userName, setUserName] = useState('');

  // יצירת דיספאץ' מותאם לטיפוס AppDispatch
  const dispatch = useDispatch<AppDispatch>();

  // שליפת סטייט מה־Redux store: תגובות, טוען, שגיאה
  const { comments, loading, error } = useSelector((state: RootState) => state.comments);

  //בדיקה אם יש שם משתמש מקומי (localStorage):

  // בעת טעינת הקומפוננטה: ניסיון להביא שם משתמש מתוך localStorage
  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name);
      console.log("שם משתמש מתוך localStorage:", name);
    }
  }, []);

  // הבאת התגובות מהשרת ברגע שהקומפוננטה עולה
  useEffect(() => {
    console.log("קורא לפונקציית fetchComments...");
    dispatch(fetchComments());
  }, [dispatch]);

  // הדפסה לקונסול כאשר תגובות מתעדכנות
  useEffect(() => {
    console.log("תגובות מה-Redux:", comments);
    if (comments.length > 0) {
      console.log("תגובה לדוגמה:", comments[0]);
    }
  }, [comments]);

  // טיפול בשינוי הטקסט בתיבת התגובה
  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  // טיפול בשינוי הדירוג (מספר בין 1 ל־5)
  const handleRatingChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRating(parseFloat(e.target.value));
  };

  // שליחה של טופס התגובה
  const handleSubmitComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ביטול הרענון ברירת מחדל של הדפדפן

    if (!newComment.trim()) {
      alert("אנא כתוב תגובה לפני שליחה");
      return;
    }

    // מבנה תגובה חדשה. מזהה נוצר אוטומטית בצד השרת.
    const commentData: Omit<Comment, 'commentId'> = {
      commentContent: newComment,
      rating,
      commentDate: new Date().toISOString(), // תאריך נוכחי בפורמט ISO
      userName: userName || 'אנונימי', // שם משתמש מה-localStorage או אנונימי כברירת מחדל
    };

    try {
      console.log("שולח תגובה חדשה:", commentData);
      const resultAction = await dispatch(createComment(commentData)); // שליחה דרך redux thunk
      unwrapResult(resultAction); // בדיקת הצלחה
      console.log("תגובה נשלחה בהצלחה!");

      // איפוס שדות אחרי שליחה מוצלחת
      setNewComment('');
      setRating(1);

      // רענון התגובות כדי שתוצג מיידית התגובה החדשה
      dispatch(fetchComments());
    } catch (error) {
      console.error("שליחת התגובה נכשלה:", error);
    }
  };

  // פונקציה להצגת כוכבים לפי ערך הדירוג
  const renderStars = (value: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= value ? '★' : '☆'); // מילוי בכוכבים מלאים או ריקים
    }
    return <div className="rating-stars">{stars.join(' ')}</div>;
  };

  // טיפול במצבים של טעינה או שגיאה
  if (loading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error}</p>;

  return (
    <>
      {/* טופס לשליחת תגובה חדשה */}
      <div className="comments-container">
        <form className="comments-form" onSubmit={handleSubmitComment}>
          <h2>הוסף תגובה לאתר</h2>

          {/* דירוג באמצעות כוכבים - ניתן לשנות על ידי לחיצה */}
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                onMouseOver={() => setRating(star)}
                style={{ cursor: 'pointer' }}
                className={star <= rating ? 'star filled' : 'star'}
              >
                ★
              </span>
            ))}
          </div>

          {/* שדה קלט טקסט לתגובה */}
          <textarea
            rows={4}
            placeholder="כתוב תגובה"
            value={newComment}
            onChange={handleCommentChange}
            required
          ></textarea>

          {/* כפתור לשליחת התגובה */}
          <button type="submit">שלח תגובה!</button>
        </form>
      </div>

      {/* הצגת רשימת התגובות הקיימות */}
      <div className="comments-container">
        <h3>תגובות שקיבלנו</h3>

        {comments.length > 0 ? (
          comments.map((comment) => (
            <div className="comment-card" key={comment.commentId}>
              <div className="comment-header">
                <div className="avatar">
                  {comment.userName ? comment.userName[0] : '?'}
                </div>
                <div className="comment-meta">{comment.userName}</div>
              </div>

              {/* הצגת הדירוג של התגובה */}
              {renderStars(comment.rating)}

              <div className="comment-text">{comment.commentContent}</div>
              <div className="comment-date">{comment.commentDate}</div>
            </div>
          ))
        ) : (
          <p>לא קיימות תגובות כרגע.</p>
        )}
      </div>
    </>
  );
};

export default CommentsSite;
