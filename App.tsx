import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Clientes from './pages/Clientes';
import Login from './pages/Login';
import Painel from './pages/Painel';
import Processos from './pages/Processos';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/painel"
          element={isLoggedIn ? <Painel /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
        path="/clientes" element=
        {isLoggedIn ? <Clientes /> : <Navigate to="/login" />}
        <Route
          path="/processos"
          element={isLoggedIn ? <Processos /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
