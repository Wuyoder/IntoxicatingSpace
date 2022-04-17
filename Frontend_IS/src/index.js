import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { render } from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.Fragment>
    <App />
  </React.Fragment>
);
