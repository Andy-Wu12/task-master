import { Outlet } from "react-router-dom";

import Navbar from "../../components/Nav/Nav";

export default function Dashboard() {
  return (
    <>
      <h2>Dashboard</h2>
      <Navbar /> <br/>
      
      <Outlet />
    </>
  );
}