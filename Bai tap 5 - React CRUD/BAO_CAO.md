# Báo cáo bài tập React CRUD

Ứng dụng: [index.html](index.html) – quản lý người dùng (Thêm / Sửa / Xóa / Tìm kiếm), dữ liệu lấy từ `https://jsonplaceholder.typicode.com/users`.

## 1. Sơ đồ Component (Component Tree)

```
App                       (state: kw, newUser)
├── SearchForm            (input tìm kiếm)
├── AddUser               (state: adding, user)
│   └── UserForm          (form modal dùng chung)
└── ResultTable           (state: users, loading, error, editing)
    └── UserForm          (form modal khi bấm Sửa)
```

| Component | Vai trò |
|---|---|
| App | Giữ state dùng chung (`kw`, `newUser`), truyền props xuống con |
| SearchForm | Nhận từ khóa người dùng gõ |
| AddUser | Form thêm người dùng mới |
| ResultTable | Tải, lọc, hiển thị, sửa, xóa người dùng |
| UserForm | (phần tách thêm) form modal dùng lại cho Thêm và Sửa |

## 2. Luồng dữ liệu (State Lifting)

```
SearchForm --onChangeValue(kw)--> App (kw) --keyword--> ResultTable (lọc)
AddUser    --onAdd(user)--------> App (newUser) --user--> ResultTable (thêm vào users) --onAdded()--> App (newUser = null)
```

**Vì sao `kw` và `newUser` đặt ở App mà không đặt ở SearchForm hay AddUser?**

- React có luồng dữ liệu **một chiều**: cha → con qua props. Hai component anh em (`SearchForm`, `ResultTable`) không thể truyền dữ liệu trực tiếp cho nhau.
- `kw` do `SearchForm` tạo ra nhưng `ResultTable` mới là nơi dùng để lọc. Nếu đặt `kw` trong SearchForm thì ResultTable không đọc được.
- Tương tự `newUser`: AddUser tạo ra, ResultTable cần để thêm vào danh sách.
- Giải pháp: **nâng state lên (lifting state up)** component cha chung gần nhất là `App`. App giữ state, truyền hàm cập nhật (`setKeyword`, `setNewUser`) xuống con làm callback, và truyền giá trị xuống ResultTable. Nhờ vậy có một nguồn dữ liệu duy nhất (single source of truth), tránh trùng lặp và lệch dữ liệu.
- Sau khi ResultTable nhận `newUser` và thêm vào danh sách, nó gọi `onAdded()` để App đặt lại `newUser = null`, sẵn sàng cho lần thêm tiếp theo.

## 3. Bảng Props truyền từ App xuống

| Component con | Prop | Kiểu | Nguồn / ý nghĩa |
|---|---|---|---|
| SearchForm | `onChangeValue` | function | `setKeyword` của App; gọi khi gõ để cập nhật `kw` |
| AddUser | `onAdd` | function | `setNewUser` của App; gọi khi bấm Thêm, gửi user lên App |
| ResultTable | `keyword` | string | giá trị `kw`, dùng lọc theo name/username |
| ResultTable | `user` | object \| null | giá trị `newUser`, người dùng mới cần thêm |
| ResultTable | `onAdded` | function | `() => setNewUser(null)`, báo đã xử lý xong user mới |

Props từ component trung gian xuống `UserForm`: `title`, `values`, `onFieldChange`, `onSubmit`, `onCancel`, `submitText`.

## 4. Lỗi gặp phải và cách sửa

Các lỗi dưới đây xuất hiện khi làm theo mã mẫu trong tài liệu hướng dẫn; mỗi lỗi đều đã được sửa trong [index.html](index.html).

**Lỗi 1 – "Too many re-renders" / form Thêm tự đóng ngay khi mở**
- Mã mẫu: `<button onClick={setAdding(false)}>Hủy</button>`
- Nguyên nhân: `setAdding(false)` được **gọi ngay lúc render** thay vì truyền hàm cho onClick, gây set state liên tục trong lúc render.
- Sửa: `onClick={() => setAdding(false)}`.

**Lỗi 2 – `ReferenceError: handleEditChange is not defined`, và JSX lỗi "Adjacent JSX elements must be wrapped"**
- Mã mẫu dùng `handleEditChange` nhưng không định nghĩa; đồng thời `{editing && (<label/> <input/>)}` trả về nhiều phần tử cùng cấp mà không có thẻ bọc.
- Sửa: viết `handleEditChange(id, value)` dùng `setEditing(prev => ...)` và bọc form trong một phần tử cha (ở bài là component `UserForm`).

**Lỗi 3 – Warning "Each child in a list should have a unique key" / hai dòng trùng id**
- Mã mẫu gán id mới bằng `prev.length + 1`. Sau khi xóa một người (ví dụ id 3 trong 10 người), thêm mới sẽ ra id 10, trùng với người đang có → trùng `key`, thao tác Sửa/Xóa tác động nhầm cả hai dòng.
- Sửa: dùng `max(id) + 1`.

**Lỗi 4 – Sửa dữ liệu trong form làm đổi luôn dòng trong bảng (lỗi tham chiếu)**
- Nếu chỉ `setEditing(user)` hoặc chỉ copy nông `{...user}` thì `address` vẫn trỏ cùng object gốc, gõ vào form là bảng đổi theo kể cả khi bấm Hủy.
- Sửa: sao chép sâu phần lồng: `setEditing({ ...user, address: { ...user.address } })`. Tương tự khi nhập `street/suite/city` phải spread cả `address`, nếu không sẽ mất các trường còn lại.

**Lỗi 5 – Bảng trắng khi API lỗi / mất mạng**
- Mã mẫu không có `.catch`, `loading` mãi là `true`.
- Sửa: thêm `.catch`, kiểm tra `res.ok` và hiển thị thông báo lỗi.

**Ghi chú:** `onAdded` và `useEffect([user])` có thể báo cảnh báo `react-hooks/exhaustive-deps` trong môi trường có linter; khi chạy qua CDN thì không hiển thị. Ngoài ra React 18 Strict Mode có thể chạy effect hai lần, nên cần `onAdded()` reset `newUser = null` để tránh thêm trùng.

## 5. Kiểm thử

- Tìm kiếm: gõ "Bret" → chỉ còn Leanne Graham; không phân biệt hoa thường.
- Thêm: nhập Name + Username → dòng mới xuất hiện ở cuối; để trống → báo alert.
- Sửa: bấm Sửa, đổi dữ liệu, Lưu → bảng cập nhật; Hủy → bảng giữ nguyên.
- Xóa: bấm Xóa → dòng biến mất ngay.
