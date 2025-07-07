import React, { useState, useEffect } from "react";
import type {  ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments, createComment } from "../features/Comment/commentSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "../store/store";
import type { Comment } from "../type/commentType";

import "../css/commentSite.css";

const CommentsSite: React.FC = () => {
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(1);
  const [userName, setUserName] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { comments, loading, error } = useSelector((state: RootState) => state.comments);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser?.username) setUserName(parsedUser.username);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchComments());
  }, [dispatch]);

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const handleRatingChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRating(parseFloat(e.target.value));
  };

  const handleSubmitComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
const commentData: Omit<Comment, 'commentId'> = {
  commentContent: newComment,
  rating,
  commentDate: new Date().toISOString(),
  userName: userName || 'אנונימי',
};
    if (!newComment.trim()) {
      alert("אנא כתוב תגובה לפני שליחה");
      return;
    }

    try {
      const resultAction = await dispatch(createComment(commentData));
      unwrapResult(resultAction);
      setNewComment('');
      setRating(1);
      dispatch(fetchComments());
    } catch (error) {
      console.error("Failed to submit comment", error);
    }
  };

  const renderStars = (value: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= value ? '★' : '☆');
    }
    return <div className="rating-stars">{stars.join(' ')}</div>;
  };

  if (loading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error}</p>;

  return (
    <>


      <div className="comments-container">
        <form className="comments-form" onSubmit={handleSubmitComment}>
          <h2>הוסף תגובה לאתר</h2>

          <label>דירוג:</label>
          <select value={rating} onChange={handleRatingChange}>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <textarea
            rows={4}
            placeholder="כתוב תגובה"
            value={newComment}
            onChange={handleCommentChange}
            required
          ></textarea>

          <button type="submit">שלח תגובה!</button>
        </form>
      </div>

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
