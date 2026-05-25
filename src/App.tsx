
import { useEffect } from "react";
import AppRouter from "./router/AppRouter"
import { useAuthStore } from "./features/users/store/useAuthStore";



function App() {
  const checkAuth = useAuthStore(
    (state) => state.checkAuth
  );

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <AppRouter />
    </>
  )
}

export default App
