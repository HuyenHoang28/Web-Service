const form = document.getElementById("registration-form");
const status = document.getElementById("registration-status");
form.addEventListener("submit", function (event) {
 event.preventDefault();
 status.hidden = false;
 status.textContent = "Thông tin hợp lệ. Đây là form minh họa; dữ liệu chưa được gửi hoặc lưu trên máy chủ.";
});
form.addEventListener("reset", function () {
 status.hidden = true;
 status.textContent = "";
});
document.getElementById("birthday").max = new Date().toLocaleDateString("en-CA");
