import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function Dashboard() {
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalProcessos, setTotalProcessos] = useState(0);
  const [statusContagem, setStatusContagem] = useState({
    andamento: 0,
    concluido: 0,
    arquivado: 0,
  });

  useEffect(() => {
    const carregarDados = async () => {
      const clientesSnap = await getDocs(collection(db, 'clientes'));
      setTotalClientes(clientesSnap.size);

      const processosSnap = await getDocs(collection(db, 'processos'));
      setTotalProcessos(processosSnap.size);

      const andamentoSnap = await getDocs(
        query(
          collection(db, 'processos'),
          where('status', '==', 'Em andamento')
        )
      );
      const concluidoSnap = await getDocs(
        query(collection(db, 'processos'), where('status', '==', 'Concluído'))
      );
      const arquivadoSnap = await getDocs(
        query(collection(db, 'processos'), where('status', '==', 'Arquivado'))
      );

      setStatusContagem({
        andamento: andamentoSnap.size,
        concluido: concluidoSnap.size,
        arquivado: arquivadoSnap.size,
      });
    };
    carregarDados();
  }, []);

  const data = [
    { name: 'Em andamento', value: statusContagem.andamento },
    { name: 'Concluído', value: statusContagem.concluido },
    { name: 'Arquivado', value: statusContagem.arquivado },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div style={{ marginLeft: '200px', padding: '2rem' }}>
      <Sidebar />
      <h2>Dashboard</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <h3>Total de Clientes</h3>
          <p>{totalClientes}</p>
        </div>
        <div style={cardStyle}>
          <h3>Total de Processos</h3>
          <p>{totalProcessos}</p>
        </div>
        <div style={{ ...cardStyle, width: '100%' }}>
          <h3>Status dos Processos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                isAnimationActive={true}
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
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

const cardStyle: React.CSSProperties = {
  background: '#f7f7f7',
  padding: '1rem',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  width: '200px',
};

export default Dashboard;
