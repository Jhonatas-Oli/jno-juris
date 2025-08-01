import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate("/painel");
    } catch {
      setErro("E-mail ou senha inválidos.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-2xl space-y-4 w-96">
        <h2 className="text-xl font-bold text-center text-gray-800">Login - JNO Juris</h2>
        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 rounded bg-gray-100" />
        <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required className="w-full p-2 rounded bg-gray-100" />
        <button type="submit" className="w-full bg-indigo-700 text-white py-2 rounded hover:bg-indigo-800">Entrar</button>
        {erro && <p className="text-red-500 text-center">{erro}</p>}
      </form>
    </div>
  );
}
