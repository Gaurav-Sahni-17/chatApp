import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Home from "./components/Home/home";
import Signup from "./components/SignUp/signup";
import Login from "./components/Login/login";
import MailVerify from "./components/MailVerify/mailverify";
import Changepass from "./components/Changepass/changepass";
import Forgot from "./components/Forgot/forgot"
import CheckMail from "./components/checkMail/checkMail"
import Chat from "./components/Chat/chat";
import Invite from "./components/Invite/invite";
import Dashboard from "./components/Dashboard/dashboard"
export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verifymail" element={<MailVerify />} />
        <Route path="/changepass/:token" element={<Changepass />} />
        <Route path="/changepass" element={<Changepass />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/checkmail" element={<CheckMail />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/invite/:id" element={<Invite/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Route>
    )
  );
  return (
    <RouterProvider router={router}></RouterProvider>
  )
}