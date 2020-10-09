export const formatDataEntry = (data, type) => {
  if (type === "money") {
    return `S$ ${parseFloat(data).toFixed(2)}`;
  } else {
    return data;
  }
};
