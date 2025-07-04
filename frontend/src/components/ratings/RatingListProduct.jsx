import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  FaStar, 
  FaRegStar, 
  FaUserCircle, 
  FaThumbsUp, 
  FaThumbsDown, 
  FaReply 
} from "react-icons/fa";
import { toast } from "react-toastify";
import { 
  likeProductRating, 
  dislikeProductRating, 
  replyToProductRating 
} from "../../redux/reducers/productSlice";
import styles from "./RatingList.module.css";

const RatingListProduct = ({ initialRatings = [], productId, onRatingsUpdate }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [ratings, setRatings] = useState(initialRatings);
  const [replyInput, setReplyInput] = useState({});
  const [showReplyField, setShowReplyField] = useState({});
  const [isLoading, setIsLoading] = useState({});

  useEffect(() => {
    const handleNewRating = (e) => {
      const newRating = e.detail;
      if (!newRating || !newRating.user || !newRating.user._id) return;
      
      const updatedRatings = [newRating, ...ratings];
      setRatings(updatedRatings);
      
      if (onRatingsUpdate) {
        onRatingsUpdate(updatedRatings);
      }
    };

    window.addEventListener("new-rating-added", handleNewRating);
    return () => window.removeEventListener("new-rating-added", handleNewRating);
  }, [ratings, onRatingsUpdate]);

  useEffect(() => {
    setRatings(initialRatings);
  }, [initialRatings]);

  const handleLike = async (ratingId) => {
    if (!user) {
      toast.warning("Giriş etməlisiniz!");
      return;
    }

    if (!productId || !ratingId) {
      toast.error("Parametr xətası!");
      return;
    }

    if (isLoading[ratingId]) return;

    setIsLoading(prev => ({ ...prev, [ratingId]: true }));
    
    try {
      const result = await dispatch(likeProductRating({ 
        productId: productId, 
        ratingId: ratingId 
      })).unwrap();
      
      if (result.ratings) {
        setRatings(result.ratings);
        
        if (onRatingsUpdate) {
          onRatingsUpdate(result.ratings);
        }
        
        const event = new CustomEvent("rating-list-updated", {
          detail: result.ratings
        });
        window.dispatchEvent(event);
        
        toast.success("Bəyəndiniz!");
      }
    } catch (error) {
      console.error("Like error:", error);
      toast.error("Xəta baş verdi!");
    } finally {
      setIsLoading(prev => ({ ...prev, [ratingId]: false }));
    }
  };

  const handleDislike = async (ratingId) => {
    if (!user) {
      toast.warning("Giriş etməlisiniz!");
      return;
    }

    if (!productId || !ratingId) {
      toast.error("Parametr xətası!");
      return;
    }

    if (isLoading[ratingId]) return;

    setIsLoading(prev => ({ ...prev, [ratingId]: true }));
    
    try {
      const result = await dispatch(dislikeProductRating({ 
        productId: productId, 
        ratingId: ratingId 
      })).unwrap();
      
      if (result.ratings) {
        setRatings(result.ratings);
        
        if (onRatingsUpdate) {
          onRatingsUpdate(result.ratings);
        }
        
        const event = new CustomEvent("rating-list-updated", {
          detail: result.ratings
        });
        window.dispatchEvent(event);
        
        toast.success("Bəyənmədiniz!");
      }
    } catch (error) {
      console.error("Dislike error:", error);
      toast.error("Xəta baş verdi!");
    } finally {
      setIsLoading(prev => ({ ...prev, [ratingId]: false }));
    }
  };

  const handleReply = async (ratingId) => {
    if (!user) {
      toast.warning("Giriş etməlisiniz!");
      return;
    }

    const comment = replyInput[ratingId];
    if (!comment || comment.trim() === "") {
      toast.warning("Cavab boş ola bilməz!");
      return;
    }

    if (!productId || !ratingId) {
      toast.error("Parametr xətası!");
      return;
    }

    if (isLoading[ratingId]) return;

    setIsLoading(prev => ({ ...prev, [ratingId]: true }));
    
    try {
      const result = await dispatch(replyToProductRating({ 
        productId: productId, 
        ratingId: ratingId, 
        comment: comment.trim() 
      })).unwrap();
      
      if (result.ratings) {
        setRatings(result.ratings);
        
        if (onRatingsUpdate) {
          onRatingsUpdate(result.ratings);
        }
        
        const event = new CustomEvent("rating-list-updated", {
          detail: result.ratings
        });
        window.dispatchEvent(event);
        
        setReplyInput({ ...replyInput, [ratingId]: "" });
        setShowReplyField({ ...showReplyField, [ratingId]: false });
        toast.success("Cavab əlavə olundu!");
      }
    } catch (error) {
      console.error("Reply error:", error);
      toast.error("Xəta baş verdi!");
    } finally {
      setIsLoading(prev => ({ ...prev, [ratingId]: false }));
    }
  };

  const toggleReplyField = (ratingId) => {
    setShowReplyField(prev => ({
      ...prev,
      [ratingId]: !prev[ratingId]
    }));
  };

  if (!ratings.length) return <p className={styles.empty}>Hələ heç bir rəy yoxdur.</p>;

  return (
    <div className={styles.reviewList}>
      <h3 className={styles.title}>İstifadəçi rəyləri</h3>
      {ratings.map((r, i) => (
        <div key={r._id || i} className={styles.reviewItem}>
          <div className={styles.stars}>
            {Array.from({ length: 5 }).map((_, i) =>
              i < r.rating ? (
                <FaStar key={i} color="#facc15" />
              ) : (
                <FaRegStar key={i} color="#e2e8f0" />
              )
            )}
          </div>

          <div className={styles.user}>
            <FaUserCircle className={styles.userIcon} />
            <span>
              {r.user?.firstName ?? "İstifadəçi"} {r.user?.lastName ?? ""}
            </span>
          </div>

          <p className={styles.comment}>{r.comment}</p>

          {/* Like/Dislike/Reply buttons */}
          <div className={styles.actions}>
            <button
              onClick={() => handleLike(r._id)}
              disabled={isLoading[r._id] || !r._id}
              className={`${styles.actionBtn} ${
                r.likes?.includes(user?._id) ? styles.liked : ""
              }`}
            >
              <FaThumbsUp /> {r.likes?.length || 0}
            </button>

            <button
              onClick={() => handleDislike(r._id)}
              disabled={isLoading[r._id] || !r._id}
              className={`${styles.actionBtn} ${
                r.dislikes?.includes(user?._id) ? styles.disliked : ""
              }`}
            >
              <FaThumbsDown /> {r.dislikes?.length || 0}
            </button>

            <button
              onClick={() => toggleReplyField(r._id)}
              disabled={!r._id}
              className={styles.actionBtn}
            >
              <FaReply /> Cavab yaz
            </button>
          </div>

          {showReplyField[r._id] && (
            <div className={styles.replyBox}>
              <textarea
                value={replyInput[r._id] || ""}
                onChange={(e) =>
                  setReplyInput({
                    ...replyInput,
                    [r._id]: e.target.value,
                  })
                }
                placeholder="Cavabınızı yazın..."
                disabled={isLoading[r._id]}
                className={styles.replyInput}
              />
              <div className={styles.replyActions}>
                <button
                  onClick={() => handleReply(r._id)}
                  disabled={isLoading[r._id]}
                  className={styles.sendBtn}
                >
                  {isLoading[r._id] ? "Göndərilir..." : "Göndər"}
                </button>
                <button
                  onClick={() => toggleReplyField(r._id)}
                  className={styles.cancelBtn}
                >
                  Ləğv et
                </button>
              </div>
            </div>
          )}

          {r.replies?.length > 0 && (
            <div className={styles.replies}>
              {r.replies.map((reply) => (
                <div key={reply._id} className={styles.reply}>
                  <div className={styles.replyUser}>
                    <FaUserCircle className={styles.replyUserIcon} />
                    <span>
                      {reply.user?.firstName} {reply.user?.lastName}
                    </span>
                    <span className={styles.replyDate}>
                      {new Date(reply.createdAt).toLocaleDateString("az-AZ")}
                    </span>
                  </div>
                  <p className={styles.replyComment}>{reply.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RatingListProduct;