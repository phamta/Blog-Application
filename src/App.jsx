import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import UserList from "./components/UserList";
import AddUserForm from "./components/AddUserForm";
import UserDetail from "./components/UserDetail";
import UpdateUser from "./components/UpdateUser";
import CreatePost from "./components/CreatePost";
import Login from "./components/Login";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/new" element={<AddUserForm />} />
          <Route path="/user/:userId" element={<UserDetail />} />
          <Route path="/update/:userId" element={<UpdateUser />} />
          <Route path="/create-post/:userId" element={<CreatePost />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;