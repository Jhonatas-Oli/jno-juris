import { Link } from 'react-router-dom';
import { useState } from 'react';

function Sidebar() {
  const [aberto, setAberto] = useState(false);

  const toggleMenu = () => setAberto(!aberto);

  return (
    <>
      <button
        onClick={toggleMenu}
        style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          background: '#1c2149',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          display: 'none',
        }}
        className="menu-toggle"
      >
        ☰ Menu
      </button>
      <div
        style={{
          width: aberto ? '200px' : window.innerWidth < 768 ? '0' : '200px',
          height: '100vh',
          background: '#1c2149',
          color: 'white',
          position: 'fixed',
          left: 0,
          top: 0,
          overflowX: 'hidden',
          transition: '0.3s',
          padding: aberto || window.innerWidth >= 768 ? '2rem 1rem' : '0',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 999,
        }}
      >
        <h3 style={{ marginBottom: '2rem' }}>JNO Juris</h3>
        <Link to="/painel" style={linkStyle}>
          Painel
        </Link>
        <Link to="/clientes" style={linkStyle}>
          Clientes
        </Link>
        <Link to="/processos" style={linkStyle}>
          Processos
        </Link>
      </div>
      <style>
        {`
          @media (max-width: 768px) {
            .menu-toggle {
              display: block;
            }
          }
        `}
      </style>
    </>
  );
}

const linkStyle: React.CSSProperties = {
  color: 'white',
  textDecoration: 'none',
  marginBottom: '1rem',
};

export default Sidebar;
