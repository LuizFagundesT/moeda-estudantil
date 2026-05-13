import AppRoutes from "./routes/AppRoutes";
import ToastProvider from "./pages/Toast";

export default function App() {
  return (
    <>
      <ToastProvider />
      <AppRoutes />
    </>
  );
}
