import React from 'react';
import { Router } from "react-router-dom";
import Routes from 'src/routes';
import { history } from 'src/common/history';
import 'src/App.css';

function App() {
  return (
    <Router history={history}>
        <Routes />
    </Router>
  );
}

export default App;
