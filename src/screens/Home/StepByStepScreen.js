// // StepByStepScreen.js
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   Image,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useTheme } from "../../themes/ThemeContext";
// import { Fonts } from "../../../constants/Fonts";
// import { LinearGradient } from "expo-linear-gradient";
// import { ScrollView } from "react-native";

// const steps = [
//   {
//     title: "Enter any 2 positive integers",
//     description: "",
//     result: "",
//   },
//   {
//     title: "Step 1: Write straight calculation",
//     description:
//       "place the numbers 17 and 25 so that the digits in the same row and column are aligned:",
//     subText:
//       "The units place is in line with the units place, the tens place is in line with the tens place.",
//   },
//   {
//     title: "Step 2: Add the digits in the units digit: ",
//     description:
//       "Add the digits in the units digit: 7 + 5 = 12 Write 2 in the units column, carry 1 to the tens column.",
//     result: "",
//   },
//   {
//     title: "Step 3: Final Result",
//     description: "The final calculated result.",
//     result: "",
//   },
// ];

// export default function StepByStepScreen({ navigation, route }) {
//   const { theme } = useTheme();
//   const { skillName } = route.params;
//   const [stepIndex, setStepIndex] = useState(0);
//   const currentStep = steps[stepIndex];
//   const [number1, setNumber1] = useState("");
//   const [number2, setNumber2] = useState("");
//   const [remember, setRemember] = useState("");
//   const [operator, setOperator] = useState("+");

//   const dynamicFontSize = (value) => {
//     if (value.length <= 2) return 100;
//     if (value.length <= 4) return 50;
//     if (value.length <= 6) return 34;
//     if (value.length <= 8) return 24;
//     return 20;
//   };

//   const getGradient = () => {
//     if (skillName === "Addition") return theme.colors.gradientGreen;
//     if (skillName === "Subtraction") return theme.colors.gradientPurple;
//     if (skillName === "Multiplication") return theme.colors.gradientOrange;
//     if (skillName === "Division") return theme.colors.gradientRed;
//     return theme.colors.gradientPink;
//   };
//   const getBorderBox = () => {
//     if (skillName === "Addition") return theme.colors.GreenDark;
//     if (skillName === "Subtraction") return theme.colors.purpleDark;
//     if (skillName === "Multiplication") return theme.colors.orangeDark;
//     if (skillName === "Division") return theme.colors.redDark;
//     return theme.colors.pinkDark;
//   };
//   useEffect(() => {
//     const unsubscribe = navigation.addListener("focus", () => {
//       setStepIndex(0);
//       setNumber1("");
//       setNumber2("");
//     });
//     return unsubscribe;
//   }, [navigation]);

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       paddingTop: 20,
//       backgroundColor: theme.colors.background,
//     },
//     header: {
//       width: "100%",
//       height: "18%",
//       flexDirection: "row",
//       justifyContent: "center",
//       alignItems: "center",
//       borderBottomLeftRadius: 50,
//       borderBottomRightRadius: 50,
//       elevation: 3,
//       marginBottom: 20,
//     },
//     backButton: {
//       position: "absolute",
//       left: 10,
//       backgroundColor: theme.colors.backBackgound,
//       marginLeft: 20,
//       padding: 8,
//       borderRadius: 50,
//     },
//     headerText: {
//       fontSize: 32,
//       fontFamily: Fonts.NUNITO_BLACK,
//       color: theme.colors.white,
//     },
//     titleContainer: {
//       flexDirection: "row",
//       justifyContent: "space-around",
//       alignItems: "center",
//     },
//     soundContainer: {
//       width: 40,
//       alignItems: "center",
//       paddingVertical: 5,
//       borderRadius: 50,
//       elevation: 3,
//       marginBottom: 20,
//     },
//     title: {
//       fontSize: 20,
//       fontFamily: Fonts.NUNITO_BLACK,
//       marginBottom: 10,
//       width: "80%",
//     },
//     inputBox: {
//       borderWidth: 1,
//       borderStyle: "dashed",
//       borderColor: getBorderBox(),
//       padding: 10,
//       borderRadius: 10,
//       width: "40%",
//       height: 200,
//       textAlign: "center",
//       fontFamily: Fonts.NUNITO_BLACK,
//     },
//     numberBoxContainer: {
//       flex: 1,
//       margin: 10,
//     },
//     rememberBoxContainer: {
//       position: "absolute",
//       left: 60,
//       right: 0,
//       width: "20%",
//       height: 50, // Hoặc 40% nếu trong đơn vị flex
//       justifyContent: "center", // Căn giữa theo chiều dọc
//       alignItems: "center", // Căn giữa theo chiều ngang
//       borderWidth: 1,
//       borderStyle: "dashed",
//       borderColor: getBorderBox(),
//       borderRadius: 10,
//     },
//     rememberNumber: {
//       fontFamily: Fonts.NUNITO_BLACK,
//       color: theme.colors.blueGray,
//       fontSize: 20,
//     },
//     numberContainer: {
//       flexDirection: "row",
//       justifyContent: "center",
//       alignItems: "center",
//       gap: 10,
//     },
//     operatorContainer: {
//       width: "30%",
//       height: 120, // Hoặc 40% nếu trong đơn vị flex
//       justifyContent: "center", // Căn giữa theo chiều dọc
//       alignItems: "center", // Căn giữa theo chiều ngang
//       borderWidth: 1,
//       borderStyle: "dashed",
//       borderColor: getBorderBox(),
//       borderRadius: 10,
//       marginBottom: 30,
//     },
//     operator: {
//       fontFamily: Fonts.NUNITO_BLACK,
//       fontSize: 80,
//     },
//     numbersContainer: {
//       width: "30%",
//     },
//     numberBox: {
//       height: 120, // Hoặc 40% nếu trong đơn vị flex
//       justifyContent: "center", // Căn giữa theo chiều dọc
//       alignItems: "center", // Căn giữa theo chiều ngang
//       borderWidth: 1,
//       borderStyle: "dashed",
//       borderColor: getBorderBox(),
//       borderRadius: 10,
//       marginBottom: 30,
//     },
//     number: {
//       fontFamily: Fonts.NUNITO_BLACK,
//       fontSize: 80,
//     },
//     lineIconContainer: {
//       alignItems: "center",
//     },
//     lineIcon: { width: "80%", height: 10 },

