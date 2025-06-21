// Hàm xử lý phép nhân từng bước giữa hai số nguyên n1 và n2
// Ghi dữ liệu hiển thị chi tiết vào steps[2], kết quả vào steps[3]
export const handleMultiplication = (n1, n2, steps, setRemember, t) => {
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
    t("place.units"),
    t("place.tens"),
    t("place.hundreds"),
    t("place.thousands"),
    t("place.ten_thousands"),
    t("place.hundred_thousands"),
    t("place.millions"),
    t("place.ten_millions"),
    t("place.hundred_millions"),
    t("place.billions"),
  ];
  // Lặp qua từng chữ số của số nhân (từng dòng nhân)
  digits2.forEach((d2, rowIndex) => {
    let carry = 0;
    let row = [];
    let carryRow = [];
    let lineExplain = [];

    const isSingleDigitBoth = digits1.length === 1 && digits2.length === 1;

    digits1.forEach((d1, colIndex) => {
      const product = d1 * d2 + carry;
      const digit = product % 10;
      const nextCarry = Math.floor(product / 10);

      row.unshift(digit); //vẫn luôn ghi chữ số vào dòng kết quả
      const isLastDigit = colIndex === digits1.length - 1;
      carryRow.unshift(isLastDigit ? " " : nextCarry > 0 ? nextCarry : " ");

      const isZeroMultiplication = d1 === 0 || d2 === 0;
      const shouldSkipExplain = isSingleDigitBoth && isZeroMultiplication;

      if (!shouldSkipExplain) {
        lineExplain.push(
          t("multiplication.step_detail", {
            rowLabel: positionLabels[rowIndex] || `10^${rowIndex}`,
            colLabel: positionLabels[colIndex] || `10^${colIndex}`,
            d2,
            d1,
            carry,
            product,
            digit,
            nextCarry,
          })
        );
      }

      carry = nextCarry;
    });

    if (carry > 0) {
      row.unshift(carry);
      carryRow.unshift(" ");
    }

    while (carryRow.length < row.length) {
      carryRow.unshift(" ");
    }

    const shiftZeros = Array(rowIndex).fill(0);
    const fullRow = row.concat(shiftZeros);
    const fullCarryRow = carryRow.concat(Array(rowIndex).fill(" "));

    partials.push(fullRow.map(String).join(""));

    carryRows.push(fullCarryRow);

    subTextLines.push(
      t("multiplication.step_intro", {
        step: rowIndex + 1,
        label: positionLabels[rowIndex] || `10^${rowIndex}`,
      })
    );

    if (rowIndex + 1 >= 2) {
      subTextLines.push(t("multiplication.step_zero_rule"));
    }

    // Ghi từng phép nhân chi tiết (nếu còn lại)
    subTextLines.push(...lineExplain);
  });

  // Tính kết quả cuối cùng bằng cách cộng tất cả các dòng nhân tạm
  // CỘNG THEO TỪNG CỘT (vertical addition)
  let summaryLines = [];
  const finalResult = partials.reduce((sum, val) => sum + parseInt(val), 0);

  if (partials.length >= 2) {
    const maxLen = Math.max(...partials.map((p) => p.length));
    const paddedPartials = partials.map((p) =>
      p.padStart(maxLen, "0").split("").map(Number)
    );

    let carry = 0;
    const columnLabels = positionLabels;
    const verticalSteps = [];

    for (let col = maxLen - 1; col >= 0; col--) {
      const columnDigits = paddedPartials.map((row) => row[col]);
      const columnSum = columnDigits.reduce((a, b) => a + b, 0) + carry;
      const digit = columnSum % 10;
      const nextCarry = Math.floor(columnSum / 10);

      const placeName =
        columnLabels[maxLen - 1 - col] || `10^${maxLen - 1 - col}`;
      verticalSteps.push(
        t("multiplication.step_add_column", {
          label: placeName,
          digits: columnDigits.join(" + "),
          carry,
          sum: columnSum,
          digit,
          nextCarry,
        })
      );
      carry = nextCarry;
    }

    if (carry > 0) {
      verticalSteps.push(t("multiplication.step_final_carry", { carry }));
    }

    summaryLines.push(t("multiplication.step_final_title"));
    verticalSteps.slice(1).forEach((line) => summaryLines.push(line));

    summaryLines.push(
      t("multiplication.final_result", {
        expression: partials.join(" + "),
        result: finalResult,
      })
    );
  } else {
    summaryLines = [
      t("multiplication.final_result", {
        expression: partials[0],
        result: partials[0],
      }),
    ];
  }

  // Ghi dữ liệu cho bước hiển thị từng dòng (steps[2])
  steps[2].partials = partials.map((p) => p.toString()); // Các dòng nhân
  steps[2].digits = str1.split(""); // Các chữ số của số bị nhân
  steps[2].multiplierDigits = str2.split(""); // Các chữ số của số nhân
  steps[2].carryRows = carryRows; // Các dòng số nhớ
  steps[2].subText = subTextLines.join("\n\n"); // Mô tả tất cả các bước
  steps[2].subSteps = [...subTextLines, ...summaryLines]; // Mảng mô tả từng bước
  // Ghi kết quả tổng hợp cuối cùng (steps[3])
  steps[3].result = finalResult.toString();
  steps[3].subText = t("multiplication.summary", {
    partials: partials
      .map((p, i) => `${t("multiplication.partial")} ${i + 1}: ${p}`)
      .join("\n"),
    expression: partials.join(" + "),
    result: finalResult,
  });
  const finalResultDigits = finalResult.toString().length;
  const fullPositionLabels = Array.from({ length: finalResultDigits }).map(
    (_, i) =>
      positionLabels[finalResultDigits - 1 - i] ||
      `10^${finalResultDigits - 1 - i}`
  );
  steps[2].positionLabels = fullPositionLabels;

  // Xóa trạng thái nhớ (nếu có)
  if (setRemember) setRemember("");
};
