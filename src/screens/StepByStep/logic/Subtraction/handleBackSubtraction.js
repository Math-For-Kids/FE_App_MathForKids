export const handleBackSubtraction = ({
  subStepIndex,
  setSubStepIndex,
  setRevealedResultDigits,
  steps,
}) => {
  const getRevealedResultDigitsForStep = (steps, subStepIndex) => {
    if (subStepIndex <= 0) return 0;
    const currentCol = steps[2]?.subStepsMeta?.[subStepIndex];
    const previousCol = steps[2]?.subStepsMeta?.[subStepIndex - 1];
    if (currentCol !== undefined && currentCol !== previousCol) {
      return 1;
    }
    return 0;
  };
  if (subStepIndex > 0) {
    const revealedChange = getRevealedResultDigitsForStep(steps, subStepIndex);
    setSubStepIndex((prev) => prev - 1);
    setRevealedResultDigits((prev) => Math.max(0, prev - revealedChange));
    return true;
  }

  return false;
};
