import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Cliente { id: string; nome: string; }
interface Processo { id: string; titulo: string; status: string; }

export function Dashboard() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [processos, setProcessos] = useState<Processo[]>([]);

  useEffect(() => {
    Promise.all([
      getDocs(collection(db, "clientes")),
      getDocs(collection(db, "processos")),
    ]).then(([clientesSnap, processosSnap]) => {
      setClientes(clientesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cliente)));
      setProcessos(processosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Processo)));
    });
  }, []);

  const statusContagem = {
    andamento: processos.filter(p => p.status === "Em andamento").length,
    concluido: processos.filter(p => p.status === "Concluído").length,
    arquivado: processos.filter(p => p.status === "Arquivado").length,
  };

  const data = [
    { name: "Em andamento", value: statusContagem.andamento },
    { name: "Concluído", value: statusContagem.concluido },
    { name: "Arquivado", value: statusContagem.arquivado },
  ];
  const COLORS = ["#4f46e5", "#22c55e", "#facc15"];

  return (
    <div className="ml-52 p-10">
      <Sidebar />
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h3 className="text-lg font-semibold">Total de Clientes</h3>
          <p className="text-4xl text-indigo-600">{clientes.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h3 className="text-lg font-semibold">Total de Processos</h3>
          <p className="text-4xl text-indigo-600">{processos.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md col-span-1 md:col-span-3">
          <h3 className="text-lg font-semibold mb-2">Status dos Processos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
