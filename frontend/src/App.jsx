import AppRoutes from "./routes/AppRoutes";
import ToastProvider from "./pages/shared/Toast";
export default function App() {
  return (
    <>
      <ToastProvider />
      <AppRoutes />
    </>
  );
}