//     description: {
//       fontSize: 20,
//       fontFamily: Fonts.NUNITO_BOLD,
//       width: "80%",
//       textAlign: "center",
//       marginBottom: 20,
//     },
//     resultTextContainer: {
//       height: 120, // Hoặc 40% nếu trong đơn vị flex
//       width: "60%",
//       borderWidth: 1,
//       borderStyle: "dashed",
//       borderColor: getBorderBox(),
//       borderRadius: 10,
//       marginBottom: 30,
//       marginLeft: 80,
//       justifyContent: "center", // Căn giữa theo chiều dọc
//     },
//     resultText: {
//       fontFamily: Fonts.NUNITO_BLACK,
//       color: theme.colors.redTomato,
//       fontSize: 80,
//       textAlign: "right",
//     },
//     subText: {
//       fontSize: 14,
//       fontFamily: Fonts.NUNITO_BOLD,
//       width: "80%",
//     },
//     nextButton: {
//       position: "absolute",
//       bottom: 0,
//       left: 0,
//       right: 0,
//       paddingVertical: 10,
//       borderTopLeftRadius: 50,
//       borderTopRightRadius: 50,
//     },
//     nextText: {
//       color: theme.colors.white,
//       fontSize: 18,
//       fontFamily: Fonts.NUNITO_BLACK,
//       textAlign: "center",
//     },
//     backStepContainer: {
//       flexDirection: "row",
//     },
//     backStepButton: {
//       backgroundColor: "#f39c12",
//       padding: 15,
//       borderRadius: 30,
//       margin: 10,
//       borderWidth: 1,
//       borderColor: theme.colors.white,
//       borderRadius: 50,
//       padding: 5,
//       elevation: 3,
//     },
//   });
//   const placeLabels = [
//     "Units",
//     "Tens",
//     "Hundreds",
//     "Thousands",
//     "Ten thousands",
//   ];

//   const handleAddition = (n1, n2, steps, setRemember) => {
//     // Chuẩn hóa chuỗi để 2 số có cùng độ dài
//     const str1 = n1
//       .toString()
//       .padStart(Math.max(n1.toString().length, n2.toString().length), "0");
//     const str2 = n2.toString().padStart(str1.length, "0");

//     const digits1 = str1.split("").reverse();
//     const digits2 = str2.split("").reverse();

//     let resultDigits = [];
//     let carryDigits = [];
//     let carry = 0;

//     // Cộng từng hàng từ phải sang trái
//     for (let i = 0; i < digits1.length; i++) {
//       const d1 = parseInt(digits1[i]);
//       const d2 = parseInt(digits2[i]);
//       const sum = d1 + d2 + carry;
//       resultDigits.push(sum % 10);
//       carry = Math.floor(sum / 10);
//       carryDigits.push(carry);
//     }

//     // Nếu còn dư nhớ cuối cùng
//     if (carry > 0) {
//       resultDigits.push(carry);
//       carryDigits.push(0); // Không cần nhớ tiếp sau hàng cao nhất
//     }

//     // Gán dữ liệu để UI hiển thị theo từng cột
//     steps[2].carryDigits = [...carryDigits].reverse();
//     steps[2].digitSums = [...resultDigits].reverse();
//     steps[2].digits1 = [...digits1].reverse();
//     steps[2].digits2 = [...digits2].reverse();

//     // Gán kết quả
//     steps[2].result = resultDigits.reverse().join("").replace(/^0+/, "");
//     const finalResult = resultDigits.slice().reverse().join("");
//     steps[3].result = finalResult.replace(/^0+/, "") || "0";

//     const length = str1.length;

//     // Hướng dẫn bước 2: cộng từng hàng
//     if (length === 2) {
//       const unit1 = parseInt(str1[1]);
//       const unit2 = parseInt(str2[1]);
//       const unitSum = unit1 + unit2;
//       const carryUnit = Math.floor(unitSum / 10);

//       const ten1 = parseInt(str1[0]);
//       const ten2 = parseInt(str2[0]);
//       const tenSum = ten1 + ten2 + carryUnit;

//       steps[2].subText =
//         `Cộng hàng đơn vị: ${unit1} + ${unit2} = ${unitSum}, viết ${
//           unitSum % 10
//         }` +
//         (carryUnit > 0 ? `, nhớ ${carryUnit}.` : ".") +
//         `\nCộng hàng chục: ${ten1} + ${ten2}` +
//         (carryUnit > 0 ? ` + ${carryUnit} (nhớ)` : "") +
//         ` = ${tenSum}, viết ${tenSum}.`;
//     } else {
//       steps[2].subText =
//         "Cộng từng hàng từ phải sang trái: đơn vị → chục → trăm" +
//         (length >= 4 ? " → nghìn." : ".");
//     }

//     // Hướng dẫn bước 3: kết quả cuối cùng
//     if (length === 2) {
//       steps[3].subText = `Kết quả: Cộng hàng chục và đơn vị đã hoàn tất.\nTổng là: ${steps[3].result}`;
//     } else {
//       steps[3].subText = `Kết quả: Tổng cộng tất cả các hàng.\nTổng là: ${steps[3].result}`;
//     }

//     // Cập nhật số nhớ nếu có
//     if (carry > 0) setRemember(carry.toString());
//   };

//   const handleSubtraction = (n1, n2, steps, setRemember) => {
//     const isNegative = n1 < n2;
//     const a = isNegative ? n2 : n1;
//     const b = isNegative ? n1 : n2;

//     const strA = a
//       .toString()
//       .padStart(Math.max(a.toString().length, b.toString().length), "0");
//     const strB = b.toString().padStart(strA.length, "0");

//     const digitsA = strA.split("").reverse();
//     const digitsB = strB.split("").reverse();

//     let resultDigits = [];
//     let borrowFlags = [];
//     let borrow = 0;

//     for (let i = 0; i < digitsA.length; i++) {
//       let dA = parseInt(digitsA[i]) - borrow;
//       const dB = parseInt(digitsB[i]);

//       if (dA < dB) {
//         dA += 10;
//         borrow = 1;
//         borrowFlags.push(true);
//       } else {
//         borrow = 0;
//         borrowFlags.push(false);
//       }

//       resultDigits.push(dA - dB);
//     }

