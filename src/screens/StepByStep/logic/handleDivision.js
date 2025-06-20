export const handleDivision = (n1, n2, steps, setRemember) => {
  if (n2 === 0) {
    steps[3].result = "Không chia được";
    steps[2].subText = "Không thể chia cho 0.";
    return;
  }

  const sign = Math.sign(n1) * Math.sign(n2);
  const absN1 = Math.abs(n1);
  const absN2 = Math.abs(n2);

  const dividendStr = absN1.toString();
  const dividend = dividendStr.split("").map(Number);
  let current = 0;
  let quotient = "";
  let stepsDisplay = [];
  let subSteps = [];
  let started = false;

  for (let i = 0; i < dividend.length; i++) {
    current = current * 10 + dividend[i];

    if (!started && current < absN2) {
      quotient += "0";

      if (i + 1 < dividend.length) {
        const afterBringDown = current.toString() + dividend[i + 1].toString();

        subSteps.push(
          `Bước ${i + 1}: ${current} nhỏ hơn ${absN2}, không chia được. `
          + `Hạ ${dividend[i + 1]} xuống tạo thành ${afterBringDown}.`
        );

        stepsDisplay.push({
          part: current.toString(),
          minus: "",
          remainder: current.toString(),
          quotientDigit: "0",
          position: i,
          indent: i,
          drawLine: false,
          broughtDown: dividend[i + 1].toString(),
          afterBringDown,
        });
      } else {
        subSteps.push(
          `Bước ${i + 1}: ${current} nhỏ hơn ${absN2}, không chia được. Viết 0 vào thương.`
        );

        stepsDisplay.push({
          part: current.toString(),
          partDigits: current.toString().split(""), // thêm dòng này
          minus: "",
          remainder: current.toString(),
          quotientDigit: "0",
          position: i,
          indent: i,
          drawLine: false,
        });
      }

      continue;
    }

    if (!started) started = true;

    const qDigit = Math.floor(current / absN2);
    const sub = qDigit * absN2;
    const remainder = current - sub;

    const step = {
      part: current.toString(),
      minus: sub.toString(),
      remainder: remainder.toString(),
      quotientDigit: qDigit.toString(),
      position: i,
      indent: i,
      drawLine: true,
    };

    if (i + 1 < dividend.length) {
      step.broughtDown = dividend[i + 1].toString();
      step.afterBringDown = remainder.toString() + dividend[i + 1].toString();
    }

    stepsDisplay.push(step);
    subSteps.push(
      `Bước ${i + 1}: Lấy ${current} chia ${absN2} được ${qDigit}, viết ${qDigit} vào thương. `
      + `${qDigit} × ${absN2} = ${sub}, trừ ra ${current} - ${sub} = ${remainder}.`
    );

    current = remainder;
    quotient += qDigit.toString();
  }

  if (!started) {
    stepsDisplay.push({
      part: absN1.toString(),
      minus: "0",
      remainder: absN1.toString(),
      quotientDigit: "0",
      position: 0,
      indent: 0,
      drawLine: false,
    });
    subSteps.push(`Bước 1: ${absN1} nhỏ hơn ${absN2}, không chia được, viết 0.`);
    quotient = "0";
  }

  const remainder = current;
  const cleanedQuotient = quotient.replace(/^0+/, "") || "0";
  const finalQuotient = sign < 0 ? `-${cleanedQuotient}` : cleanedQuotient;

  steps[2].dividend = absN1.toString();
  steps[2].divisor = absN2.toString();
  steps[2].quotient = finalQuotient;
  steps[2].remainder = remainder.toString();
  steps[2].divisionSteps = stepsDisplay;
  steps[2].subSteps = subSteps;
  steps[2].subText = "Chia theo từng bước (chia cột)";
  steps[3].result = `${finalQuotient} dư ${remainder}`;
  steps[3].subText = `Kết quả cuối cùng là: ${finalQuotient} dư ${remainder}`;

  setRemember(remainder > 0 ? `Dư ${remainder}` : "");
};
