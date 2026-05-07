import React, { useState, useEffect } from "react";
import "./App.css";
import { rawPlaces, categoryData } from "./data";

function App() {
  const [places, setPlaces] = useState(() => {
    const saved = localStorage.getItem("places_data");
    return saved ? JSON.parse(saved) : rawPlaces;
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem("reviews_data");
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [comment, setComment] = useState("");
  const [userRating, setUserRating] = useState(5);
  const [replyTo, setReplyTo] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [view, setView] = useState("home");

  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", name: "", interest: "Food" });

  useEffect(() => {
    localStorage.setItem("places_data", JSON.stringify(places));
    localStorage.setItem("reviews_data", JSON.stringify(reviews));
  }, [places, reviews]);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    setVisibleCount(8);
  }, [category, search]);

  // --- HÀM XỬ LÝ (GIỮ NGUYÊN NHƯ CŨ) ---
  const isFormValid = () => {
    const isEmailValid = formData.email.includes("@");
    const isPasswordValid = formData.password.length >= 6;
    return isLogin ? (isEmailValid && isPasswordValid) : (isEmailValid && isPasswordValid && formData.name.length > 0);
  };

const handleAuth = (e) => {
  e.preventDefault();
  if (!isFormValid()) return;
  
  const userData = { 
    name: isLogin ? (formData.email.split('@')[0]) : formData.name, 
    email: formData.email,
    interest: formData.interest,
    birthday: "2000-01-01", // Mặc định
    gender: "Nam",          // Mặc định
    avatar: "https://cdn-icons-png.flaticon.com/512/147/147144.png" // Ảnh mặc định
  };
  
  setUser(userData);
  localStorage.setItem("user", JSON.stringify(userData));
  setShowAuth(false);
};

  const handleLike = (id) => {
    if (!user) return alert("Mời đại ca đăng nhập mới Like được!");
    const updated = places.map(p => {
      if (p.id === id) {
        const hasLiked = p.likes.includes(user.name);
        return { ...p, likes: hasLiked ? p.likes.filter(u => u !== user.name) : [...p.likes, user.name] };
      }
      return p;
    });
    setPlaces(updated);
  };

  const handleReview = () => {
    if (!user) return alert("Đăng nhập mới cho bình luận nhé!");
    if (!comment.trim()) return alert("Nhập nội dung đã!");
    const newReview = { id: Date.now(), placeId: selectedPlace.id, text: comment, user: user.name, star: userRating, reactions: { like: 0, heart: 0, haha: 0 }, parentId: null };
    setReviews([newReview, ...reviews]);
    setComment("");
  };

  const handleReply = (parentReviewId) => {
    if (!user) return alert("Phải đăng nhập mới phản hồi được!");
    if (!comment.trim()) return alert("Nhập nội dung phản hồi!");
      const now = new Date();
      const timeString = `${now.getHours()}:${now.getMinutes()} - ${now.getDate()}/${now.getMonth() + 1}`;
      const newReview = { 
    id: Date.now(), 
    placeId: selectedPlace.id, 
    text: comment, 
    user: user.name, 
    star: userRating, 
    reactions: { like: 0, heart: 0, haha: 0 }, 
    parentId: null,
    date: timeString // Lưu vào đây
  };
  
  setReviews([newReview, ...reviews]);
  setComment("");
};

  const handleReaction = (reviewId, type) => {
    if (!user) return alert("Login đi rồi mới cho thả icon!");
    setReviews(reviews.map(r => r.id === reviewId ? { ...r, reactions: { ...r.reactions, [type]: r.reactions[type] + 1 } } : r));
  };

  // --- LOGIC LỌC VÀ HIỂN THỊ ---
const filtered = places
  .filter(p => (category === "All" || p.category === category) && p.name.toLowerCase().includes(search.toLowerCase()))
  .sort((a, b) => {
    // 1. Ưu tiên theo lượt Thích của User đang đăng nhập
    if (user) {
      const aLiked = a.likes.includes(user.name) ? 1 : 0;
      const bLiked = b.likes.includes(user.name) ? 1 : 0;
      if (aLiked !== bLiked) return bLiked - aLiked; // Thằng nào có like (1) thì đứng trước thằng ko like (0)
    }

    // 2. Nếu cùng Like hoặc cùng Không Like, thì ưu tiên Rating (Sao cao lên đầu)
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }

    // 3. Nếu bằng sao luôn thì xếp theo ID (hoặc tên)
    return a.id - b.id;
  });

