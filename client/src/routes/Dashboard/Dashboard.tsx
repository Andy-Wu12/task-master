import { Outlet } from "react-router-dom";
import { useContext } from "react";

import Button from "react-bootstrap/Button";

import Navbar from "../../components/Nav/Nav";
import { AuthContext } from "../../context/authContext";

export default function Dashboard() {
  const authContext = useContext(AuthContext);

  const logout = () => {
    authContext.setUser(null);
    window.sessionStorage.removeItem('user');
  }

  return (
    <>
      <h2>Dashboard</h2>
      <Navbar /> <br/>
      
      <Outlet /> <br/>

      <Button onClick={logout}>Logout</Button>
    </>
  );
}