//     let finalResult =
//       resultDigits.slice().reverse().join("").replace(/^0+/, "") || "0";
//     if (isNegative) finalResult = "-" + finalResult;

//     // Lưu kết quả từng bước cho hiển thị
//     steps[2].digits1 = [...digitsA].reverse();
//     steps[2].digits2 = [...digitsB].reverse();
//     steps[2].resultDigits = [...resultDigits].reverse();
//     steps[2].borrowFlags = borrowFlags.reverse();
//     steps[2].result = resultDigits[0].toString(); // hàng đơn vị
//     steps[3].result = finalResult;

//     // Hướng dẫn bằng lời
//     if (strA.length === 2) {
//       const u1 = parseInt(strA[1]);
//       const u2 = parseInt(strB[1]);
//       const uStep =
//         u1 < u2
//           ? `${u1}+10 - ${u2} = ${u1 + 10 - u2} (mượn 1)`
//           : `${u1} - ${u2} = ${u1 - u2}`;

//       const t1 = parseInt(strA[0]);
//       const t2 = parseInt(strB[0]) + (u1 < u2 ? 1 : 0);
//       const tStep = `${strA[0]} - ${t2} = ${t1 - t2}`;

//       steps[2].subText = `Hàng đơn vị: ${uStep}\nHàng chục: ${tStep}`;
//     } else {
//       steps[2].subText =
//         "Trừ từng hàng từ phải sang trái: đơn vị → chục → trăm...";
//     }

//     steps[3].subText = `Hiệu sau khi trừ là: ${steps[3].result}`;
//     if (borrowFlags.includes(true)) setRemember("Có mượn");
//   };

//   const handleMultiplication = (n1, n2, steps, setRemember) => {
//     const str1 = n1.toString();
//     const str2 = n2.toString();

//     const digits1 = str1.split("").reverse(); // Số bị nhân
//     const digits2 = str2.split("").reverse(); // Số nhân

//     let partials = [];
//     let carryRows = [];
//     let subTextLines = [];

//     digits2.forEach((digitChar, idx) => {
//       const digit = parseInt(digitChar);
//       let carry = 0;
//       let row = [];
//       let carryRow = [];

//       digits1.forEach((d1) => {
//         const mul = d1 * digit + carry;
//         row.unshift(mul % 10);
//         carry = Math.floor(mul / 10);
//         carryRow.unshift(carry);
//       });

//       if (carry > 0) {
//         row.unshift(carry);
//         carryRow.unshift(0); // không có carry tiếp
//       }

//       // Thêm chữ số 0 tương ứng với vị trí
//       const rowStr = row.join("") + "0".repeat(idx);
//       partials.push(rowStr);
//       carryRows.push(carryRow);
//       subTextLines.push(
//         `Nhân ${n1} × ${digit} ở hàng ${
//           ["đơn vị", "chục", "trăm", "nghìn"][idx] || `10^${idx}`
//         } = ${parseInt(rowStr)}`
//       );
//     });

//     const finalResult = partials.reduce((sum, val) => sum + parseInt(val), 0);

//     // Lưu lại thông tin vào steps
//     steps[2].partials = partials;
//     steps[2].carryRows = carryRows;
//     steps[2].digits = str1.split("");
//     steps[2].multiplierDigits = str2.split("");
//     steps[2].subText = subTextLines.join("\n");

//     steps[3].result = finalResult.toString();
//     steps[3].subText = `Cộng tất cả các dòng: ${partials.join(
//       " + "
//     )} = ${finalResult}`;

//     setRemember("");
//   };

//   const handleDivision = (n1, n2, steps, setRemember) => {
//     if (n2 === 0) {
//       steps[3].result = "Không chia được";
//       steps[2].subText = "Không thể chia cho 0.";
//       return;
//     }

//     const dividendStr = n1.toString();
//     const dividend = dividendStr.split("").map(Number);
//     let current = 0;
//     let quotient = "";
//     let stepsDisplay = [];

//     let started = false;

//     for (let i = 0; i < dividend.length; i++) {
//       current = current * 10 + dividend[i];

//       if (!started) {
//         if (current < n2) {
//           quotient += "0"; // có thể ẩn nếu muốn
//           continue;
//         } else {
//           started = true;
//         }
//       }

//       const qDigit = Math.floor(current / n2);
//       const sub = qDigit * n2;
//       const remainder = current - sub;

//       stepsDisplay.push({
//         part: current.toString(),
//         minus: sub.toString(),
//         remainder: remainder.toString(),
//         position: i,
//       });

//       quotient += qDigit.toString();
//       current = remainder;
//     }

//     if (current !== 0) {
//       stepsDisplay.push({
//         part: current.toString(),
//         minus: "0",
//         remainder: current.toString(),
//         position: dividend.length - 1,
//       });
//     }

//     const remainder = current;
//     const cleanedQuotient = quotient.replace(/^0+/, "") || "0";

//     steps[2].divisionSteps = stepsDisplay;
//     steps[2].quotient = cleanedQuotient;
//     steps[2].dividend = dividendStr;
//     steps[2].divisor = n2.toString();
//     steps[2].remainder = remainder.toString();
//     steps[2].subText = "Chia theo từng bước (chia cột)";
//     steps[3].result = `${cleanedQuotient} dư ${remainder}`;
//     steps[3].subText = `Kết quả cuối cùng là: ${cleanedQuotient} dư ${remainder}`;

//     setRemember(remainder > 0 ? `Dư ${remainder}` : "");
//   };

//   // Hàm tổng xử lý khi stepIndex === 0
//   const handleStepZero = ({
//     number1,
//     number2,
//     operator,
//     steps,
//     setRemember,
//     setStepIndex,
//     stepIndex,
//   }) => {
//     const n1 = parseInt(number1);
//     const n2 = parseInt(number2);

//     if (!isNaN(n1) && !isNaN(n2) && n1 >= 0 && n2 >= 0) {
//       [1, 2, 3].forEach((i) => {
//         steps[i].number1 = n1.toString();
//         steps[i].number2 = n2.toString();
//       });
//       setRemember("");

//       switch (operator) {
//         case "+":
//           handleAddition(n1, n2, steps, setRemember);
//           break;
//         case "-":
//           handleSubtraction(n1, n2, steps, setRemember);
//           break;
//         case "×":
//           handleMultiplication(n1, n2, steps, setRemember);
//           break;
//         case "÷":
//           handleDivision(n1, n2, steps, setRemember);
//           break;
//         default:
//           alert("Phép toán không hợp lệ.");
//       }

