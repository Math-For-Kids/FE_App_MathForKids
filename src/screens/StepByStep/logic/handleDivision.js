export const handleDivision = (n1, n2, steps, setRemember) => {
  if (n2 === 0) {
    steps[3].result = "Không chia được";
    steps[2].subText = "Không thể chia cho 0.";
    return;
  }

  const dividendStr = n1.toString();
  const dividend = dividendStr.split("").map(Number);
  let current = 0;
  let quotient = "";
  let stepsDisplay = [];

  let started = false;

  for (let i = 0; i < dividend.length; i++) {
    current = current * 10 + dividend[i];

    if (!started) {
      if (current < n2) {
        quotient += "0"; // có thể ẩn nếu muốn
        continue;
      } else {
        started = true;
      }
    }

    const qDigit = Math.floor(current / n2);
    const sub = qDigit * n2;
    const remainder = current - sub;

    stepsDisplay.push({
      part: current.toString(),
      minus: sub.toString(),
      remainder: remainder.toString(),
      position: i,
    });

    quotient += qDigit.toString();
    current = remainder;
  }

  if (current !== 0) {
    stepsDisplay.push({
      part: current.toString(),
      minus: "0",
      remainder: current.toString(),
      position: dividend.length - 1,
    });
  }

  const remainder = current;
  const cleanedQuotient = quotient.replace(/^0+/, "") || "0";

  steps[2].divisionSteps = stepsDisplay;
  steps[2].quotient = cleanedQuotient;
  steps[2].dividend = dividendStr;
  steps[2].divisor = n2.toString();
  steps[2].remainder = remainder.toString();
  steps[2].subText = "Chia theo từng bước (chia cột)";
  steps[3].result = `${cleanedQuotient} dư ${remainder}`;
  steps[3].subText = `Kết quả cuối cùng là: ${cleanedQuotient} dư ${remainder}`;

  setRemember(remainder > 0 ? `Dư ${remainder}` : "");
};
