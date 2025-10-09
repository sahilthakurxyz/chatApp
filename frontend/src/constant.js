// import { jwtDecode } from "jwt-decode";
// export const BACKEND_URL_PROD = `http://localhost:4001/api/chatapp`;
export const BACKEND_URL_PROD = "https://chatapp-c5fr.onrender.com/api/chatapp";
export const isTokenExpired = (token) => {
  if (!token) return true;
  const { exp } = jwtDecode(token);
  return Date.now() >= exp * 1000;
};
