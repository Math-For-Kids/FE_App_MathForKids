// Hàm thực hiện phép cộng từng bước giống tiểu học, lưu dữ liệu vào steps[2] và steps[3]
export const handleAddition = (n1, n2, steps, setRemember) => {
  // Lấy độ dài lớn nhất giữa hai số
  const maxLength = Math.max(n1.toString().length, n2.toString().length);
  // Chuyển 2 số thành chuỗi và thêm số 0 ở đầu nếu cần để bằng độ dài
  const str1 = n1.toString().padStart(maxLength, "0");
  const str2 = n2.toString().padStart(maxLength, "0");
  // Tách các chữ số và đảo ngược để cộng từ phải sang trái
  const digits1 = str1.split("").reverse();
  const digits2 = str2.split("").reverse();
  const resultDigits = []; // Mảng lưu chữ số kết quả từng cột
  const carryDigits = []; // Mảng lưu số nhớ tại mỗi cột
  const subSteps = []; // Mảng mô tả từng bước
  let carry = 0; // Số nhớ ban đầu
  // Tên gọi vị trí các chữ số (hàng đơn vị, chục, trăm,...)
  const labelMap = [
    "Units",
    "Tens",
    "Hundreds",
    "Thousands",
    "Ten thousands",
    "Hundred thousands",
    "Millions",
    "Ten millions",
    "Hundred millions",
    "Billions",
  ];
  // Thực hiện cộng từng cột từ phải sang trái
  for (let i = 0; i < digits1.length; i++) {
    const d1 = parseInt(digits1[i]);
    const d2 = parseInt(digits2[i]);
    const sum = d1 + d2 + carry; // Tổng = chữ số 1 + chữ số 2 + số nhớ
    const resultDigit = sum % 10; // Lấy chữ số hàng đơn vị
    const carryOut = Math.floor(sum / 10); // Lấy số nhớ (hàng chục trở lên)
    carryDigits.push(carry); // Lưu số nhớ trước khi cộng
    resultDigits.push(resultDigit); // Lưu chữ số kết quả
    // Mô tả bước cộng hiện tại
    const label = labelMap[i] || `10^${i}`;
    subSteps.push(
      `Step ${i + 1}: Add ${label} digits: ${d1} + ${d2}` +
        (carry > 0 ? ` + ${carry} (carry)` : "") +
        ` = ${sum}, write ${resultDigit}` +
        (carryOut > 0 ? `, carry ${carryOut}.` : ".")
    );
    carry = carryOut; // Cập nhật số nhớ cho bước sau
  }
  // Nếu còn dư số nhớ sau bước cuối thì thêm vào kết quả
  if (carry > 0) {
    resultDigits.push(carry);
    carryDigits.push(0); // Vị trí này không có số nhớ mới nên ghi 0
  }
  // Đảo ngược mảng kết quả để hiển thị từ trái sang phải
  const finalDigits = [...resultDigits].reverse();
  const padLength = finalDigits.length;
  // Hàm phụ trợ: thêm số 0 vào đầu mảng để đủ độ dài padLength
  const padArrayStart = (arr, len) =>
    Array(len - arr.length)
      .fill(0)
      .concat(arr);
  // Ghi dữ liệu vào steps[2] để hiển thị các dòng trên UI
  steps[2].digits1 = padArrayStart([...digits1].reverse(), padLength); // Số thứ nhất
  steps[2].digits2 = padArrayStart([...digits2].reverse(), padLength); // Số thứ hai
  steps[2].carryDigits = padArrayStart([...carryDigits].reverse(), padLength); // Số nhớ
  steps[2].digitSums = finalDigits; // Các chữ số kết quả
  steps[2].result = finalDigits.join("").replace(/^0+/, "") || "0"; // Chuỗi kết quả (loại bỏ 0 ở đầu)
  steps[2].subText = subSteps.join("\n"); // Chuỗi mô tả các bước
  // Ghi kết quả tổng kết vào bước 3
  steps[3].result = (n1 + n2).toString();
  steps[3].subText = `Final result: ${n1} + ${n2} = ${steps[3].result}`;
  // Nếu có hàm setRemember thì truyền vào số nhớ cuối cùng (nếu có)
  if (setRemember) {
    setRemember(carry > 0 ? carry.toString() : "");
  }
};
