import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

// Layout wrapper with Header + Footer
export default function Layout() {
  return (
    <>
      <Header />
      <main style={{ minHeight: "80vh" }}>
        <Outlet /> {/* Nested routes will render here */}
      </main>
      <Footer />
    </>
  );

}