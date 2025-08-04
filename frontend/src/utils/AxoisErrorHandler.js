export const getErrorMessage = (error) => {
  if (error?.response) {
    return (
      error?.response?.data?.message ||
      error?.response?.data ||
      "Server error occurred"
    );
  } else if (error?.request) {
    return "No response from server. Check your connection.";
  } else {
    return "Unexpected application error";
  }
};

