export const handleDivision = (n1, n2, steps, setRemember, t) => {
  if (n2 === 0) {
    steps[3].result = "Cannot divide";
    steps[2].subText = "Cannot divide by 0.";
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
  let firstDividendLength = 0;

  let stepCounter = 1;
  let divisionCount = 0;

  const adjustIndent = (baseIndent) => {
    if (firstDividendLength === 1) return baseIndent - 1;
    if (firstDividendLength === 3) return baseIndent + 1;
    return baseIndent;
  };

  for (let i = 0; i < dividend.length; i++) {
    current = current * 10 + dividend[i];

    if (!started) {
      if (current < absN2) {
        subSteps.push({
          key: "step_choose_number",
          params: {
            step: stepCounter++,
            current,
            divisor: absN2,
            comparisonKey: "less",
            explanationKey: "less",
            indent: divisionCount,
            visualIndent: divisionCount,
          },
        });

        if (i + 1 < dividend.length) {
          subSteps.push({
            key: "step_bring_down",
            params: {
              step: stepCounter++,
              nextDigit: dividend[i + 1],
              afterBringDown: current.toString() + dividend[i + 1].toString(),
              indent: divisionCount,
              visualIndent: divisionCount,
            },
          });
        }
        continue;
      } else {
        firstDividendLength = current.toString().length;
        subSteps.push({
          key: "step_choose_number",
          params: {
            step: stepCounter++,
            current,
            divisor: absN2,
            comparisonKey: "greater_equal",
            explanationKey: "greater_equal",
            indent: divisionCount,
            visualIndent: adjustIndent(divisionCount),
          },
        });
        started = true;
      }
    }

    const qDigit = Math.floor(current / absN2);
    const sub = qDigit * absN2;
    const remainder = current - sub;

    subSteps.push({
      key: "step_divide",
      params: {
        step: stepCounter++,
        current,
        divisor: absN2,
        result: qDigit,
        indent: divisionCount,
        visualIndent: adjustIndent(divisionCount),
      },
    });

    const productLength = sub.toString().length;
    let productIndent;

    if (
      divisionCount === 0 &&
      firstDividendLength === 3 &&
      productLength === 3
    ) {
      productIndent = divisionCount - 1;
    } else if (
      divisionCount === 1 &&
      firstDividendLength === 3 &&
      productLength === 3
    ) {
      productIndent = divisionCount - 1;
    } else if (
      divisionCount === 1 &&
      firstDividendLength === 2 &&
      productLength === 3
    ) {
      productIndent = divisionCount - 1;
    } else if (
      divisionCount === 3 &&
      firstDividendLength === 2 &&
      productLength === 2
    ) {
      productIndent = divisionCount;
    } else if (
      (productLength === 3 &&
        divisionCount === 3 &&
        firstDividendLength === 2) ||
      (productLength === 3 && divisionCount === 2)
    ) {
      productIndent = divisionCount - 1;
    } else if (productLength === 2 && divisionCount === 3) {
      productIndent = divisionCount + 1;
    } else if (productLength === 1) {
      productIndent = divisionCount + 1;
    } else {
      productIndent = divisionCount;
    }

    subSteps.push({
      key: "step_multiply",
      params: {
        step: stepCounter++,
        result: qDigit,
        divisor: absN2,
        product: sub,
        indent: productIndent,
        visualIndent: adjustIndent(productIndent),
      },
    });

    const remainderLength = remainder.toString().length;
    const remainderIndent =
      remainderLength === 1 ? divisionCount + 1 : divisionCount;

    subSteps.push({
      key: "step_subtract",
      params: {
        step: stepCounter++,
        current,
        product: sub,
        remainder,
        indent: remainderIndent,
        visualIndent: adjustIndent(remainderIndent),
      },
    });

    // ✅ Hạ số sau khi trừ (ngoài if (!started))
    if (i + 1 < dividend.length) {
      const nextDigit = dividend[i + 1];
      const afterBringDown = remainder.toString() + nextDigit.toString();

      const bringDownIndent =
        remainder.toString().length === 1 ? divisionCount + 1 : divisionCount;

      subSteps.push({
        key: "step_bring_down",
        params: {
          step: stepCounter++,
          nextDigit,
          remainder,
          afterBringDown,
          indent: bringDownIndent,
          visualIndent: adjustIndent(bringDownIndent),
          explanationKey: "after_subtract", // để hiển thị lời giải thích riêng
        },
      });

      const newCurrent = parseInt(afterBringDown, 10);
      if (newCurrent < absN2 && i + 2 < dividend.length) {
        subSteps.push({
          key: "step_choose_number",
          params: {
            step: stepCounter++,
            current: newCurrent,
            divisor: absN2,
            comparisonKey: "less",
            explanationKey: "less",
            indent: bringDownIndent,
            visualIndent: adjustIndent(bringDownIndent),
          },
        });
      }
    }

    stepsDisplay.push({
      part: current.toString(),
      minus: sub.toString(),
      remainder: remainder.toString(),
      quotientDigit: qDigit.toString(),
      position: i,
      indent: divisionCount,
      drawLine: true,
      broughtDown: dividend[i + 1]?.toString(),
      afterBringDown:
        i + 1 < dividend.length
          ? remainder.toString() + dividend[i + 1].toString()
          : undefined,
    });

    current = remainder;
    quotient += qDigit.toString();
    divisionCount++;
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

    subSteps.push({
      key: "step_cannot_divide",
      params: {
        step: 1,
        dividend: absN1,
        divisor: absN2,
        indent: 0,
        visualIndent: 0,
      },
    });

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
  steps[2].subText = "Step-by-step division (long division)";
  steps[3].result = `${finalQuotient} dư ${remainder}`;
  steps[3].result = t("result_with_remainder", {
    quotient: finalQuotient,
    remainder: remainder,
  });

  setRemember(remainder > 0 ? `Remainder ${remainder}` : "");
};
