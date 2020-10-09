const initialState = {
  minSalary: undefined,
  maxSalary: undefined,
  offset: 0,
  limit: 30,
  sort: "+id",
  uploading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "setSalaryRange":
      return { ...state, ...action.payload };
    case "setOrderingParams":
      const { order, orderBy } = action.payload.params;
      return { ...state, sort: `${order === "asc" ? "+" : "-"}${orderBy}` };
    case "setOffset":
      return { ...state, ...action.payload };
    case "setUploading":
      return { ...state, ...action.payload };
    default:
      throw new Error();
  }
};

export default reducer;
export { initialState };
