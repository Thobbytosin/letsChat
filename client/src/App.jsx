import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile";
import Chats from "./pages/Chats";
import { useAppStore } from "./store";
import client from "./lib/client";
import { GET_USERINFO_ROUTE } from "./utils/constants";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to={"/sign-in"} />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;

  return isAuthenticated ? <Navigate to={"/chats"} /> : children;
};

function App() {
  const { userInfo, setUserInfo } = useAppStore();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await client.get(GET_USERINFO_ROUTE, {
          withCredentials: true,
        });
        if (data.success) {
          setUserInfo(data.profile);
        }
      } catch (error) {
        setUserInfo(undefined);
        console.log(error);
      }
    };

    if (!userInfo) {
      getUserData();
    }
  }, []);

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AuthRoute>
                <Home />
              </AuthRoute>
            }
          />

          <Route path="/register" element={<Register />} />

          <Route
            path="/sign-in"
            element={
              <AuthRoute>
                <SignIn />
              </AuthRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/chats"
            element={
              <PrivateRoute>
                <Chats />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