return (
    <div className="app">
      {/* HEADER: Luôn hiện */}
      <div className="header">
        <h2 onClick={() => setView("home")} style={{cursor:'pointer'}}>🌍 ExploreEase</h2>
        <div className="user-section">
          {!user ? (
            <button className="btn-login" onClick={() => setShowAuth(true)}>Login</button>
          ) : (
            <div className="user-info">
              <span onClick={() => setView("profile")} style={{cursor:'pointer'}}>Hi, <b>{user.name}</b></span>
              <button className="btn-logout" onClick={() => { setUser(null); setView("home"); localStorage.removeItem("user"); }}>Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* CHỖ NÀY QUAN TRỌNG: Chia view */}
      {view === "home" ? (
        <>
          <div className="hero">
            <h1>Discover Amazing Places</h1>
            <p>Gợi ý thông minh cho chuyến đi của bạn</p>
          </div>

          <div className="category-section">
            {categoryData.map(cat => (
              <div key={cat.name} className={`cat-card ${category === cat.name ? 'active' : ''}`} onClick={() => setCategory(cat.name)}>
                <span className="cat-icon">{cat.icon}</span>
                <h4>{cat.label}</h4>
              </div>
            ))}
            <button className="btn-reset" onClick={() => setCategory("All")}>Tất cả</button>
          </div>

          <div className="search-bar">
            <input type="text" placeholder="Tìm kiếm địa điểm..." onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="grid">
            {filtered.slice(0, visibleCount).map(p => (
              <div key={p.id} className="card">
                <div className="card-img" onClick={() => setSelectedPlace(p)}>
                    <img src={p.image} alt={p.name} onError={(e) => {e.target.src="https://via.placeholder.com/400x300"}} />
                    <span className="badge">{p.category}</span>
                </div>
                <div className="card-body">
                    <h3>{p.name}</h3>
                    {/* CHÈN GIÁ TIỀN VÀO ĐÂY NÈ MÀY */}
          <div className="card-price" style={{
            color: '#ff4757', 
            fontWeight: 'bold', 
            margin: '5px 0', 
            fontSize: '15px'
          }}>
            💰 {p.price || "Chưa có giá"}
          </div>
                    <div className="card-actions">
                      <button onClick={(e) => {e.stopPropagation(); handleLike(p.id)}} className="like-btn">
                        {p.likes.includes(user?.name) ? "❤️" : "🤍"} {p.likes.length}
                      </button>
                      <span>⭐ {p.rating}</span>
                    </div>
                    <button className="btn-view" onClick={() => setSelectedPlace(p)}>Xem chi tiết</button>
                </div>
              </div>
            ))}
          </div>

          {visibleCount < filtered.length && (
            <div className="load-more-container">
              <button className="btn-load-more" onClick={() => setVisibleCount(visibleCount + 8)}>
                Xem thêm ({filtered.length - visibleCount} địa điểm)
              </button>
            </div>
          )}
        </>
      ) : (
        /* ĐÂY LÀ PHẦN MÀY ĐANG THIẾU: Trang Profile cá nhân */
        <div className="profile-container">
    <div className="profile-grid-layout">
      
      {/* CỘT TRÁI: THÔNG TIN CÁ NHÂN */}
      <aside className="profile-sidebar">
        <div className="avatar-section">
          <img src={user.avatar || "https://cdn-icons-png.flaticon.com/512/147/147144.png"} alt="avatar" className="main-avatar" />
          <button className="btn-edit-avatar" onClick={() => {
            const url = prompt("Dán link ảnh đại diện mới:", user.avatar);
            if(url) setUser({...user, avatar: url});
          }}>Đổi ảnh</button>
        </div>
        
        <div className="info-form">
          <div className="info-group">
            <label>Họ tên</label>
            <input type="text" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} />
          </div>
          <div className="info-group">
            <label>Ngày sinh</label>
            <input type="date" value={user.birthday || "2000-01-01"} onChange={(e) => setUser({...user, birthday: e.target.value})} />
          </div>
          <div className="info-group">
            <label>Giới tính</label>
            <select value={user.gender || "Nam"} onChange={(e) => setUser({...user, gender: e.target.value})}>
              <option>Nam</option><option>Nữ</option><option>Khác</option>
            </select>
          </div>
          <div className="info-group">
            <label>Sở thích chính</label>
            <input type="text" value={user.interest} onChange={(e) => setUser({...user, interest: e.target.value})} />
          </div>
          <button className="btn-save" onClick={() => {
            localStorage.setItem("user", JSON.stringify(user));
            alert("Đã lưu thông tin cá nhân!");
          }}>Lưu thay đổi</button>
          <button className="btn-reset" style={{marginTop: '10px', width: '100%'}} onClick={() => setView("home")}>
            ← Quay lại trang chủ
          </button>
        </div>
      </aside>

      {/* CỘT PHẢI: HOẠT ĐỘNG */}
      <section className="profile-main">
        <div className="tabs-content">
          <h3>❤️ Địa điểm đã lưu ({places.filter(p => p.likes.includes(user.name)).length})</h3>
          <div className="saved-grid">
            {places.filter(p => p.likes.includes(user.name)).map(p => (
              <div key={p.id} className="mini-card" onClick={() => {setSelectedPlace(p); setView("home")}}>
                <img src={p.image} alt="" />
                <div className="mini-card-info">
                  <h4>{p.name}</h4>
                  <small>{p.category}</small>
                </div>
              </div>
            ))}
            {places.filter(p => p.likes.includes(user.name)).length === 0 && <p style={{color: '#999'}}>Chưa có địa điểm nào.</p>}
          </div>

          <h3 style={{marginTop: '40px'}}>💬 Bình luận của bạn ({reviews.filter(r => r.user === user.name).length})</h3>
          <div className="user-reviews-list">
            {reviews.filter(r => r.user === user.name).map(r => (
              <div key={r.id} className="user-review-card">
                <p><strong>Bạn viết:</strong> "{r.text}"</p>
                <small>Tại: {places.find(p => p.id === r.placeId)?.name}</small>
              </div>
            ))}
            {reviews.filter(r => r.user === user.name).length === 0 && <p style={{color: '#999'}}>Bạn chưa có bình luận nào.</p>}
          </div>
        </div>
      </section>

    </div>
  </div>
)} 



      {/* Auth Modal & Detail Modal giữ nguyên như cũ... (phần này mày đã có ở bản trước) */}

{showAuth && (
  <div className="modal-overlay" onClick={() => setShowAuth(false)}>
    <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
      <div className="auth-tabs">
        <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>Đăng nhập</button>
        <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>Tạo tài khoản</button>
      </div>

      <div className="social-login">
        <button className="btn-google" onClick={() => alert("Đang kết nối Google API...")}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Color_Icon.svg" width="20" alt="google" />        </button>
      </div>

      <div className="divider">Hoặc dùng Email</div>

      <form onSubmit={handleAuth}>
        {!isLogin && (
          <div className="form-group">
            <label>Họ tên</label>
            <input type="text" placeholder="Nguyễn Văn A" onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
        )}
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="example@gmail.com" onChange={(e) => setFormData({...formData, email: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Mật khẩu</label>
          <input type="password" placeholder="••••••••" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          {isLogin && (
       <span 
    className="forgot-pw"style={{ cursor: 'pointer' }} onClick={() => alert("Chức năng gửi mail OTP đang bảo trì!")}>Quên mật khẩu?</span>
)}
        </div>

        <button type="submit" className="btn-submit">
          {isLogin ? "Đăng nhập ngay" : "Gửi mã OTP đăng ký"}
        </button>
      </form>
    </div>
  </div>
)}




      {selectedPlace && (

        <div className="modal-overlay" onClick={() => setSelectedPlace(null)}>

          <div className="modal-content detail-modal" onClick={e => e.stopPropagation()}>

            <button className="close-btn" onClick={() => setSelectedPlace(null)}>×</button>

            <img src={selectedPlace.image} className="modal-img" alt="" onError={(e) => {e.target.src="https://via.placeholder.com/600x400"}}/>

            <div className="detail-body">

              <div className="detail-header">

                <h2>{selectedPlace.name} <span className="detail-rating">⭐ {selectedPlace.rating}</span></h2>

                <p className="detail-info">📍 {selectedPlace.address} | 🕒 {selectedPlace.hours}</p>

                <button className="btn-direction" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlace.name + ' ' + selectedPlace.address)}`, '_blank')}>

                  🚀 Chỉ đường ngay

                </button>

              </div>

              <p className="detail-desc">{selectedPlace.description}</p>

              <hr />

              <div className="review-section">

                <h3>Bình luận ({reviews.filter(r => r.placeId === selectedPlace.id).length})</h3>

                <div className="review-list">

                  {reviews.filter(r => r.placeId === selectedPlace.id).map((r) => (

                    <div key={r.id} className="review-item" style={{marginLeft: r.parentId ? '35px' : '0', borderLeft: r.parentId ? '2px dashed #ccc' : '4px solid var(--primary)'}}>

                      <div className="review-user-info"><b>{r.user}</b> <span>{r.star > 0 ? "⭐".repeat(r.star) : "↪️ Phản hồi"}</span></div>

                      <p>{r.text}</p>

                      <div className="review-reactions">

                        <span onClick={() => handleReaction(r.id, 'like')}>👍 {r.reactions.like}</span>

                        <span onClick={() => handleReaction(r.id, 'heart')}>❤️ {r.reactions.heart}</span>

                        {!r.parentId && <span onClick={() => {setReplyTo(r.id); setComment("");}} style={{color: 'var(--primary)', fontWeight:'bold', cursor:'pointer'}}>Reply</span>}

                      </div>

                    </div>

                  ))}

                </div>

                <div className="add-review">

                  {replyTo && <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}><small>Đang phản hồi...</small><small style={{color:'red', cursor:'pointer'}} onClick={() => setReplyTo(null)}>Hủy</small></div>}

                  {!replyTo && <div className="star-picker">{[1,2,3,4,5].map(num => <span key={num} onClick={() => setUserRating(num)} style={{cursor:'pointer'}}>{num <= userRating ? "⭐" : "☆"}</span>)}</div>}

                  <textarea placeholder={replyTo ? "Viết phản hồi..." : "Chia sẻ cảm nghĩ..."} value={comment} onChange={(e) => setComment(e.target.value)} />

                  <button className="btn-submit" onClick={() => replyTo ? handleReply(replyTo) : handleReview()}>{replyTo ? "Gửi phản hồi" : "Gửi đánh giá"}</button>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

<footer className="footer">© 2026 ExploreEase - Đồ án du lịch thông minh</footer>
    </div>
  );
}

export default App; 