//       if (stepIndex < steps.length - 1) {
//         setStepIndex(stepIndex + 1);
//       }
//     } else {
//       alert("Please enter valid numbers.");
//     }
//   };
//   const divisionStyleMap = {
//     "1-1": {
//       topOffset: 30,
//       borderHeight: 80,
//       subTop: -65,
//       subTopNext: -84,
//       subLeft: -3,
//       subLeftNext: -60,
//       subLineTop: -20,
//       remainderLeftNext: 7,
//       lineTop: -45,
//       lineLeft: -25,
//       subLineLeft: -20,
//       remainderTop: -30,
//       remainderLeft: -5,
//       leftQuotient: 165,
//     },
//     "1-2": {
//       topOffset: 30,
//       borderHeight: 80,
//       subTop: -65,
//       subTopNext: -84,
//       subLineTop: -20,
//       subLeft: -7,
//       subLeftNext: -60,
//       remainderLeftNext: 7,
//       lineTop: -45,
//       lineLeft: -30,
//       subLineLeft: -20,
//       remainderTop: -30,
//       remainderLeft: -10,
//       leftQuotient: 160,
//     },
//     "1-3": {
//       topOffset: 30,
//       borderHeight: 80,
//       subTop: -65,
//       subTopNext: -84,
//       subLineTop: -20,
//       subLeft: -10,
//       subLeftNext: -60,
//       remainderLeftNext: 7,
//       lineTop: -45,
//       lineLeft: -35,
//       subLineLeft: -25,
//       remainderTop: -30,
//       remainderLeft: -15,
//       leftQuotient: 155,
//     },
//     "1-4": {
//       topOffset: 30,
//       borderHeight: 80,
//       subTop: -65,
//       subTopNext: -84,
//       subLineTop: -20,
//       subLeft: -15,
//       subLeftNext: -60,
//       remainderLeftNext: 7,
//       lineTop: -45,
//       lineLeft: -45,
//       subLineLeft: -30,
//       remainderTop: -30,
//       remainderLeft: -25,
//       leftQuotient: 150,
//     },
//     "2-1": {
//       topOffset: 30,
//       paddingHorizontal: 10,
//       borderHeight: 80,
//       subNumber: -30,
//       remainderTop: -30,
//       remainderLeft: -12,
//       remainderLeftNext: 0,
//       subTop: -60,
//       subTopNext: -84,
//       subLeft: -8,
//       subLeftNext: 10,
//       subLineLeft: -20,
//       subLineLeftNext: -20,
//       subLineTop: -20,
//       subLineTopNext: -15,
//       lineTop: -45,
//       lineTopNext: -45,
//       lineLeft: -15,
//       lineLeftNext: -15,
//       leftQuotient: 170,
//       partTop: -89,
//       partLeft: 5,
//     },
//     "2-2": {
//       topOffset: 30,
//       paddingHorizontal: 10,
//       borderHeight: 80,
//       subNumber: -30,
//       remainderTop: -30,
//       remainderLeft: -20,
//       remainderLeftNext: 0,
//       subTop: -60,
//       subTopNext: -84,
//       subLeft: -10,
//       subLeftNext: 10,
//       subLineLeft: -20,
//       subLineLeftNext: -20,
//       subLineTop: -20,
//       subLineTopNext: -15,
//       lineTop: -45,
//       lineTopNext: -45,
//       lineLeft: -25,
//       lineLeftNext: -15,
//       leftQuotient: 170,
//       partTop: -89,
//       partLeft: 5,
//     },
//     "2-3": {
//       topOffset: 30,
//       paddingHorizontal: 10,
//       borderHeight: 80,
//       subNumber: -30,
//       remainderTop: -30,
//       remainderLeft: -25,
//       remainderLeftNext: 0,
//       subTop: -60,
//       subTopNext: -84,
//       subLeft: -15,
//       subLeftNext: 10,
//       subLineLeft: -30,
//       subLineLeftNext: -20,
//       subLineTop: -20,
//       subLineTopNext: -15,
//       lineTop: -45,
//       lineTopNext: -45,
//       lineLeft: -30,
//       lineLeftNext: -15,
//       leftQuotient: 170,
//       partTop: -89,
//       partLeft: 5,
//       leftQuotient: 155,
//     },
//     "2-4": {
//       topOffset: 30,
//       paddingHorizontal: 10,
//       borderHeight: 80,
//       subNumber: -30,
//       remainderTop: -30,
//       remainderLeft: -32,
//       remainderLeftNext: 0,
//       subTop: -60,
//       subTopNext: -84,
//       subLeft: -18,
//       subLeftNext: 10,
//       subLineLeft: -35,
//       subLineLeftNext: -20,
//       subLineTop: -20,
//       subLineTopNext: -15,
//       lineTop: -45,
//       lineTopNext: -45,
//       lineLeft: -38,
//       lineLeftNext: -15,
//       leftQuotient: 170,
//       partTop: -89,
//       partLeft: 5,
//       leftQuotient: 150,
//     },
//     "3-1": {
//       topOffset: 30,
//       paddingHorizontal: 10,
//       borderHeight: 80,
//       subNumber: -30,
//       remainderTop: -30,
//       remainderLeft: -20,
//       remainderLeftNext: -12,
//       subTop: -60,
//       subTopNext: -84,
//       subLeft: -10,
//       subLeftNext: -10,
//       subLineLeft: -35,
//       subLineLeftNext: -20,
//       subLineTop: -20,
//       subLineTopNext: -15,
//       lineTop: -45,
//       lineTopNext: -45,
//       lineLeft: -20,
//       lineLeftNext: -15,
//       leftQuotient: 170,
//       partTop: -89,
//       partLeft: -8,
//       partLeftNext: 5,
//       leftQuotient: 175,
//     },
//     "3-2": {
//       topOffset: 30,
//       paddingHorizontal: 10,
//       borderHeight: 80,
//       subNumber: -30,
//       remainderTop: -30,
//       remainderLeft: -20,
//       remainderLeftNext: -12,
//       subTop: -60,
//       subTopNext: -84,
//       subLeft: -10,
//       subLeftNext: -10,
//       subLineLeft: -35,
//       subLineLeftNext: -20,
//       subLineTop: -20,
//       subLineTopNext: -15,
//       lineTop: -45,
//       lineTopNext: -45,
//       lineLeft: -20,
//       lineLeftNext: -15,
//       leftQuotient: 170,
//       partTop: -89,
//       partLeft: -8,
//       partLeftNext: 5,
//       leftQuotient: 175,
//     },
//     "3-3": {
//       topOffset: 30,
//       paddingHorizontal: 10,
//       borderHeight: 80,
//       subNumber: -30,
//       remainderTop: -30,
//       remainderLeft: -30,
//       remainderLeftNext: -12,
//       subTop: -60,
//       subTopNext: -84,
//       subLeft: -10,
//       subLeftNext: -10,
//       subLineLeft: -35,
//       subLineLeftNext: -20,
//       subLineTop: -20,
//       subLineTopNext: -15,
//       lineTop: -45,
//       lineTopNext: -45,
//       lineLeft: -30,
//       lineLeftNext: -15,
//       leftQuotient: 170,
//       partTop: -89,
//       partLeft: -8,
//       partLeftNext: 5,
//       leftQuotient: 165,
//     },
//     "3-4": {
//       topOffset: 30,
//       paddingHorizontal: 10,
//       borderHeight: 80,
//       subNumber: -30,
//       remainderTop: -30,
//       remainderLeft: -40,
//       remainderLeftNext: -12,
//       subTop: -60,
//       subTopNext: -84,
//       subLeft: -20,
//       subLeftNext: -10,
//       subLineLeft: -35,
//       subLineLeftNext: -20,
//       subLineTop: -20,
//       subLineTopNext: -15,
//       lineTop: -45,
//       lineTopNext: -45,
//       lineLeft: -38,
//       lineLeftNext: -15,
//       leftQuotient: 170,
//       partTop: -89,
//       partLeft: -8,
//       partLeftNext: 5,
//       leftQuotient: 160,
//     },
//     "4-1": {
//       topOffset: 30,
//       paddingHorizontal: 10,
//       borderHeight: 80,
//       subNumber: -30,
//       remainderTop: -30,
//       remainderLeft: -20,
//       remainderLeftNext: -8,
//       remainderLeftNextNext: 5,
//       remainderLeftNextNextNext: 20,
//       subTop: -60,
//       subTopNext: -84,
//       subLeft: -12,
//       subLeftNext: 0,
//       subLeftNextNext: 15,
//       subLeftNextNextNext: 30,
//       subLineLeft: -35,
//       subLineLeftNext: -20,
//       subLineTop: -20,
//       subLineTopNext: -15,
//       lineTop: -45,
//       lineTopNext: -45,
//       lineLeft: -25,
//       lineLeftNext: -20,
//       leftQuotient: 170,
//       partTop: -89,
//       partLeft: -8,
//       partLeftNext: 5,
//       partLeftNextNextNext: 20,
//       leftQuotient: 180,
//     },
//   };

