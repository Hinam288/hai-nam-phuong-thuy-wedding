# Hải Nam & Phương Thúy — Thiệp cưới

Website tĩnh chạy bằng HTML, CSS và JavaScript. Trang chính: `index.html`; album trình chiếu: `slideshow.html`.

## GitHub Pages

Trong repository: **Settings → Pages → Deploy from a branch → main → /(root) → Save**.
Website sẽ được phục vụ bởi GitHub, không phụ thuộc máy tính cá nhân.

## Xác nhận tham dự

Form gửi đến Cloudflare Worker cấu hình trong `CONFIG.rsvpEndpoint`.
Sau khi có URL Pages, thêm origin `https://TEN-TAI-KHOAN.github.io` vào biến `ALLOWED_ORIGINS` của Worker, giữ các origin cũ nếu còn dùng. Không thêm tên repository hoặc dấu `/` cuối.
Token Telegram và khóa Google Sheets chỉ nằm trong dịch vụ phía máy chủ, không đưa vào repository.

## Thêm ảnh

- Mỗi mốc 2022–2026: `image_2022_a.png`, `image_2022_b.png`, `image_2022_c.png`, `image_2022_d.png` (tương tự cho các năm khác).
- QR mừng cưới: `image_QR.jpg`, tỷ lệ 3:4.
- Nền lời mời: `image_loi_moi.png`.
- Album slideshow: cập nhật `slideshow-photos.js`.

Tên file phân biệt chữ hoa/chữ thường trên GitHub Pages. Các ảnh chưa thêm sẽ hiện khung chờ.
