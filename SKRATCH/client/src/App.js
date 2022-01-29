import logo from "./logo.svg";
import "./App.css";
import "bulma/css/bulma.min.css";
import ApplicationViews from "./components/ApplicationViews";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header";
import { useState, useEffect } from "react";
import { onLoginStatusChange } from "./modules/authManager";
import { Spinner } from "reactstrap";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    onLoginStatusChange(setIsLoggedIn);
  }, []);

  if (isLoggedIn === null) {
    // return <Spinner className="app-spinner dark" />;
  }

  return (
    <div className="App">
      <Router>
        <Header isLoggedIn={isLoggedIn} />
        <ApplicationViews isLoggedIn={isLoggedIn} />
      </Router>
    </div>
  );
}

export default App;
