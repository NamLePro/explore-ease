import React, { useState, useEffect } from "react";
import "./App.css";

const rawPlaces = [
  { id: 1, name: "Vịnh Hạ Long", category: "Nature", rating: 4.9, likes: [], address: "Quảng Ninh", hours: "07:30 - 17:00", description: "Di sản thiên nhiên thế giới UNESCO với hàng ngàn đảo đá vôi kỳ vĩ.", image: "https://cdnv2.tgdd.vn/mwg-static/common/News/1587612/khung-canh-vinh-ha-long-3.jpg" },
  { id: 2, name: "Cố Đô Huế", category: "Culture", rating: 4.8, likes: [], address: "Thừa Thiên Huế", hours: "08:00 - 17:30", description: "Quần thể di tích cung đình triều Nguyễn cổ kính và uy nghiêm.", image: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Ngomon2.jpg" },
  { id: 3, name: "Tràng An - Ninh Bình", category: "Nature", rating: 4.9, likes: [], address: "Ninh Bình", hours: "07:00 - 17:00", description: "Hạ Long trên cạn với hệ thống hang động và sông ngòi kỳ ảo.", image: "https://trangandanhthang.vn/wp-content/uploads/2025/06/khu-du-lich-trang-an-1.png" },
  { id: 4, name: "Phố Cổ Hội An", category: "Culture", rating: 4.9, likes: [], address: "Hội An, Quảng Nam", hours: "24/7", description: "Thương cảng cổ với đèn lồng lung linh và kiến trúc đặc trưng.", image: "https://images.vietnamtourism.gov.vn/vn/images/2019/Hoiantown.jpg" },
  { id: 5, name: "Phở Gia Truyền Bát Đàn", category: "Food", rating: 4.8, likes: [], address: "49 Bát Đàn, Hà Nội", hours: "06:00 - 20:30", description: "Hương vị phở bò truyền thống nổi tiếng bậc nhất Hà Thành.", image: "https://mia.vn/media/uploads/blog-du-lich/Pho-bat-dan-pho-gia-truyen-100-nam-tuoi-tai-ha-noi-01-1639325605.jpg" },
  { id: 6, name: "Bánh Mì Phượng", category: "Food", rating: 4.7, likes: [], address: "2B Phan Chu Trinh, Hội An", hours: "06:30 - 21:30", description: "Món bánh mì kẹp đậm đà được mệnh danh ngon nhất thế giới.", image: "https://ticotravel.com.vn/wp-content/uploads/2021/05/banh-my-phuong-hoi-an-5.jpg" },
  { id: 7, name: "Đất Mũi Cà Mau", category: "Nature", rating: 4.8, likes: [], address: "Ngọc Hiển, Cà Mau", hours: "06:00 - 18:00", description: "Điểm cực Nam thiêng liêng với hệ sinh thái rừng ngập mặn đặc trưng.", image: "http://vuonqgmcm.camau.gov.vn//Datafiles/vuonqgmcm-camau-gov-vn//wps/wcm/connect/vuonquocgiamuicamau/194d34e6-80cb-4060-a8a4-37ce0b688c2c/29-2ba1-jpg-3fmod-3dajperes-26amp-3bcacheid-3droot.png" },
  { id: 8, name: "Chợ Đêm Đà Lạt", category: "Shopping", rating: 4.5, likes: [], address: "TP. Đà Lạt", hours: "17:00 - 02:00", description: "Thiên đường đồ len và ẩm thực đường phố đặc sắc vùng cao.", image: "https://cms.junglebosstours.com/assets/fac7c043-6a61-4ba7-92e2-305a88a2c71d?width=1080&height=815" },
  { id: 9, name: "Phan Xi Păng", category: "Nature", rating: 5.0, likes: [], address: "Sa Pa, Lào Cai", hours: "08:00 - 17:00", description: "Nóc nhà Đông Dương với biển mây bồng bềnh đại ngàn vĩ đại.", image: "https://vcdn1-vnexpress.vnecdn.net/2019/06/26/top-1561543182-8962-1561543223.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=mKX6s7Dni3W691GdDV0w7Q" },
  { id: 10, name: "Cầu Vàng", category: "Nature", rating: 4.8, likes: [], address: "Bà Nà Hills, Đà Nẵng", hours: "08:00 - 18:00", description: "Cây cầu mang kiến trúc bàn tay khổng lồ nâng đỡ dải lụa vàng giữa mây trời.", image: "https://vcdn1-dulich.vnecdn.net/2023/07/06/cau-vang-1688636446-7155-1688636537.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=lJCuVDPNZLyKMhSRJziCJw" },
  { id: 11, name: "Bún Bò Huế", category: "Food", rating: 4.6, likes: [], address: "Thừa Thiên Huế", hours: "07:00 - 21:00", description: "Món ăn quốc hồn quốc túy với nước dùng đậm đà, chuẩn vị cung đình Huế.", image: "https://i0.wp.com/vickypham.com/wp-content/uploads/2022/06/43225-eosm50_9635-edit.jpg" },
  { id: 12, name: "Chợ Bến Thành", category: "Shopping", rating: 4.4, likes: [], address: "Quận 1, TP.HCM", hours: "06:00 - 22:00", description: "Biểu tượng văn hóa và giao thương sầm uất lâu đời nhất Sài Gòn.", image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Ben_Thanh_market_2.jpg" },
  { id: 13, name: "Nhà Thờ Đức Bà", category: "Culture", rating: 4.7, likes: [], address: "Quận 1, TP.HCM", hours: "08:00 - 11:00", description: "Kiến trúc Công giáo phong cách Romanesque và Gothic cổ điển tuyệt đẹp.", image: "https://buulong.com.vn/wp-content/uploads/2026/03/nha-tho-duc-ba-sai-gon-5.jpg" },
  { id: 14, name: "Gành Đá Đĩa", category: "Nature", rating: 4.8, likes: [], address: "Tuy An, Phú Yên", hours: "07:00 - 18:00", description: "Tuyệt tác từ những khối đá lăng trụ xếp chồng tự nhiên bên bờ biển xanh.", image: "https://statics.vinpearl.com/ganh-da-dia-phu-yen_1751078702.jpg" },
  { id: 15, name: "Bún Chả Hương Liên", category: "Food", rating: 4.9, likes: [], address: "Hai Bà Trưng, Hà Nội", hours: "08:00 - 21:00", description: "Địa chỉ bún chả nổi tiếng thế giới, nơi từng đón tiếp Tổng thống Obama.", image: "https://media.diadiem247.com/uploads/w900/2021/01/25/bun-cha-huong-lien.jpg" },
  { id: 16, name: "VinWonders Phú Quốc", category: "Shopping", rating: 4.9, likes: [], address: "Phú Quốc, Kiên Giang", hours: "09:00 - 20:00", description: "Tổ hợp vui chơi giải trí và đại lộ mua sắm mang phong cách châu Âu đẳng cấp.", image: "https://vinpearlphuquocresort.com/wp-content/uploads/2022/01/Vin-wonders-phu-quoc-dai-lo-chau-au-2.jpg" },
  { id: 17, name: "Thánh địa Mỹ Sơn", category: "Culture", rating: 4.6, likes: [], address: "Quảng Nam", hours: "06:30 - 17:30", description: "Di sản thế giới với những đền đài Chăm Pa cổ xưa mang vẻ đẹp huyền bí.", image: "https://danangfantasticity.com/wp-content/uploads/2025/09/khu-den-thap-my-son-03-1024x576.jpg" },
  { id: 18, name: "Địa đạo Củ Chi", category: "Culture", rating: 4.9, likes: [], address: "Huyện Củ Chi, TP.HCM", hours: "07:00 - 17:00", description: "Hệ thống đường hầm lịch sử độc đáo minh chứng cho ý chí kiên cường.", image: "https://statics.vinpearl.com/du-lich-dia-dao-cu-chi-2_1625068208.jpg" }
];

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

  // Reset Load More khi lọc
  useEffect(() => {
    setVisibleCount(8);
  }, [category, search]);

  const isFormValid = () => {
    const isEmailValid = formData.email.includes("@");
    const isPasswordValid = formData.password.length >= 6;
    return isLogin ? (isEmailValid && isPasswordValid) : (isEmailValid && isPasswordValid && formData.name.length > 0);
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    const userData = { name: isLogin ? (formData.email.split('@')[0]) : formData.name, interest: formData.interest };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setShowAuth(false);
    setFormData({ email: "", password: "", name: "", interest: "Food" });
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
    const parent = reviews.find(r => r.id === parentReviewId);
    const newReply = { id: Date.now(), placeId: selectedPlace.id, parentId: parentReviewId, text: `@${parent.user}: ${comment}`, user: user.name, star: 0, reactions: { like: 0, heart: 0, haha: 0 } };
    setReviews([newReply, ...reviews]);
    setComment("");
    setReplyTo(null);
  };

  const handleReaction = (reviewId, type) => {
    if (!user) return alert("Login đi rồi mới cho thả icon!");
    setReviews(reviews.map(r => r.id === reviewId ? { ...r, reactions: { ...r.reactions, [type]: r.reactions[type] + 1 } } : r));
  };

  const filtered = places
    .filter(p => (category === "All" || p.category === category) && p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (user && a.category === user.interest ? -1 : 1));

  const categories = [
    { name: "Food", icon: "🍜", label: "Ẩm thực" },
    { name: "Shopping", icon: "🛍️", label: "Mua sắm" },
    { name: "Culture", icon: "🏛️", label: "Văn hóa" },
    { name: "Nature", icon: "🌲", label: "Thiên nhiên" }
  ];

  return (
    <div className="app">
      <div className="header">
        <h2 onClick={() => window.location.reload()} style={{cursor:'pointer'}}>🌍 ExploreEase</h2>
        <div className="user-section">
          {!user ? (
            <button className="btn-login" onClick={() => setShowAuth(true)}>Login</button>
          ) : (
            <div className="user-info">
              <span>Hi, <b>{user.name}</b></span>
              <button className="btn-logout" onClick={() => { setUser(null); localStorage.removeItem("user"); }}>Logout</button>
            </div>
          )}
        </div>
      </div>

      <div className="hero">
        <h1>Discover Amazing Places</h1>
        <p>Gợi ý thông minh cho chuyến đi của bạn</p>
      </div>

      <div className="category-section">
        {categories.map(cat => (
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
          <button className="btn-load-more" onClick={() => setVisibleCount(visibleCount + 4)}>
            Xem thêm ({filtered.length - visibleCount} địa điểm)
          </button>
        </div>
      )}

      {/* Auth Modal & Detail Modal giữ nguyên như cũ... (phần này mày đã có ở bản trước) */}
      {showAuth && (
        <div className="modal-overlay" onClick={() => setShowAuth(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <div className="auth-tabs">
              <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>Đăng nhập</button>
              <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>Đăng ký</button>
            </div>
            <form onSubmit={handleAuth}>
              {!isLogin && <div className="form-group"><label>Tên hiển thị</label><input type="text" onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>}
              <div className="form-group"><label>Email</label><input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
              <div className="form-group"><label>Mật khẩu</label><input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} /></div>
              {!isLogin && (
                <div className="form-group">
                  <label>Sở thích</label>
                  <select onChange={(e) => setFormData({...formData, interest: e.target.value})}>
                    <option value="Food">Ẩm thực</option><option value="Culture">Văn hóa</option><option value="Shopping">Mua sắm</option><option value="Nature">Thiên nhiên</option>
                  </select>
                </div>
              )}
              <button type="submit" className="btn-submit" disabled={!isFormValid()}>{isLogin ? "Vào thôi!" : "Đăng ký"}</button>
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