import React, { useState } from "react";
import {
  FaStar,
  FaRegStar,
  FaThumbsUp,
  FaThumbsDown,
  FaReply,
  FaUserCircle,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  likeRating,
  dislikeRating,
  replyToRating,
} from "../../redux/reducers/recipeSlice";
import styles from "./RatingList.module.css";

const RatingList = ({ ratings, recipeId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [replyInput, setReplyInput] = useState({});
  const [showReplyField, setShowReplyField] = useState({});

  const handleLike = (ratingId) => {
    dispatch(likeRating({ recipeId, ratingId }));
  };

  const handleDislike = (ratingId) => {
    dispatch(dislikeRating({ recipeId, ratingId }));
  };

  const handleReply = (ratingId) => {
    if (!replyInput[ratingId]) return;
    dispatch(
      replyToRating({
        recipeId,
        ratingId,
        comment: replyInput[ratingId],
      })
    );
    setReplyInput({ ...replyInput, [ratingId]: "" });
    setShowReplyField({ ...showReplyField, [ratingId]: false });
  };

  if (!ratings?.length) return <p>Hələ heç bir şərh yoxdur</p>;

  return (
    <div className={styles.reviewList}>
      <h3>Şərhlər:</h3>
      {ratings.map((r) => (
        <div key={r._id} className={styles.reviewItem}>
          <div className={styles.stars}>
            {Array.from({ length: 5 }).map((_, i) =>
              i < r.rating ? (
                <FaStar key={i} color="gold" />
              ) : (
                <FaRegStar key={i} color="#ccc" />
              )
            )}
          </div>

          <div className={styles.user}>
            <FaUserCircle className={styles.userIcon} />
            <span>
              {r.user?.firstName} {r.user?.lastName}
            </span>
          </div>

          <p>{r.comment}</p>

          <div className={styles.actions}>
            <button onClick={() => handleLike(r._id)}>
              <FaThumbsUp /> {r.likes?.length || 0}
            </button>
            <button onClick={() => handleDislike(r._id)}>
              <FaThumbsDown /> {r.dislikes?.length || 0}
            </button>
            <button
              onClick={() =>
                setShowReplyField((prev) => ({
                  ...prev,
                  [r._id]: !prev[r._id],
                }))
              }
            >
              <FaReply /> Cavab yaz
            </button>
          </div>

          {showReplyField[r._id] && (
            <div className={styles.replyBox}>
              <input
                type="text"
                placeholder="Cavabınızı yazın..."
                value={replyInput[r._id] || ""}
                onChange={(e) =>
                  setReplyInput({
                    ...replyInput,
                    [r._id]: e.target.value,
                  })
                }
              />
              <button onClick={() => handleReply(r._id)}>Göndər</button>
            </div>
          )}

          {r.replies?.map((rep) => (
            <div key={rep._id} className={styles.reply}>
              <div className={styles.replyUser}>
                <FaUserCircle className={styles.replyUserIcon} />
                <span>
                  {rep.user?.firstName} {rep.user?.lastName}
                </span>
              </div>
              <p>{rep.comment}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default RatingList;
