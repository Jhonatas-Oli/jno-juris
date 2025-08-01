import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import Sidebar from "../components/Sidebar";

interface Processo { id: string; titulo: string; status: string; criadoEm?: Timestamp; }

export function Processos() {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [titulo, setTitulo] = useState("");
  const [status, setStatus] = useState("Em andamento");

  useEffect(() => {
    fetchProcessos();
  }, []);

  const fetchProcessos = async () => {
    const snapshot = await getDocs(collection(db, "processos"));
    setProcessos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Processo)));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "processos"), { titulo, status, criadoEm: Timestamp.now() });
    setTitulo("");
    setStatus("Em andamento");
    fetchProcessos();
  };

  return (
    <div className="ml-52 p-10">
      <Sidebar />
      <h2 className="text-2xl font-bold mb-6">Cadastro de Processos</h2>
      <form onSubmit={handleAdd} className="flex gap-4 mb-6">
        <input type="text" placeholder="Título do processo" value={titulo} onChange={e => setTitulo(e.target.value)} className="p-2 border rounded w-80" />
        <select value={status} onChange={e => setStatus(e.target.value)} className="p-2 border rounded">
          <option value="Em andamento">Em andamento</option>
          <option value="Concluído">Concluído</option>
          <option value="Arquivado">Arquivado</option>
        </select>
        <button type="submit" className="bg-indigo-700 text-white px-4 py-2 rounded">Salvar</button>
      </form>
      <ul className="space-y-2">
        {processos.map(p => (
          <li key={p.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <span><strong>{p.titulo}</strong> - {p.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
