export const handleAddition = (n1, n2, steps, setRemember) => {
  const maxLength = Math.max(n1.toString().length, n2.toString().length);
  const str1 = n1.toString().padStart(maxLength, "0");
  const str2 = n2.toString().padStart(maxLength, "0");

  const digits1 = str1.split("").reverse();
  const digits2 = str2.split("").reverse();
  const resultDigits = [];
  const carryDigits = [];
  const subSteps = [];
  let carry = 0;

  const labelMap = [
    "Units", "Tens", "Hundreds", "Thousands", "Ten thousands",
    "Hundred thousands", "Millions", "Ten millions", "Hundred millions", "Billions",
  ];

  for (let i = 0; i < digits1.length; i++) {
    const d1 = parseInt(digits1[i]);
    const d2 = parseInt(digits2[i]);
    const sum = d1 + d2 + carry;
    const resultDigit = sum % 10;
    const carryOut = Math.floor(sum / 10);

    carryDigits.push(carry);
    resultDigits.push(resultDigit);

    const label = labelMap[i] || `10^${i}`;
    subSteps.push(
      `Step ${i + 1}: Add ${label} digits: ${d1} + ${d2}` +
      (carry > 0 ? ` + ${carry} (carry)` : "") +
      ` = ${sum}, write ${resultDigit}` +
      (carryOut > 0 ? `, carry ${carryOut}.` : ".")
    );

    carry = carryOut;
  }

  if (carry > 0) {
    resultDigits.push(carry);
    carryDigits.push(0);
  }

  const finalDigits = [...resultDigits].reverse();
  const padLength = finalDigits.length;

  const padArrayStart = (arr, len) =>
    Array(len - arr.length).fill("").concat(arr);

  steps[2].digits1 = padArrayStart([...digits1].reverse(), padLength);
  steps[2].digits2 = padArrayStart([...digits2].reverse(), padLength);
  steps[2].carryDigits = padArrayStart([...carryDigits].reverse(), padLength);
  steps[2].digitSums = finalDigits;
  steps[2].result = finalDigits.join("").replace(/^0+/, "") || "0";
  steps[2].subText = subSteps;

  steps[3].result = (n1 + n2).toString();
  steps[3].subText = `Final result: ${n1} + ${n2} = ${steps[3].result}`;

  if (setRemember) {
    setRemember(carry > 0 ? carry.toString() : "");
  }
};
