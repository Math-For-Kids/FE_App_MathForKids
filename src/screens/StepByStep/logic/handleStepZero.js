import { handleAddition } from "./handleAddition";
import { handleSubtraction } from "./handleSubtraction";
import { handleMultiplication } from "./handleMultiplication";
import { handleDivision } from "./handleDivision";

export const handleStepZero = ({
  number1,
  number2,
  operator,
  steps,
  setRemember,
  setStepIndex,
  setSteps,
  stepIndex,
}) => {
  const n1 = parseInt(number1);
  const n2 = parseInt(number2);

  if (!isNaN(n1) && !isNaN(n2) && n1 >= 0 && n2 >= 0) {
    const newSteps = [...steps];
    const n1Str = n1.toString();
    const n2Str = n2.toString();
    const lastDigit1 = n1Str[n1Str.length - 1];
    const lastDigit2 = n2Str[n2Str.length - 1];
    const sum = parseInt(lastDigit1) + parseInt(lastDigit2);

    // Gán number1, number2 vào từng bước (nếu muốn lưu)
    [1, 2, 3].forEach((i) => {
      newSteps[i].number1 = n1Str;
      newSteps[i].number2 = n2Str;
    });

    // Bước 1: luôn có mô tả này
    newSteps[1].title = "Step 1: Write straight calculation";
    newSteps[1].description = `Place the numbers ${n1Str} and ${n2Str} so that the digits in the same row and column are aligned.`;
    newSteps[1].subText =
      "The units place is in line with the units place, the tens place is in line with the tens place.";

    // Bước 2: mô tả khác nhau theo phép toán
    switch (operator) {
      case "+":
        newSteps[2].title = "Step 2: Add the digits in the units place";
        newSteps[2].description =
          `Add the digits in the units digit: ${lastDigit1} + ${lastDigit2} = ${sum} → Write ${
            sum % 10
          }` +
          (sum >= 10
            ? `, carry ${Math.floor(sum / 10)} to the next column.`
            : "");
        break;
      case "-":
        newSteps[2].title = "Step 2: Subtract the digits in the units place";
        newSteps[2].description = `Subtract the digits in the units digit: ${lastDigit1} - ${lastDigit2} = ${
          lastDigit1 - lastDigit2
        }`;
        break;
      case "×":
        newSteps[2].title = "Step 2: Multiply step by step";
        newSteps[2].description = `We will multiply ${n1Str} by ${n2Str} from right to left, one digit at a time.`;
        break;
      case "÷":
        newSteps[2].title = "Step 2: Start division";
        newSteps[2].description = `Divide ${n1Str} by ${n2Str}, starting with the leftmost digit.`;
        break;
      default:
        newSteps[2].description = "";
    }
    setRemember("");
    switch (operator) {
      case "+":
        handleAddition(n1, n2, newSteps, setRemember);
        break;
      case "-":
        handleSubtraction(n1, n2, newSteps, setRemember);
        break;
      case "×":
        handleMultiplication(n1, n2, newSteps, setRemember);
        break;
      case "÷":
        handleDivision(n1, n2, newSteps, setRemember);
        break;
      default:
        alert("Invalid operator.");
    }

    setSteps(newSteps);
    if (stepIndex < newSteps.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  } else {
    alert("Please enter valid positive integers.");
  }
};