//   return (
//     <View style={styles.container}>
//       <LinearGradient colors={getGradient()} style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>Calculation</Text>
//       </LinearGradient>
//       <View style={styles.titleContainer}>
//         <LinearGradient colors={getGradient()} style={styles.soundContainer}>
//           <TouchableOpacity>
//             <Ionicons
//               name="volume-medium"
//               size={28}
//               color={theme.colors.white}
//             />
//           </TouchableOpacity>
//         </LinearGradient>
//         <Text
//           style={styles.title}
//           numberOfLines={3}
//           adjustsFontSizeToFit
//           minimumFontScale={0.5}
//         >
//           {currentStep.title}
//           {"\n"}
//           {currentStep.description}
//         </Text>
//       </View>
//       {/* Nhập số + chọn toán tử (không cuộn) */}
//       {stepIndex === 0 && (
//         <View style={{ flex: 0 }}>
//           <View
//             style={{
//               flexDirection: "row",
//               justifyContent: "space-around",
//               width: "100%",
//             }}
//           >
//             {number1 === "" && (
//               <Text
//                 style={{
//                   position: "absolute",
//                   top: 75,
//                   left: 25,
//                   fontSize: 40,
//                   color: "#999",
//                   fontFamily: Fonts.NUNITO_BLACK,
//                 }}
//               >
//                 Num 1
//               </Text>
//             )}
//             <TextInput
//               style={[styles.inputBox, { fontSize: dynamicFontSize(number1) }]}
//               value={number1}
//               onChangeText={setNumber1}
//               keyboardType="numeric"
//               maxLength={10}
//             />
//             {number2 === "" && (
//               <Text
//                 style={{
//                   position: "absolute",
//                   top: 75,
//                   right: 25,
//                   fontSize: 40,
//                   color: "#999",
//                   fontFamily: Fonts.NUNITO_BLACK,
//                 }}
//               >
//                 Num 2
//               </Text>
//             )}
//             <TextInput
//               style={[styles.inputBox, { fontSize: dynamicFontSize(number2) }]}
//               value={number2}
//               onChangeText={setNumber2}
//               keyboardType="numeric"
//               maxLength={10}
//             />
//           </View>

//           <View
//             style={{
//               flexDirection: "row",
//               justifyContent: "center",
//               marginTop: 10,
//             }}
//           >
//             {["+", "-", "×", "÷"].map((op) => (
//               <TouchableOpacity
//                 key={op}
//                 onPress={() => setOperator(op)}
//                 style={{
//                   backgroundColor: operator === op ? "#44bd32" : "#ccc",
//                   padding: 10,
//                   borderRadius: 10,
//                   marginHorizontal: 5,
//                   width: "20%",
//                   height: "65%",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   marginTop: 5,
//                 }}
//               >
//                 <Text style={{ fontSize: 100, color: "#fff" }}>{op}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>
//       )}

//       {/* ScrollView chỉ chứa kết quả và các bước */}
//       <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}>
//         {stepIndex !== 0 && (
//           <View style={styles.numberBoxContainer}>
//             {remember !== "" && stepIndex !== 1 && stepIndex !== 3 && (
//               <View style={styles.rememberBoxContainer}>
//                 <Text
//                   style={styles.rememberNumber}
//                   numberOfLines={1}
//                   adjustsFontSizeToFit
//                   minimumFontScale={0.5}
//                 >
//                   {remember}
//                 </Text>
//               </View>
//             )}

