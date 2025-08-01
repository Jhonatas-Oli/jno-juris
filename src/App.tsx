import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Painel from './pages/Painel';
import Clientes from './pages/Clientes';
import Dashboard from './pages/Dashboard';
import Processos from "./pages/Processos";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/painel" element={<Painel />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/processos" element={<Processos />}
      </Routes>
    </Router>
  );
}

export default App;
