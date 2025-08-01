import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";

function Processos() {
  const [processos, setProcessos] = useState<any[]>([]);
  const [titulo, setTitulo] = useState("");
  const [status, setStatus] = useState("Em andamento");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    await addDoc(collection(db, "processos"), {
      titulo,
      status,
      criadoEm: Timestamp.now(),
    });

    setTitulo("");
    setStatus("Em andamento");
    fetchProcessos();
  };

  const fetchProcessos = async () => {
    const snapshot = await getDocs(collection(db, "processos"));
    const lista = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProcessos(lista);
  };

  useEffect(() => {
    fetchProcessos();
  }, []);

  return (
    <div style={{ marginLeft: "200px", padding: "2rem" }}>
      <Sidebar />
      <h2>Cadastro de Processos</h2>

      <form onSubmit={handleAdd} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Título do processo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "1rem" }}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "1rem" }}
        >
          <option value="Em andamento">Em andamento</option>
          <option value="Concluído">Concluído</option>
          <option value="Arquivado">Arquivado</option>
        </select>
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Salvar
        </button>
      </form>

      <ul>
        {processos.map((p) => (
          <li key={p.id}>
            <strong>{p.titulo}</strong> - {p.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Processos;


