import { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import Sidebar from '../components/Sidebar';

function Processos() {
  const [nome, setNome] = useState('');
  const [status, setStatus] = useState('Em andamento');
  const [processos, setProcessos] = useState<any[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [novoNome, setNovoNome] = useState('');
  const [novoStatus, setNovoStatus] = useState('Em andamento');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) return;
    await addDoc(collection(db, 'processos'), { nome, status });
    setNome('');
    setStatus('Em andamento');
    fetchProcessos();
  };

  const fetchProcessos = async () => {
    const snapshot = await getDocs(collection(db, 'processos'));
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProcessos(lista);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'processos', id));
    fetchProcessos();
  };

  const iniciarEdicao = (processo: any) => {
    setEditandoId(processo.id);
    setNovoNome(processo.nome);
    setNovoStatus(processo.status);
  };

  const salvarEdicao = async (id: string) => {
    if (!novoNome.trim()) return;
    await updateDoc(doc(db, 'processos', id), {
      nome: novoNome,
      status: novoStatus,
    });
    setEditandoId(null);
    setNovoNome('');
    setNovoStatus('Em andamento');
    fetchProcessos();
  };

  useEffect(() => {
    fetchProcessos();
  }, []);

  return (
    <div style={{ marginLeft: '200px', padding: '2rem' }}>
      <Sidebar />
      <h2>Cadastro de Processos</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Nome do processo"
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
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginRight: '1rem',
          }}
        >
          <option value="Em andamento">Em andamento</option>
          <option value="Concluído">Concluído</option>
          <option value="Arquivado">Arquivado</option>
        </select>
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
        {processos.map((processo) => (
          <li key={processo.id} style={{ marginBottom: '0.5rem' }}>
            {editandoId === processo.id ? (
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
                <select
                  value={novoStatus}
                  onChange={(e) => setNovoStatus(e.target.value)}
                  style={{
                    padding: '0.3rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    marginRight: '0.5rem',
                  }}
                >
                  <option value="Em andamento">Em andamento</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Arquivado">Arquivado</option>
                </select>
                <button
                  onClick={() => salvarEdicao(processo.id)}
                  style={{
                    backgroundColor: '#5cb85c',
                    color: 'white',
                    border: 'none',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '0.5rem',
                  }}
                >
                  Salvar
                </button>
              </>
            ) : (
              <>
                {processo.nome} - <strong>{processo.status}</strong>
                <button
                  onClick={() => iniciarEdicao(processo)}
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
                  onClick={() => handleDelete(processo.id)}
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

export default Processos;
