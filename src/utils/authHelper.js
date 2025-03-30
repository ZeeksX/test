export const logoutAndRedirect = () => {
  localStorage.removeItem("access_token");
  window.location.href = "/login";
};
