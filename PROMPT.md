# Prompt refactor HTML5 semantic
Sử dụng prompt sau cùng nội dung index.html và css/style.css:

> Bạn là lập trình viên HTML5. Refactor index.html và xuất kết quả vào index_new.html để cải thiện ngữ nghĩa và SEO cơ bản. Giữ nguyên bố cục, toàn bộ nội dung hiển thị, ảnh, liên kết, thứ tự phần tử, các id/class và đường dẫn CSS. Giữ index.html gốc để đối chiếu.
>
> Thay div#header bằng header, div#main bằng main, div#sidebar bằng aside, div#navigation bằng nav và div#footer bằng footer. Đóng thẻ đúng cặp, chỉ dùng một main. Giữ div cho các khối chỉ có chức năng trình bày; không dùng section/article tùy tiện nếu không có ngữ nghĩa phù hợp.
>
> Thêm lang="en" theo ngôn ngữ nội dung và meta description mô tả đúng trang. Giữ h1 hiện có. Không thêm nội dung nhìn thấy hoặc đổi kiểu chữ. Kiểm tra selector CSS có phụ thuộc tên thẻ; đảm bảo các id/class giữ nguyên vẫn được áp dụng và không làm thay đổi giao diện.
>
> Kiểm tra HTML không có thẻ đóng dư, id trùng hoặc cấu trúc sai. So sánh nội dung văn bản, src ảnh, href và giao diện giữa hai trang. Trả về toàn bộ index_new.html và giải thích ngắn các thay đổi semantic.

## Ghi chú bài 3–4
- Mở trực tiếp register.html, media.html hoặc index_new.html bằng trình duyệt.
- register.html dùng kiểm tra dữ liệu HTML5; không có backend, không gửi hoặc lưu dữ liệu đăng ký.
- media.html dùng file video hoa và âm thanh khủng long công khai của MDN để minh họa thẻ media. Đây không phải video sự kiện hoặc podcast thật. Thay src bằng media của sự kiện khi có file.
- Video, audio và bản đồ cần kết nối Internet. Ảnh và khung bố cục dùng tài nguyên trong dự án.
