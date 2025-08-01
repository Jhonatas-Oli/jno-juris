import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import Sidebar from "../components/Sidebar";

interface Cliente { id: string; nome: string; }

export function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nome, setNome] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [novoNome, setNovoNome] = useState("");

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    const snapshot = await getDocs(collection(db, "clientes"));
    setClientes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cliente)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editandoId) {
      await updateDoc(doc(db, "clientes", editandoId), { nome: novoNome });
      setEditandoId(null);
      setNovoNome("");
    } else {
      if (clientes.some(c => c.nome.toLowerCase() === nome.toLowerCase())) {
        alert("Cliente já cadastrado.");
        return;
      }
      await addDoc(collection(db, "clientes"), { nome });
      setNome("");
    }
    fetchClientes();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "clientes", id));
    fetchClientes();
  };

  return (
    <div className="ml-52 p-10">
      <Sidebar />
      <h2 className="text-2xl font-bold mb-6">Cadastro de Clientes</h2>
      <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
        <input type="text" placeholder="Nome do cliente" value={editandoId ? novoNome : nome} onChange={e => editandoId ? setNovoNome(e.target.value) : setNome(e.target.value)} className="p-2 border rounded w-80" />
        <button type="submit" className="bg-indigo-700 text-white px-4 py-2 rounded">{editandoId ? "Salvar" : "Adicionar"}</button>
      </form>
      <ul className="space-y-2">
        {clientes.map(cliente => (
          <li key={cliente.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            {editandoId === cliente.id ? (
              <input type="text" value={novoNome} onChange={e => setNovoNome(e.target.value)} className="border p-1 rounded w-1/2" />
            ) : (
              <span>{cliente.nome}</span>
            )}
            <div className="flex gap-2">
              {editandoId === cliente.id ? (
                <button onClick={() => handleSubmit(new Event("submit") as any)} className="bg-green-600 text-white px-2 py-1 rounded">Salvar</button>
              ) : (
                <button onClick={() => { setEditandoId(cliente.id); setNovoNome(cliente.nome); }} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
              )}
              <button onClick={() => handleDelete(cliente.id)} className="bg-red-600 text-white px-2 py-1 rounded">Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
