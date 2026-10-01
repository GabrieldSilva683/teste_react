import { useState } from 'react'
import './App.css'

function App() {
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  async function buscarCep(evento) {
    evento.preventDefault();

    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      setErro("Digite um CEP com 8 números.");
      setEndereco(null);
      return;
    }

    setLoading(true);
    setErro(null);
    setEndereco(null);

    try {
      const resposta = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );

      if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
      }

      const dados = await resposta.json();

      if (dados.erro) {
        setErro("CEP não encontrado.");
        return;
      }

      setEndereco(dados);
    } catch (error) {
      console.error("Erro ao buscar CEP", error);
      setErro("Não foi possível buscar o CEP. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>Buscar CEP</h1>

      <form onSubmit={buscarCep}>
        <input
          type="text"
          placeholder="Digite o CEP (ex: 92010000)"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          maxLength={9}
        />

        <button type="submit" disabled={loading}>
          Buscar
        </button>
      </form>

      {loading && <p>Carregando...</p>}

      {erro && !loading && <p>{erro}</p>}

      {endereco && !loading && (
        <div>
          <h2>{endereco.cep}</h2>

          <p>Rua: {endereco.logradouro || "—"}</p>
          <p>Bairro: {endereco.bairro || "—"}</p>
          <p>Cidade: {endereco.localidade}</p>
          <p>Estado: {endereco.uf}</p>
        </div>
      )}
    </>
  )
}

export default App