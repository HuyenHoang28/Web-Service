/* BÀI B — VIẾT CODE: Lọc tin và đăng tin nhanh (news.html)
   Viết code theo đặc tả.
   Không sửa news.html, không sửa css; chỉ viết JavaScript trong file này. */

// ---------- ĐÃ CHO SẴN (không sửa) ----------
// Chặn việc gửi form tìm kiếm khi nhấn Enter, để trang không bị tải lại.
document.querySelector("#searchbar form").addEventListener("submit", (e) => e.preventDefault());

// ---------- PHẦN BẠN VIẾT ----------

const oTimKiem = document.getElementById("o-tim-kiem");
const dsTin = document.getElementById("list");
const boDem = document.getElementById("bo-dem");
const thongBaoKhongThay = document.getElementById("khong-thay");
const oTieuDe = document.getElementById("tin-tieu-de");
const oNoiDung = document.getElementById("tin-noi-dung");
const nutDang = document.getElementById("nut-dang");
const baoLoi = document.getElementById("bao-loi");

// F1–F3. Lọc theo tiêu đề và nội dung, rồi cập nhật bộ đếm và thông báo.
function capNhatLocTin() {
	const tuKhoa = oTimKiem.value;
	const tuKhoaThuong = tuKhoa.toLowerCase();
	const cacTin = dsTin.querySelectorAll("li");
	let soTinHien = 0;

	for (const tin of cacTin) {
		const vanBan = `${tin.querySelector("h3").textContent} ${tin.querySelector("p").textContent}`;
		const khop = tuKhoaThuong === "" || vanBan.toLowerCase().includes(tuKhoaThuong);
		tin.classList.toggle("an", !khop);
		if (khop) {
			soTinHien += 1;
		}
	}

	boDem.textContent = `Đang hiển thị ${soTinHien}/${cacTin.length} tin`;
	if (tuKhoaThuong !== "" && soTinHien === 0) {
		thongBaoKhongThay.textContent = `Không tìm thấy tin nào cho "${tuKhoa}"`;
		thongBaoKhongThay.classList.remove("an");
	} else {
		thongBaoKhongThay.textContent = "";
		thongBaoKhongThay.classList.add("an");
	}
}

oTimKiem.addEventListener("keyup", capNhatLocTin);
capNhatLocTin();

// F4. Một listener ủy quyền trên #list hỗ trợ cả các tin được thêm sau này.
dsTin.addEventListener("click", (e) => {
	const nut = e.target.closest("button.more");
	if (!nut || !dsTin.contains(nut)) {
		return;
	}

	const tin = nut.closest("li");
	const doan = tin && tin.querySelector("p");
	if (!doan) {
		return;
	}

	const dangMo = doan.classList.toggle("day-du");
	nut.textContent = dangMo ? "Thu gọn <<" : "Read more >>";
});

// F5. Tạo nội dung mới bằng textContent để không diễn giải HTML do người dùng nhập.
nutDang.addEventListener("click", () => {
	const tieuDe = oTieuDe.value;
	const noiDung = oNoiDung.value;

	if (tieuDe === "" || noiDung === "") {
		baoLoi.textContent = "Vui lòng nhập đủ tiêu đề và nội dung.";
		return;
	}

	const tinMoi = document.createElement("li");
	const ngayDang = document.createElement("span");
	ngayDang.className = "time";
	ngayDang.textContent = homNay();

	const tieuDeMoi = document.createElement("h3");
	tieuDeMoi.textContent = tieuDe;

	const noiDungMoi = document.createElement("p");
	noiDungMoi.textContent = noiDung;

	const nutDocThem = document.createElement("button");
	nutDocThem.type = "button";
	nutDocThem.className = "more";
	nutDocThem.textContent = "Read more >>";

	tinMoi.append(ngayDang, tieuDeMoi, noiDungMoi, nutDocThem);
	dsTin.prepend(tinMoi);

	oTieuDe.value = "";
	oNoiDung.value = "";
	baoLoi.textContent = "";
	capNhatLocTin();
});
