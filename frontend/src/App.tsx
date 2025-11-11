import { useEffect } from "react";

import { AppRouter } from "./router/AppRouter";
import { useAuthStore } from "./store/authStore";

function App() {
  const bootstrap = useAuthStore((state) => state.bootstrap);

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      bootstrap();
    });

    if (useAuthStore.persist.hasHydrated()) {
      bootstrap();
    }

    return () => {
      unsub?.();
    };
  }, [bootstrap]);

  return <AppRouter />;
}

export default App;
