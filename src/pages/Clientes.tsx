import { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import Sidebar from '../components/Sidebar';

function Clientes() {
  const [nome, setNome] = useState('');
  const [clientes, setClientes] = useState<any[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [novoNome, setNovoNome] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) return;

    const nomeExistente = clientes.find(
      (cliente) => cliente.nome.toLowerCase() === nome.toLowerCase()
    );
    if (nomeExistente) {
      alert('Cliente já cadastrado.');
      return;
    }

    await addDoc(collection(db, 'clientes'), { nome });
    setNome('');
    fetchClientes();
  };

  const fetchClientes = async () => {
    const snapshot = await getDocs(collection(db, 'clientes'));
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setClientes(lista);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'clientes', id));
    fetchClientes();
  };

  const iniciarEdicao = (cliente: any) => {
    setEditandoId(cliente.id);
    setNovoNome(cliente.nome);
  };

  const salvarEdicao = async (id: string) => {
    if (!novoNome.trim()) return;
    await updateDoc(doc(db, 'clientes', id), { nome: novoNome });
    setEditandoId(null);
    setNovoNome('');
    fetchClientes();
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <div style={{ marginLeft: '200px', padding: '2rem' }}>
      <Sidebar />
      <h2>Cadastro de Clientes</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Nome do cliente"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            outline: 'none',
            marginRight: '1rem',
            width: '250px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#1c2149',
            color: '#fff',
            cursor: 'pointer',
            transition: '0.3s',
          }}
        >
          Salvar
        </button>
      </form>
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id} style={{ marginBottom: '0.5rem' }}>
            {editandoId === cliente.id ? (
              <>
                <input
                  type="text"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  style={{
                    padding: '0.3rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    marginRight: '0.5rem',
                  }}
                />
                <button
                  onClick={() => salvarEdicao(cliente.id)}
                  style={{
                    marginRight: '0.5rem',
                    backgroundColor: '#5cb85c',
                    color: 'white',
                    border: 'none',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Salvar
                </button>
              </>
            ) : (
              <>
                {cliente.nome}
                <button
                  onClick={() => iniciarEdicao(cliente)}
                  style={{
                    marginLeft: '1rem',
                    backgroundColor: '#f0ad4e',
                    color: 'white',
                    border: 'none',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '0.5rem',
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(cliente.id)}
                  style={{
                    backgroundColor: '#d9534f',
                    color: 'white',
                    border: 'none',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Excluir
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Clientes;
