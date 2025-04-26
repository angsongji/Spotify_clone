import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { Suspense, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./redux/store"; // Đảm bảo đúng đường dẫn tới store
import { useAuth } from './hooks/useAuth';
import { PlayerMusicProvider } from './context/PlayerMusicContext';
import { initGlobalWebSocket } from './redux/websocketGlobal';
const WebSocketInitializer = () => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.userId);
  const user = useSelector(state => state.user.user);
  useEffect(() => {
    if (userId != "" && user?.role != "admin") {
      initGlobalWebSocket(dispatch, userId);
    }
  }, [dispatch, userId]);

  return null;
};
const Gate = ({ children }) => {
  const { loading } = useAuth(); // kiểm tra user đã load xong chưa

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-green-500 text-xl font-semibold animate-pulse">
        Đang tải...
      </div>
    );
  }

  return children; // cho phép render app nếu user đã sẵn sàng
};

const App = () => {

  return (
    <Provider store={store}>  {/* Bọc toàn bộ ứng dụng trong Provider */}

      <PlayerMusicProvider>

        <Gate>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-black text-green-500 text-xl font-semibold animate-pulse">
              Đang tải...
            </div>
          }>
            <WebSocketInitializer />
            <RouterProvider router={router} />
          </Suspense>
        </Gate>
      </PlayerMusicProvider>
    </Provider>
  );
};

export default App;
