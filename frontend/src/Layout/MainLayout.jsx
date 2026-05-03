import Header from "../components/Header"
import Footer from "../components/Footer"
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>

      <Header />

      <main style={{
        flex: 1,paddingTop: '0px'
      }}>
        <Outlet />
      </main>

      <Footer />

    </div>
  );
}