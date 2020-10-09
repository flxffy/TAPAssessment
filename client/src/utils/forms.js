export const getInputType = (dataType) => {
  switch (dataType) {
    case "money":
      return { type: "number", min: 0 };
    case "text":
      return { type: "text" };
    default:
      throw new Error("Unsupported type");
  }
};

export const isPristine = (initialState, currentState) => {
  return JSON.stringify(initialState) === JSON.stringify(currentState);
};
