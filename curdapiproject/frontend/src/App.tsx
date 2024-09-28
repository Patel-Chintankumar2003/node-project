import "./App.css";
import { useState } from "react";
import Auth from "./components/Auth";
import DataList from "./components/DataList";
import { ToastContainer } from "react-toastify"; // Toastify imports
import "react-toastify/ReactToastify.css"; // Toastify styles

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="App">
      {!isAuthenticated ? <Auth onLogin={handleLogin} /> : <DataList />}
      <ToastContainer />
    </div>
  );
}

export default App;