//             <View style={styles.numberContainer}>
//               <View style={styles.operatorContainer}>
//                 <Text style={styles.operator}>{operator}</Text>
//               </View>
//               <View style={styles.numbersContainer}>
//                 <View style={styles.numberBox}>
//                   <Text
//                     style={styles.number}
//                     numberOfLines={1}
//                     adjustsFontSizeToFit
//                     minimumFontScale={0.5}
//                   >
//                     {number1}
//                   </Text>
//                 </View>
//                 <View style={styles.numberBox}>
//                   <Text
//                     style={styles.number}
//                     numberOfLines={1}
//                     adjustsFontSizeToFit
//                     minimumFontScale={0.5}
//                   >
//                     {number2}
//                   </Text>
//                 </View>
//               </View>
//             </View>
//             <View style={styles.lineIconContainer}>
//               <Image source={theme.icons.line} style={styles.lineIcon} />
//             </View>
//           </View>
//         )}
//         {/* <View style={styles.lineIconContainer}>
//           <Image source={theme.icons.line} style={styles.lineIcon} />
//         </View> */}
//         {stepIndex > 0 && (
//           <View style={styles.stepBox}>
//             <View style={styles.titleContainer}>
//               <LinearGradient
//                 colors={getGradient()}
//                 style={styles.soundContainer}
//               >
//                 <TouchableOpacity>
//                   <Ionicons
//                     name="volume-medium"
//                     size={28}
//                     color={theme.colors.white}
//                   />
//                 </TouchableOpacity>
//               </LinearGradient>
//               <Text
//                 style={styles.subText}
//                 numberOfLines={4}
//                 adjustsFontSizeToFit
//                 minimumFontScale={0.5}
//               >
//                 {currentStep.subText}
//               </Text>
//             </View>
//           </View>
//         )}
//         {stepIndex === 3 && (
//           <View style={styles.resultTextContainer}>
//             {currentStep.result !== "" && (
//               <Text
//                 style={styles.resultText}
//                 numberOfLines={1}
//                 adjustsFontSizeToFit
//                 minimumFontScale={0.5}
//               >
//                 {currentStep.result}
//               </Text>
//             )}
//           </View>
//         )}
//         {operator === "+" && stepIndex === 2 && steps[2]?.digitSums && (
//           <View style={{ alignItems: "center", marginTop: 10 }}>
//             {/* Nhãn hàng số */}
//             <View style={{ flexDirection: "row", marginBottom: 4 }}>
//               {steps[2].digitSums.map((_, i) => (
//                 <Text
//                   key={`label-${i}`}
//                   style={{
//                     width: 60,
//                     textAlign: "center",
//                     fontSize: 14,
//                     fontWeight: "bold",
//                     color: "#666",
//                   }}
//                 >
//                   {
//                     placeLabels[
//                       placeLabels.length - steps[2].digitSums.length + i
//                     ]
//                   }
//                 </Text>
//               ))}
//             </View>

//             {/* Dòng số nhớ */}
//             <View style={{ flexDirection: "row" }}>
//               {steps[2].carryDigits.map((carry, i) => (
//                 <Text
//                   key={`carry-${i}`}
//                   style={{
//                     width: 60,
//                     textAlign: "center",
//                     fontSize: 16,
//                     color: "#999",
//                   }}
//                 >
//                   {carry > 0 ? carry : " "}
//                 </Text>
//               ))}
//             </View>

//             {/* Dòng số thứ nhất */}
//             <View style={{ flexDirection: "row" }}>
//               {steps[2].digits1.map((digit, i) => (
//                 <Text
//                   key={`num1-${i}`}
//                   style={{
//                     width: 60,
//                     textAlign: "center",
//                     fontSize: 24,
//                   }}
//                 >
//                   {digit}
//                 </Text>
//               ))}
//             </View>

//             {/* Dòng số thứ hai */}
//             <View style={{ flexDirection: "row" }}>
//               {steps[2].digits2.map((digit, i) => (
//                 <Text
//                   key={`num2-${i}`}
//                   style={{
//                     width: 60,
//                     textAlign: "center",
//                     fontSize: 24,
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {digit}
//                 </Text>
//               ))}
//             </View>

//             {/* Gạch ngang */}
//             <View style={{ flexDirection: "row", marginTop: 2 }}>
//               {steps[2].digits1.map((_, i) => (
//                 <Text
//                   key={`line-${i}`}
//                   style={{
//                     width: 60,
//                     textAlign: "center",
//                     fontSize: 20,
//                     color: "#aaa",
//                   }}
//                 >
//                   ―
//                 </Text>
//               ))}
//             </View>

//             {/* Kết quả từng chữ số */}
//             <View style={{ flexDirection: "row" }}>
//               {steps[2].digitSums.map((digit, i) => (
//                 <Text
//                   key={`sum-${i}`}
//                   style={{
//                     width: 60,
//                     textAlign: "center",
//                     fontSize: 24,
//                     color: "green",
//                   }}
//                 >
//                   {digit}
//                 </Text>
//               ))}
//             </View>
//           </View>
//         )}
//         {operator === "-" && stepIndex === 2 && steps[2]?.resultDigits && (
//           <View style={{ alignItems: "center", marginTop: 10 }}>
//             {/* Nhãn hàng số */}
//             <View style={{ flexDirection: "row", marginBottom: 4 }}>
//               {steps[2].resultDigits.map((_, i) => (
//                 <Text
//                   key={`label-sub-${i}`}
//                   style={{
//                     width: 60,
//                     textAlign: "center",
//                     fontSize: 14,
//                     fontWeight: "bold",
//                     color: "#666",
//                   }}
//                 >
//                   {
//                     placeLabels[
//                       placeLabels.length - steps[2].resultDigits.length + i
//                     ]
//                   }
//                 </Text>
//               ))}
//             </View>

//             {/* Dòng MƯỢN */}
//             <View style={{ flexDirection: "row" }}>
//               {steps[2].borrowFlags.map((borrowed, i) => (
//                 <Text
//                   key={`borrow-${i}`}
//                   style={{
//                     width: 60,
//                     textAlign: "center",
//                     fontSize: 16,
//                     color: borrowed ? "#e74c3c" : "#999",
//                   }}
//                 >
//                   {borrowed ? "1" : " "}
//                 </Text>
//               ))}
//             </View>

