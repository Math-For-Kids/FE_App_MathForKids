import { View, Text, TouchableOpacity, TextInput } from "react-native";
export default function StepZeroInput({
  number1,
  number2,
  operator,
  setNumber1,
  setNumber2,
  setOperator,
  dynamicFontSize,
  getMaxLength,
  styles,
}) {
  return (
    <View style={styles.stepZeroContainer}>
      <View style={styles.operatorRow}>
        {["+", "-", "×", "÷"].map((op) => (
          <TouchableOpacity
            key={op}
            onPress={() => setOperator(op)}
            style={[
              styles.operatorButton,
              operator === op ? styles.operatorActive : styles.operatorInactive,
            ]}
          >
            <Text style={styles.operatorSymbol}>{op}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.numberInputRow}>
        {number1 === "" && (
          <Text style={[styles.placeholderText, styles.placeholderLeft]}>
            Num 1
          </Text>
        )}
        <TextInput
          style={[styles.inputBox, { fontSize: dynamicFontSize(number1) }]}
          value={number1}
          onChangeText={setNumber1}
          keyboardType="numeric"
          maxLength={getMaxLength(1)}
        />
        {number2 === "" && (
          <Text style={[styles.placeholderText, styles.placeholderRight]}>
            Num 2
          </Text>
        )}
        <TextInput
          style={[styles.inputBox, { fontSize: dynamicFontSize(number2) }]}
          value={number2}
          onChangeText={setNumber2}
          keyboardType="numeric"
          maxLength={getMaxLength(2)}
        />
      </View>
    </View>
  );
}
