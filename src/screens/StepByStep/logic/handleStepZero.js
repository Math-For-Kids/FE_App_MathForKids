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
    // Tạo bản sao của steps để cập nhật
    const newSteps = [...steps];
    [1, 2, 3].forEach((i) => {
      newSteps[i].number1 = n1.toString();
      newSteps[i].number2 = n2.toString();
    });
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
        alert("Phép toán không hợp lệ.");
    }
    setSteps(newSteps);
    if (stepIndex < newSteps.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  } else {
    alert("Please enter valid numbers.");
  }
};
