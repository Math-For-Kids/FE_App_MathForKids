export const handleSubtraction = (n1, n2, steps, setRemember, t) => {
  const strA = n1
    .toString()
    .padStart(Math.max(n1.toString().length, n2.toString().length), "0");
  const strB = n2.toString().padStart(strA.length, "0");
  const digitsA = strA.split("").reverse();
  const digitsB = strB.split("").reverse();
  let resultDigits = [];
  let borrowFlags = [];
  let payBackFlags = [];
  let borrow = 0;
  let subSteps = [];

  const labelMap = [
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
  subSteps.push(t("subtraction.step_intro"));

  for (let i = 0; i < digitsA.length; i++) {
    const originalDigitA = parseInt(digitsA[i]);
    const digitB = parseInt(digitsB[i]);
    let adjustedA = originalDigitA - borrow;
    const payBack = borrow > 0;
    payBackFlags.push(payBack);
    let stepText = "";

    if (adjustedA < digitB) {
      adjustedA += 10;
      borrow = 1;
      borrowFlags.push(true);
      stepText = t("subtraction.step_borrow", {
        step: i + 1,
        label: labelMap[i] || `10^${i}`,
        a: originalDigitA,
        b: digitB,
        result: adjustedA - digitB,
      });
    } else {
      borrow = 0;
      borrowFlags.push(false);
      stepText = t("subtraction.step_normal", {
        step: i + 1,
        label: labelMap[i] || `10^${i}`,
        a: adjustedA,
        b: digitB,
        result: adjustedA - digitB,
      });
    }

    if (payBack) {
      stepText += " " + t("subtraction.step_payback");
    }

    resultDigits.push(adjustedA - digitB);
    subSteps.push(stepText);
  }

  const finalResult =
    resultDigits.slice().reverse().join("").replace(/^0+/, "") || "0";

  steps[2].digits1 = [...digitsA].reverse();
  steps[2].digits2 = [...digitsB].reverse();
  steps[2].resultDigits = [...resultDigits].reverse();
  steps[2].borrowFlags = [...borrowFlags].reverse();
  steps[2].payBackFlags = [...payBackFlags].reverse();
  steps[2].subText = subSteps.join("\n");
  steps[2].subSteps = subSteps;

  steps[3].result = finalResult;
  steps[3].subText = t("subtraction.final_result", {
    number1: n1,
    number2: n2,
    result: finalResult,
  });

  setRemember?.(
    borrowFlags.includes(true) ? t("subtraction.remember_borrowing") : ""
  );
};