//             {/* Số bị trừ (số lớn hơn) */}
//             <View style={{ flexDirection: "row" }}>
//               {steps[2].digits1.map((digit, i) => (
//                 <Text
//                   key={`minuend-${i}`}
//                   style={{
//                     width: 60,
//                     textAlign: "center",
//                     fontSize: 24,
//                   }}
//                 >
//                   {digit}
//                 </Text>
//               ))}
//             </View>

//             {/* Số trừ */}
//             <View style={{ flexDirection: "row" }}>
//               {steps[2].digits2.map((digit, i) => (
//                 <Text
//                   key={`subtrahend-${i}`}
//                   style={{
//                     width: 60,
//                     textAlign: "center",
//                     fontSize: 24,
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {digit}
//                 </Text>
//               ))}
//             </View>

//             {/* Gạch ngang */}
//             <View style={{ flexDirection: "row", marginTop: 2 }}>
//               {steps[2].digits1.map((_, i) => (
//                 <Text
//                   key={`line-sub-${i}`}
//                   style={{
//                     width: 60,
//                     textAlign: "center",
//                     fontSize: 20,
//                     color: "#aaa",
//                   }}
//                 >
//                   ―
//                 </Text>
//               ))}
//             </View>

//             {/* Kết quả từng chữ số */}
//             <View style={{ flexDirection: "row" }}>
//               {steps[2].resultDigits.map((digit, i) => (
//                 <Text
//                   key={`result-digit-${i}`}
//                   style={{
//                     width: 60,
//                     textAlign: "center",
//                     fontSize: 24,
//                     color: "green",
//                   }}
//                 >
//                   {digit}
//                 </Text>
//               ))}
//             </View>
//           </View>
//         )}
//         {operator === "×" && stepIndex === 2 && steps[2]?.partials && (
//           <View style={{ alignItems: "center", marginTop: 10 }}>
//             {/* Số bị nhân */}
//             <Text
//               style={{
//                 fontSize: 22,
//                 fontWeight: "bold",
//                 fontFamily: "monospace",
//               }}
//             >
//               {" ".repeat(
//                 Math.max(steps[3].result.length - steps[2].digits.length, 0)
//               )}
//               {steps[2].digits.join("")}
//             </Text>

//             {/* Số nhân */}
//             <Text
//               style={{
//                 fontSize: 22,
//                 fontWeight: "bold",
//                 fontFamily: "monospace",
//               }}
//             >
//               ×
//               {" ".repeat(
//                 Math.max(
//                   steps[3].result.length - steps[2].multiplierDigits.length - 1,
//                   0
//                 )
//               )}
//               {steps[2].multiplierDigits.join("")}
//             </Text>

//             {/* Gạch ngang 1 */}
//             <View
//               style={{
//                 height: 1,
//                 backgroundColor: "#999",
//                 width: steps[3].result.length * 16,
//                 marginVertical: 4,
//               }}
//             />

//             {/* Dòng nhân + số nhớ tương ứng */}
//             {steps[2].partials.map((line, i) => (
//               <View key={`group-${i}`}>
//                 {/* Số nhớ từng dòng (carry) */}
//                 {steps[2].carryRows?.[i] && (
//                   <Text
//                     style={{
//                       fontSize: 16,
//                       color: "#999",
//                       width: steps[3].result.length * 16,
//                       textAlign: "right",
//                       fontFamily: "monospace",
//                     }}
//                   >
//                     {" ".repeat(i)}
//                     {steps[2].carryRows[i].join("")}
//                   </Text>
//                 )}
//                 {/* Dòng kết quả nhân */}
//                 <Text
//                   style={{
//                     fontSize: 22,
//                     color: "green",
//                     width: steps[3].result.length * 16,
//                     textAlign: "right",
//                     fontFamily: "monospace",
//                   }}
//                 >
//                   {line.toString().padStart(steps[3].result.length - i, " ")}
//                 </Text>
//               </View>
//             ))}

//             {/* Gạch ngang 2 */}
//             {steps[2].partials.length > 1 && (
//               <View
//                 style={{
//                   height: 1,
//                   backgroundColor: "#999",
//                   width: steps[3].result.length * 16,
//                   marginVertical: 4,
//                 }}
//               />
//             )}

//             {/* Tổng cuối cùng */}
//             {steps[2].partials.length > 1 && (
//               <Text
//                 style={{
//                   fontSize: 22,
//                   color: "#d35400",
//                   fontWeight: "bold",
//                   width: steps[3].result.length * 16,
//                   textAlign: "right",
//                   fontFamily: "monospace",
//                 }}
//               >
//                 {steps[3].result}
//               </Text>
//             )}
//           </View>
//         )}

//         {/* handleD */}
//         {operator === "÷" &&
//           stepIndex === 2 &&
//           steps[2]?.divisionSteps &&
//           (() => {
//             const dLen = steps[2].dividend.length;
//             const sLen = steps[2].divisor.length;
//             const styleKey = `${dLen}-${sLen}`; // ✅ sửa tại đây
//             const styleConfig = divisionStyleMap[styleKey] || {
//               topOffset: -28,
//               leftQuotient: 10,
//               paddingHorizontal: 10,
//               borderHeight: 100,
//             };

//             return (
//               <View
//                 style={{
//                   flex: 1,
//                   marginTop: 20,
//                   alignItems: "center",
//                   paddingHorizontal: 20,
//                   marginBottom: 60,
//                 }}
//               >
//                 {/* HÀNG TRÊN: dividend + dấu chia + divisor */}
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     alignItems: "flex-start",
//                     justifyContent: "center",
//                     width: "100%",
//                     position: "relative",
//                   }}
//                 >
//                   {/* Số bị chia */}
//                   <Text
//                     style={{
//                       fontSize: 22,
//                       fontFamily: "monospace",
//                       paddingRight: 6,
//                     }}
//                   >
//                     {steps[2].dividend}
//                   </Text>

