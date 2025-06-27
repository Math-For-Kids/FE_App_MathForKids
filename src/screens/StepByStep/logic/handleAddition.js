export const handleAddition = (n1, n2, steps, setRemember, t) => {
  const maxLength = Math.max(n1.toString().length, n2.toString().length);
  const str1 = n1.toString().padStart(maxLength, "0");
  const str2 = n2.toString().padStart(maxLength, "0");
  const digits1 = str1.split("").reverse();
  const digits2 = str2.split("").reverse();
  const resultDigits = [];
  const carryDigits = [];
  const subSteps = [t("addition.step_intro")];
  let carry = 0;

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

  for (let i = 0; i < digits1.length; i++) {
    const d1 = parseInt(digits1[i]);
    const d2 = parseInt(digits2[i]);
    const sum = d1 + d2 + carry;
    let resultDigit = sum % 10;
    let carryOut = Math.floor(sum / 10);

    // if (i === digits1.length - 1 && carryOut > 0) {
    //   resultDigit = sum; // hiển thị toàn bộ
    //   carryOut = 0;
    // }

    carryDigits.push(carry);
    resultDigits.push(resultDigit);

    const label = labelMap[i] || `10^${i}`;
    subSteps.push(
      t("addition.step_normal", {
        step: i + 1,
        label,
        d1,
        d2,
        carryStr: carry > 0 ? ` + ${carry}` : "",
        sum,
        resultDigit,
        carryOutStr: carryOut > 0 ? `, nhớ ${carryOut}` : "",
      })
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
    Array(len - arr.length)
      .fill("")
      .concat(arr);

  steps[2].digits1 = padArrayStart([...digits1].reverse(), padLength);
  steps[2].digits2 = padArrayStart([...digits2].reverse(), padLength);
  steps[2].carryDigits = padArrayStart([...carryDigits].reverse(), padLength);
  steps[2].digitSums = finalDigits;
  steps[2].result = finalDigits.join("").replace(/^0+/, "") || "0";
  steps[2].subText = subSteps;
  steps[3].result = (n1 + n2).toString();
  steps[3].subText = t("addition.final_result", {
    num1: n1,
    num2: n2,
    result: steps[3].result,
  });

  if (setRemember) {
    setRemember(carry > 0 ? carry.toString() : "");
  }
};
