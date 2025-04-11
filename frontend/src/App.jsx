import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { ApiProvider } from "./context/ApiContext";
import { MusicProvider } from "./context/MusicContext";
import { Suspense } from "react";

const App = () => {
  return (
    <ApiProvider>
      <MusicProvider>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-black text-green-500 text-xl font-semibold animate-pulse">
            Loading...
          </div>
        }>
          <RouterProvider router={router} />
        </Suspense>
      </MusicProvider>
    </ApiProvider>
  );
};

export default App;
