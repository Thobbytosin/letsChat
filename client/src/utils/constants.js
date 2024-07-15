export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTE = "/api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTE}/signup`;
export const SIGNIN_ROUTE = `${AUTH_ROUTE}/signin`;
export const GET_USERINFO_ROUTE = `${AUTH_ROUTE}/getProfile`;
export const UPDATE_USERINFO_ROUTE = `${AUTH_ROUTE}/updateProfile/`;
export const UPDATE_USERAVATAR_ROUTE = `${AUTH_ROUTE}/updateAvatar`;
export const DELETE_USERAVATAR_ROUTE = `${AUTH_ROUTE}/deleteAvatar`;
