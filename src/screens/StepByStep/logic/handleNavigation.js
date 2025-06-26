// handleNavigation.js
import { handleStepZero } from "./handleStepZero";
import * as Speech from "expo-speech";
function padLeft(arr, targetLength, padChar = " ") {
  const safeTargetLength =
    typeof targetLength === "number" && targetLength >= 0
      ? targetLength
      : arr.length;
  const padLength = Math.max(0, safeTargetLength - arr.length);
  const padding = Array(padLength).fill(padChar);
  return [...padding, ...arr];
}

export const handleNext = ({
  stepIndex,
  setStepIndex,
  subStepIndex,
  setSubStepIndex,
  setRevealedResultDigits,
  setRevealedDigits,
  setSteps,
  setCurrentRowIndex,
  currentRowIndex,
  steps,
  number1,
  number2,
  operator,
  t,
  setRemember,
  revealedResultDigits,
  visibleDigitsMap,
  setVisibleDigitsMap,
  setVisibleCarryMap,
  visibleCarryMap,
}) => {
  Speech.stop();

  // console.log("[handleNext] stepIndex:", stepIndex);
  // console.log("[handleNext] currentRowIndex:", currentRowIndex);
  // console.log("[handleNext] subStepIndex:", subStepIndex);
  const step = steps[stepIndex];
  if (stepIndex === 0) {
    handleStepZero({
      number1,
      number2,
      operator,
      steps,
      setRemember,
      setStepIndex,
      setSteps,
      stepIndex,
      t,
    });
    return;
  }

  // PHÉP TRỪ
  // Nếu đang thực hiện phép trừ (operator === '-') và đang ở bước giải thích từng cột (stepIndex === 2)
  if (operator === "-" && stepIndex === 2) {
    const subSteps = step.subSteps || []; // Danh sách các câu giải thích
    const nextSubStepIndex = subStepIndex + 1;
    // Nếu còn bước giải thích chưa hiển thị
    if (nextSubStepIndex < subSteps.length) {
      setSubStepIndex(nextSubStepIndex);
      // Nếu dòng hiện tại là phép trừ (có dấu =) → tăng số chữ số kết quả đã lộ
      const currentText = subSteps[nextSubStepIndex];
      const isResultLine = currentText?.includes("="); // Dòng giải thích phép trừ
      if (isResultLine) {
        setRevealedResultDigits((prev) => prev + 1);
      }
    } else {
      //Nếu đã hiện hết subSteps → chuyển sang bước tiếp theo (kết luận)
      setStepIndex((prev) => prev + 1);
      setSubStepIndex(0);
    }
    return;
  }

  // Phép nhân
  if (operator === "×" && stepIndex === 2) {
    const subSteps = Array.isArray(step.subSteps) ? step.subSteps : [];
    const subStepsMeta = Array.isArray(step.subStepsMeta)
      ? step.subStepsMeta
      : [];
    const nextSubStepIndex = subStepIndex + 1;
    const nextMeta = subStepsMeta[nextSubStepIndex];

    if (nextSubStepIndex >= subSteps.length) {
      setStepIndex((prev) => prev + 1);
      setSubStepIndex(0);
      return;
    }

    setSubStepIndex(nextSubStepIndex);

    switch (nextMeta?.type) {
      case "intro":
      case "row_intro":
        setCurrentRowIndex(nextMeta.rowIndex);
        setRevealedDigits(-1);
        break;

      case "detail": {
        const sum = nextMeta.product + (nextMeta.carry || 0);
        const sumStr = sum.toString();
        const digit = sumStr[sumStr.length - 1];
        const { rowIndex, colIndex } = nextMeta;
        const shift = rowIndex;
        const updateIdx =
          steps[2].partials[rowIndex].length - 1 - (colIndex + shift);

        const updatedSteps = [...steps];
        const partial = updatedSteps[2].partials[rowIndex].split("");
        if (updateIdx >= 0) {
          partial[updateIdx] = digit;
          updatedSteps[2].partials[rowIndex] = partial.join("");
          setSteps(updatedSteps);
        }

        setRevealedDigits((prev) => prev + 1);

        // const carryKey = `carry_${rowIndex}`;
        // const carryRows = steps?.[2]?.carryRows ?? [];
        // const maxLen = steps?.[2]?.maxLen ?? 0;

        // const rawCarryRow = carryRows[rowIndex] ?? [];
        // const carryArray =
        //   typeof rawCarryRow === "string"
        //     ? rawCarryRow.split("")
        //     : [...rawCarryRow];

        // const padded = padLeft(carryArray, maxLen);

        // // 👉 Tính chỉ số cần hé lộ
        // let targetIdx;
        // const targetColFromRight = colIndex + 1;
        // if (rowIndex === 0) {
        //   targetIdx = padded.length - targetColFromRight; // luôn là cuối nếu dòng đầu
        // } else {
        //   const targetColFromRight = colIndex + 1;
        //   targetIdx = padded.length - 1 - targetColFromRight;
        // }

        // const currentReveal = visibleCarryMap[carryKey] ?? 0;
        // const maxReveal = padded.length - targetIdx;

        // const shouldReveal =
        //   targetIdx >= 0 &&
        //   padded[targetIdx] &&
        //   padded[targetIdx].trim() !== "";

        // const newRevealCount =
        //   shouldReveal && currentReveal < maxReveal
        //     ? currentReveal + 1
        //     : currentReveal;

        // setVisibleCarryMap((prev) => ({
        //   ...prev,
        //   [carryKey]: newRevealCount,
        // }));

        // console.log(
        //   `[DETAIL] reveal carry one-by-one → row=${rowIndex}, col=${colIndex}, targetIdx=${targetIdx}, padded=${padded.join(
        //     ""
        //   )}, revealCount=${newRevealCount}`
        // );

        break;
      }

      case "detail_final_digit": {
        const digitsToReveal = String(nextMeta.product).length;
        setRevealedDigits((prev) => prev + digitsToReveal);
        break;
      }

      case "carry_add": {
        const updatedSteps = [...steps];
        const { rowIndex, colIndex, carry, sum, product } = nextMeta;
        const partial = updatedSteps[2].partials[rowIndex];
        const chars = partial.split("");
        const shift = rowIndex;
        const idxFromRight = colIndex + shift;
        const updateIdx = chars.length - 1 - idxFromRight;

        const isFinalCarryAdd =
          typeof sum === "number" && typeof product === "number";

        if (isFinalCarryAdd) {
          const sumStr = String(sum);
          let newStartIdx = updateIdx - (sumStr.length - 1);
          while (newStartIdx < 0) {
            chars.unshift(" ");
            newStartIdx++;
          }
          for (let i = 0; i < sumStr.length; i++) {
            chars[newStartIdx + i] = sumStr[i];
          }

          // ❌ Không cập nhật visibleDigitsMap ở đây!
        } else {
          const original = parseInt(chars[updateIdx] || "0", 10);
          const result = original + (carry || 0);
          chars[updateIdx] = String(result % 10);
          if (result >= 10) {
            const carryDigit = Math.floor(result / 10);
            const leftIdx = updateIdx - 1;
            if (leftIdx >= 0) {
              const left = parseInt(chars[leftIdx] || "0", 10);
              chars[leftIdx] = String(left + carryDigit);
            } else {
              chars.unshift(String(carryDigit));
            }
          }
        }

        updatedSteps[2].partials[rowIndex] = chars.join("");
        setSteps(updatedSteps);

        break;
      }

      case "reveal_digits": {
        const { rowIndex, colIndex, digitsToReveal = 1 } = nextMeta;

        // Cập nhật chữ số kết quả
        const rowKey = `row_${rowIndex}`;
        setVisibleDigitsMap((prev) => ({
          ...prev,
          [rowKey]: (prev[rowKey] ?? 0) + digitsToReveal,
        }));

        // ❌ Không cần cập nhật visibleCarryMap ở đây nữa
        const carryKey = `carry_${rowIndex}`;
        const carryRows = steps?.[2]?.carryRows ?? [];
        const maxLen = steps?.[2]?.maxLen ?? 0;

        const rawCarryRow = carryRows[rowIndex] ?? [];
        const carryArray =
          typeof rawCarryRow === "string"
            ? rawCarryRow.split("")
            : [...rawCarryRow];

        const padded = padLeft(carryArray, maxLen);

        // 👉 Tính chỉ số cần hé lộ
        let targetIdx;
        const targetColFromRight = colIndex + 1;
        if (rowIndex === 0) {
          targetIdx = padded.length - targetColFromRight; // luôn là cuối nếu dòng đầu
        } else {
          const targetColFromRight = colIndex + 1;
          targetIdx = padded.length - 1 - targetColFromRight;
        }

        const currentReveal = visibleCarryMap[carryKey] ?? 0;
        const maxReveal = padded.length - targetIdx;

        const shouldReveal =
          targetIdx >= 0 &&
          padded[targetIdx] &&
          padded[targetIdx].trim() !== "";

        const newRevealCount =
          shouldReveal && currentReveal < maxReveal
            ? currentReveal + 1
            : currentReveal;

        setVisibleCarryMap((prev) => ({
          ...prev,
          [carryKey]: newRevealCount,
        }));

        console.log(
          `[DETAIL] reveal carry one-by-one → row=${rowIndex}, col=${colIndex}, targetIdx=${targetIdx}, padded=${padded.join(
            ""
          )}, revealCount=${newRevealCount}`
        );
        break;
      }

      case "vertical_add": {
        const col = nextMeta.column;
        const row = nextMeta.rowIndex ?? -1;

        setRevealedResultDigits((prev) => prev + 1);

        setVisibleDigitsMap((prev) => {
          const next = { ...prev };
          next["result"] = (next["result"] || 0) + 1;

          if (typeof col === "number") {
            const colKey = `col_${col}`;
            next[colKey] = (next[colKey] || 0) + 1;
          }

          if (typeof row === "number" && row >= 0) {
            const rowKey = `row_${row}`;
            next[rowKey] = (next[rowKey] || 0) + 1;
          }

          return next;
        });

        if (typeof nextMeta?.carryRowIndex === "number") {
          const carryKey = `carry_${nextMeta.carryRowIndex}`;
          const padded = padLeft(
            (steps?.[2]?.carryRows?.[nextMeta.carryRowIndex] || "").split(""),
            steps?.[2]?.maxLen || 0
          );

          const idxFromRight = nextMeta.colIndex + (nextMeta.rowIndex ?? 0);
          const revealCount = padded.length - idxFromRight;

          console.log(
            "🟨 Reveal carry in reveal_digits:",
            carryKey,
            "→ revealIdx:",
            idxFromRight
          );

          setVisibleCarryMap((prev) => ({
            ...prev,
            [carryKey]: Math.max(prev[carryKey] || 0, revealCount),
          }));
        }

        break;
      }

      case "shift": {
        const rowKey = `row_${nextMeta.rowIndex}`;
        setVisibleDigitsMap((prev) => ({
          ...prev,
          [rowKey]: (prev[rowKey] || 0) + 1,
        }));
        break;
      }

      case "carry":
        break;

      case "final_result":
        setStepIndex((prev) => prev + 1);
        setSubStepIndex(0);
        break;

      default:
        console.warn("⚠️ handleNext chưa xử lý:", nextMeta?.type);
        break;
    }

    return;
  }

  // ✅ Mặc định: chuyển sang bước tiếp theo nếu còn
  if (stepIndex < steps.length - 1) {
    setStepIndex((prev) => prev + 1);
    setSubStepIndex(0);
  }
};

export const handleBack = ({
  subStepIndex,
  setSubStepIndex,
  stepIndex,
  setStepIndex,
  steps,
  setRevealedDigits,
  setRevealedResultDigits,
  setCurrentRowIndex,
}) => {
  Speech.stop();

  if (subStepIndex > 0) {
    setSubStepIndex((prev) => prev - 1);
    return;
  }

  if (stepIndex > 0) {
    const prevStep = steps[stepIndex - 1];
    const lastSubStep = prevStep?.subSteps?.length || 0;

    setStepIndex((prev) => prev - 1);
    setSubStepIndex(Math.max(0, lastSubStep - 1));

    setRevealedDigits(0);
    setRevealedResultDigits(0);
    setCurrentRowIndex(0);
  }
};
