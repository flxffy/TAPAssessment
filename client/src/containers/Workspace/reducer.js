const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "setSalaryRange":
      return { ...state, ...action.payload };
    default:
      throw new Error();
  }
};

export default reducer;
export { initialState };
