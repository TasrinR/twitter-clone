export const handleApiError = (data) => {
  if (data?.response?.status == 401) {
    alert(" Unauthorized operation, Please LOG IN first");
  } else {
    alert(data?.response?.data?.message);
  }
};
