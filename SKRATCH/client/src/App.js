import logo from "./logo.svg";
import "./App.css";
import "bulma/css/bulma.min.css";
import ApplicationViews from "./components/ApplicationViews";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header";
import { useState, useEffect, useCallback } from "react";
import { onLoginStatusChange } from "./modules/authManager";
import { Spinner } from "reactstrap";
import Search from "./components/Search";
import useHotkeys from "./utils/useHotkeys";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const onKeyPress = (event) => {
    focusSearch();
  };

  const focusSearch = () => {
    const searchInput = document.getElementById("query");
    searchInput.focus();
  };
  useHotkeys([";"], onKeyPress);

  useEffect(() => {
    onLoginStatusChange(setIsLoggedIn);
  }, []);

  return (
    <div className="App" id="app">
      <Router>
        <Header isLoggedIn={isLoggedIn} />
        {/* <Search /> */}
        <ApplicationViews isLoggedIn={isLoggedIn} />
      </Router>
    </div>
  );
}

export default App;