//                   {/* Dấu chia và số chia */}
//                   <View style={{ position: "relative" }}>
//                     <View
//                       style={{ flexDirection: "row", alignItems: "flex-start" }}
//                     >
//                       <View
//                         style={{
//                           borderLeftWidth: 2,
//                           height: styleConfig.borderHeight,
//                         }}
//                       />
//                       <View
//                         style={{ borderBottomWidth: 2, paddingHorizontal: 4 }}
//                       >
//                         <Text style={{ fontSize: 22, fontFamily: "monospace" }}>
//                           {steps[2].divisor}
//                         </Text>
//                       </View>
//                     </View>
//                   </View>
//                   {/* Thương */}
//                   <Text
//                     style={{
//                       position: "absolute",
//                       top: styleConfig.topOffset,
//                       left: styleConfig.leftQuotient,
//                       fontSize: 22,
//                       fontFamily: "monospace",
//                     }}
//                   >
//                     {steps[2].quotient}
//                   </Text>
//                 </View>

//                 {/* CÁC BƯỚC CHIA */}
//                 <View style={{ marginTop: 16, alignItems: "flex-start" }}>
//                   {steps[2].divisionSteps.map((step, index) => {
//                     if (
//                       step.remainder === step.part &&
//                       dLen >= sLen &&
//                       step.remainder === step.part &&
//                       steps[2].divisor < steps[2].dividend
//                     ) {
//                       return null;
//                     }
//                     return (
//                       <View
//                         key={index}
//                         style={{ position: "relative", marginBottom: 30 }}
//                       >
//                         {/* Trừ */}
//                         <View
//                           style={{
//                             flexDirection: "row",
//                             position: "relative",
//                             top: styleConfig.subTop,
//                             left: styleConfig.subLeft,
//                           }}
//                         >
//                           <Text
//                             style={{
//                               fontSize: 22,
//                               fontFamily: "monospace",
//                               color: "#000",
//                               top:
//                                 index === 0
//                                   ? styleConfig.subLineTop
//                                   : styleConfig.subLineTopNext,
//                               left: styleConfig.subLineLeft,
//                             }}
//                           >
//                             -{" "}
//                           </Text>

//                           <Text
//                             style={{
//                               fontSize: 22,
//                               fontFamily: "monospace",
//                               color: theme.colors.redTomato,
//                               position: "absolute",

//                               left:
//                                 index === 0
//                                   ? styleConfig.subLeft
//                                   : index === 1
//                                   ? styleConfig.subLeftNext
//                                   : index === 2
//                                   ? styleConfig.subLeftNextNext
//                                   : index === 3
//                                   ? styleConfig.subLeftNextNextNext
//                                   : index === 4
//                                   ? styleConfig.subLeftNextNextNextNext
//                                   : styleConfig.subLeftNextNextNextNextNext,
//                             }}
//                           >
//                             {step.minus}
//                           </Text>
//                         </View>

//                         {/* Gạch ngang */}
//                         <Text
//                           style={{
//                             fontSize: 22,
//                             fontFamily: "monospace",
//                             color: "#9e9e9e",
//                             position: "absolute",
//                             width: "10%",
//                             top:
//                               index === 0
//                                 ? styleConfig.lineTop
//                                 : styleConfig.lineTopNext,
//                             left:
//                               index === 0
//                                 ? styleConfig.lineLeft
//                                 : index === 1
//                                 ? styleConfig.lineLeftNext
//                                 : index === 2
//                                 ? styleConfig.lineLeftNextNext
//                                 : index === 3
//                                 ? styleConfig.lineLeftNextNextNext
//                                 : index === 4
//                                 ? styleConfig.lineLeftNextNextNextNext
//                                 : styleConfig.lineLeftNextNextNextNextNext,
//                           }}
//                         >
//                           {"─".repeat(Math.max(step.minus.length + 1, 2))}
//                         </Text>

//                         {/* Remainder */}
//                         {/* Phần hiện remainder – LUÔN phải hiển thị */}
//                         <Text
//                           style={{
//                             fontSize: 20,
//                             fontFamily: "monospace",
//                             color: "#1e88e5",
//                             position: "absolute",
//                             top: styleConfig.remainderTop,
//                             left:
//                               index === 0
//                                 ? styleConfig.remainderLeft
//                                 : index === 1
//                                 ? styleConfig.remainderLeftNext
//                                 : index === 2
//                                 ? styleConfig.remainderLeftNextNext
//                                 : index === 3
//                                 ? styleConfig.remainderLeftNextNextNext
//                                 : index === 4
//                                 ? styleConfig.remainderLeftNextNextNextNext
//                                 : styleConfig.remainderLeftNextNextNextNextNext,
//                           }}
//                         >
//                           {step.remainder}
//                         </Text>

//                         {/* Phần part – CHỈ hiện khi có từ bước 2 trở đi và số chia >= 2 chữ số */}
//                         {index !== 0 && steps[2].divisor.length >= 1 && (
//                           <Text
//                             style={{
//                               fontSize: 20,
//                               fontFamily: "monospace",
//                               color: "#000",
//                               position: "absolute",
//                               top: styleConfig.partTop,
//                               left:
//                                 index === 1
//                                   ? styleConfig.partLeft
//                                   : index === 2
//                                   ? styleConfig.partLeftNext
//                                   : index === 3
//                                   ? styleConfig.partLeftNextNextNext
//                                   : index === 4
//                                   ? styleConfig.partLeftNextNextNextNext
//                                   : styleConfig.partLeftNexttNextNextNextNext,
//                             }}
//                           >
//                             {step.part}
//                           </Text>
//                         )}
//                       </View>
//                     );
//                   })}
//                 </View>
//               </View>
//             );
//           })()}

//         <View style={styles.backStepContainer}>
//           {stepIndex > 0 && (
//             <TouchableOpacity
//               style={styles.backStepButton}
//               onPress={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
//             >
//               <Ionicons name="play-back" size={24} color={theme.colors.white} />
//             </TouchableOpacity>
//           )}
//         </View>
//       </ScrollView>

//       <LinearGradient colors={getGradient()} style={styles.nextButton}>
//         <TouchableOpacity
//           onPress={() => {
//             if (stepIndex === 0) {
//               handleStepZero({
//                 number1,
//                 number2,
//                 operator,
//                 steps,
//                 setRemember,
//                 setStepIndex,
//                 stepIndex,
//               });
//             } else if (stepIndex < steps.length - 1) {
//               setStepIndex(stepIndex + 1);
//             }
//           }}
//         >
//           <Text style={styles.nextText}>Next</Text>
//         </TouchableOpacity>
//       </LinearGradient>
//     </View>
//   );
// }
