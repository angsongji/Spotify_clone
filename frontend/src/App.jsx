import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { ApiProvider } from "./context/ApiContext";
import { MusicProvider } from "./context/MusicContext";
const App = () => {
  return <ApiProvider>
    <MusicProvider>
      <RouterProvider router={router} />
    </MusicProvider>


  </ApiProvider>;
};

export default App;
