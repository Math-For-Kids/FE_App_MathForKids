// Hàm thực hiện phép trừ từng bước, lưu dữ liệu chi tiết vào steps[2], kết quả vào steps[3]
export const handleSubtraction = (n1, n2, steps, setRemember) => {
  // Nếu số bị trừ nhỏ hơn số trừ ⇒ không hỗ trợ kết quả âm
  if (n1 < n2) {
    steps[2] = {
      ...steps[2],
      subText: "Cannot subtract: the minuend is smaller than the subtrahend.", // Thông báo lỗi
      digits1: [],
      digits2: [],
      resultDigits: [],
      borrowFlags: [],
    };
    if (setRemember) setRemember(""); // Xóa ghi nhớ nếu có
    return; // Dừng xử lý
  }
  // Căn độ dài của 2 số (thêm 0 ở đầu nếu cần)
  const strA = n1
    .toString()
    .padStart(Math.max(n1.toString().length, n2.toString().length), "0");
  const strB = n2.toString().padStart(strA.length, "0");
  // Tách từng chữ số và đảo ngược để xử lý từ đơn vị
  const digitsA = strA.split("").reverse(); // Số bị trừ
  const digitsB = strB.split("").reverse(); // Số trừ
  let resultDigits = []; // Kết quả từng chữ số
  let borrowFlags = []; // Cờ đánh dấu đã mượn
  let payBackFlags = []; // Cờ đánh dấu đã trả 1 đơn vị mượn từ bước trước
  let borrow = 0; // Số mượn hiện tại
  let subSteps = []; // Mảng mô tả từng bước trừ
  // Danh sách vị trí tên gọi (đơn vị, chục, trăm,...)
  const labelMap = [
    "Units",
    "Tens",
    "Hundreds",
    "Thousands",
    "Ten thousands",
    "Millions",
    "Ten millions",
    "Hundred millions",
    "Billions",
  ];
  // Bắt đầu trừ từng cột từ phải sang trái
  for (let i = 0; i < digitsA.length; i++) {
    const originalDigitA = parseInt(digitsA[i]); // chữ số của số bị trừ
    const digitB = parseInt(digitsB[i]); // chữ số của số trừ
    let adjustedA = originalDigitA - borrow; // điều chỉnh A nếu có mượn
    const payBack = borrow > 0; // đánh dấu nếu đang phải trả mượn từ bước trước
    payBackFlags.push(payBack); // lưu trạng thái trả mượn
    let stepText = `Step ${i + 1}: Subtract ${
      labelMap[i] || `10^${i}`
    } digits: `;
    if (adjustedA < digitB) {
      // Nếu không đủ để trừ thì mượn 10
      adjustedA += 10;
      borrow = 1;
      borrowFlags.push(true); // Đánh dấu đã mượn
      stepText += `(${originalDigitA} + 10) - ${digitB} = ${
        adjustedA - digitB
      } (borrow 1)`;
    } else {
      // Không cần mượn
      borrow = 0;
      borrowFlags.push(false);
      stepText += `${adjustedA} - ${digitB} = ${adjustedA - digitB}`;
    }
    if (payBack) {
      stepText += `, (pay 1 back from previous borrow)`; // Ghi chú việc hoàn trả
    }
    resultDigits.push(adjustedA - digitB); // Lưu kết quả từng cột
    subSteps.push(stepText); // Lưu mô tả từng bước
  }
  // Tính kết quả cuối cùng và loại bỏ các số 0 ở đầu
  const finalResult =
    resultDigits.slice().reverse().join("").replace(/^0+/, "") || "0";
  // Ghi kết quả vào steps[2] để hiển thị từng dòng trên UI
  steps[2].digits1 = [...digitsA].reverse(); // Số bị trừ (A)
  steps[2].digits2 = [...digitsB].reverse(); // Số trừ (B)
  steps[2].resultDigits = [...resultDigits].reverse(); // Kết quả từng chữ số
  steps[2].borrowFlags = [...borrowFlags].reverse(); // Cờ mượn theo thứ tự hiển thị
  steps[2].payBackFlags = [...payBackFlags].reverse(); // Cờ trả mượn
  steps[2].subText = subSteps.join("\n"); // Chuỗi mô tả từng bước
  // Ghi kết quả tổng kết vào steps[3]
  steps[3].result = finalResult;
  steps[3].subText = `Final result: ${n1} - ${n2} = ${finalResult}`;
  // Ghi chú trạng thái mượn nếu có
  if (borrowFlags.includes(true)) {
    setRemember?.("Borrowing occurred"); // Dùng optional chaining để tránh lỗi
  } else {
    setRemember?.("");
  }
};
