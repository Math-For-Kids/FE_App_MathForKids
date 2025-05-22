// Hàm xử lý phép nhân từng bước giữa hai số nguyên n1 và n2
// Ghi dữ liệu hiển thị chi tiết vào steps[2], kết quả vào steps[3]
export const handleMultiplication = (n1, n2, steps, setRemember) => {
  // Chuyển hai số thành chuỗi để dễ thao tác từng chữ số
  const str1 = n1.toString();
  const str2 = n2.toString();
  // Đảo ngược chữ số để bắt đầu từ hàng đơn vị
  const digits1 = str1.split("").map(Number).reverse(); // Số bị nhân (multiplicand)
  const digits2 = str2.split("").map(Number).reverse(); // Số nhân (multiplier)
  let partials = []; // Mảng lưu từng kết quả tạm (từng dòng nhân)
  let carryRows = []; // Mảng lưu các dòng số nhớ
  let subTextLines = []; // Mảng lưu mô tả từng bước
  // Danh sách tên vị trí chữ số (units, tens, ...)
  const positionLabels = [
    "Units",
    "Tens",
    "Hundreds",
    "Thousands",
    "Ten Thousands",
    "Hundred Thousands",
    "Millions",
  ];
  // Lặp qua từng chữ số của số nhân (từng dòng nhân)
  digits2.forEach((d2, rowIndex) => {
    let carry = 0;
    let row = []; // Kết quả từng chữ số ở dòng này
    let carryRow = []; // Dòng ghi nhớ cho dòng hiện tại
    let lineExplain = []; // Mô tả chi tiết từng bước
    // Nhân từng chữ số của số bị nhân
    digits1.forEach((d1, colIndex) => {
      const product = d1 * d2 + carry; // Nhân và cộng số nhớ
      const digit = product % 10; // Lấy chữ số kết quả
      const nextCarry = Math.floor(product / 10); // Lấy số nhớ tiếp theo
      row.unshift(digit); // Thêm vào đầu mảng (để hiển thị từ trái sang phải)
      // Xử lý dòng số nhớ: nếu không phải số cuối thì hiển thị, ngược lại để trống
      const isLastDigit = colIndex === digits1.length - 1;
      carryRow.unshift(isLastDigit ? " " : nextCarry > 0 ? nextCarry : " ");
      // Mô tả chi tiết phép nhân tại ô này
      lineExplain.push(
        `Multiply ${d2} (${
          positionLabels[rowIndex] || `10^${rowIndex}`
        } of multiplier)` +
          ` × ${d1} (${
            positionLabels[colIndex] || `10^${colIndex}`
          } of multiplicand): ` +
          `${d2} × ${d1} + ${carry} = ${product} → write ${digit}` +
          (nextCarry > 0 ? `, carry ${nextCarry}` : "")
      );
      carry = nextCarry; // Cập nhật số nhớ cho bước tiếp theo
    });
    // Nếu còn số nhớ sau vòng lặp, thêm vào đầu dòng kết quả
    if (carry > 0) {
      row.unshift(carry);
      carryRow.unshift(" ");
    }
    // Làm cho carryRow có cùng độ dài với row bằng cách thêm dấu cách
    while (carryRow.length < row.length) {
      carryRow.unshift(" ");
    }
    // Thêm số 0 phía sau kết quả dòng (dịch phải theo rowIndex)
    const shiftZeros = Array(rowIndex).fill(0);
    const fullRow = row.concat(shiftZeros); // Dòng kết quả đầy đủ
    const fullCarryRow = carryRow.concat(Array(rowIndex).fill(" ")); // Dòng số nhớ đầy đủ
    partials.push(parseInt(fullRow.join(""))); // Thêm dòng kết quả tạm vào mảng
    carryRows.push(fullCarryRow); // Thêm dòng số nhớ tương ứng
    // Ghi lại mô tả bước nhân hiện tại
    subTextLines.push(
      `▶ Step ${rowIndex + 1}: Multiply the (${
        positionLabels[rowIndex] || `10^${rowIndex}`
      }) digit of the multiplier by the multiplicand in order from right to left.\n` +
        lineExplain.join("\n")
    );
  });
  // Tính kết quả cuối cùng bằng cách cộng tất cả các dòng nhân tạm
  const finalResult = partials.reduce((sum, val) => sum + val, 0);
  // Ghi dữ liệu cho bước hiển thị từng dòng (steps[2])
  steps[2].partials = partials.map((p) => p.toString()); // Các dòng nhân
  steps[2].digits = str1.split(""); // Các chữ số của số bị nhân
  steps[2].multiplierDigits = str2.split(""); // Các chữ số của số nhân
  steps[2].carryRows = carryRows; // Các dòng số nhớ
  steps[2].subText = subTextLines.join("\n\n"); // Mô tả tất cả các bước
  steps[2].subSteps = subTextLines; // Mảng mô tả từng bước
  // Ghi kết quả tổng hợp cuối cùng (steps[3])
  steps[3].result = finalResult.toString();
  steps[3].subText = `Add all partial rows together:\n${partials.join(
    " + "
  )} = ${finalResult}`;
  // Xóa trạng thái nhớ (nếu có)
  if (setRemember) setRemember("");
};
