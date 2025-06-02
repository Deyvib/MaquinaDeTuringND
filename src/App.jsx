import { useRef, useState } from "react";
import './App.css'

const App = () => {
  const [machine, setMachine] = useState(null);
  const [inputString, setInputString] = useState("");
  const [tests, setTests] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [maxSteps, setMaxSteps] = useState(80);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(); 

  const parseMachineFile = (text) => {
    const linhas = text.split(/\r?\n/).map(linha => linha.trim()).filter(linha => linha && !linha.startsWith('#'));

    const m = {
      estados: [],
      alfabeto: [],
      fitaAlfabeto: [],
      estadoInicial: '',
      estadosAceita: [],
      estadosRejeita: [],
      transicoes: {}
    };

    for (const linha of linhas) {
      if (linha.startsWith('estados:')) {
        m.estados = linha.replace('estados:', '').trim().split(/\s+/);
      } else if (linha.startsWith('alfabeto:')) {
        m.alfabeto = linha.replace('alfabeto:', '').trim().split(/\s+/);
      } else if (linha.startsWith('fitaAlfabeto:')) {
        m.fitaAlfabeto = linha.replace('fitaAlfabeto:', '').trim().split(/\s+/);
      } else if (linha.startsWith('estadoInicial:')) {
        m.estadoInicial = linha.replace('estadoInicial:', '').trim();
      } else if (linha.startsWith('estadosAceita:')) {
        m.estadosAceita = linha.replace('estadosAceita:', '').trim().split(/\s+/);
      } else if (linha.startsWith('estadosRejeita:')) {
        m.estadosRejeita = linha.replace('estadosRejeita:', '').trim().split(/\s+/);
      } else if (linha.includes('->')) {
        const [esquerda, direita] = linha.split('->').map(part => part.trim());
        const [noEstado, simboloLido] = esquerda.split(/\s+/);
        const [paraEstado, simboloEscrito, direcao] = direita.split(/\s+/);

        const key = `${noEstado},${simboloLido}`;
        if (!m.transicoes[key]) m.transicoes[key] = [];
        m.transicoes[key].push({ proxEstado: paraEstado, escreve: simboloEscrito, direcao });
      }
    }
    return m;
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseMachineFile(text);
    setFileName(file.name);
    setMachine(parsed);
    setTests([]);
    event.target.value = null;
  };

 const simulate = (machine, input, maxTransitions) => {
  const fitaInicial = ["⊳", "⊔", ...input.split("")];
  const configInicial = {
    fita: [...fitaInicial],
    estado: machine.estadoInicial,
    cabecote: 1,
    config: [{ estado: machine.estadoInicial, fita: [...fitaInicial], cabecote: 1 }],
    steps: 0
  };

  const results = [];
  const queue = [configInicial];

  while (queue.length > 0) {
    const current = queue.shift();

    if (current.steps > maxTransitions) {
      const shouldContinue = window.confirm("Número máximo de transições atingido. Deseja continuar?");
      if (!shouldContinue) {
        current.steps = -1;
        results.push(current);
        continue
      };
      maxTransitions += maxSteps;
    }

    if (machine.estadosAceita.includes(current.estado) || machine.estadosRejeita.includes(current.estado)) {
      results.push(current);
      continue;
    }

    const simbolo = current.fita[current.cabecote];
    const key = `${current.estado},${simbolo}`;
    const keyAnySymbol = `${current.estado},*`;

    const transicoesEspecificas = machine.transicoes[key] || [];
    const transicoesCoringa = machine.transicoes[keyAnySymbol] || [];
    const transicoes = [...transicoesEspecificas, ...transicoesCoringa];

    if (transicoes.length === 0) {
      results.push(current);
      continue;
    }

    for (const t of transicoes) {
      const novaFita = [...current.fita];
      if (t.escreve !== "*") novaFita[current.cabecote] = t.escreve;
      let posCabecote = current.cabecote;
      if (t.direcao === "R") posCabecote += 1;
      else if (t.direcao === "L") posCabecote = Math.max(1, current.cabecote - 1);
      if (posCabecote >= novaFita.length) novaFita.push("⊔");
      
      const novaConfig = [...current.config, { estado: t.proxEstado, fita: [...novaFita], cabecote: posCabecote }];

      queue.push({
        fita: novaFita,
        estado: t.proxEstado,
        cabecote: posCabecote,
        config: novaConfig,
        steps: current.steps + 1
      });
    }
  }
  return results;
};

const handleButtonClick = () => {
  fileInputRef.current.click();
};

  const handleAddTest = () => {
    if (!inputString || !machine) return;
      const isValid = inputString.split("").every(char => machine.alfabeto.includes(char));
  if (!isValid && (inputString !== "⊔")) {
    alert("A string contém símbolos que não pertencem ao alfabeto da máquina.");
    return;
  }
    const results = simulate(machine, inputString, maxSteps);
    setTests(prev => [{ input: inputString, results }, ...prev]);
    setInputString("");
  };

  const formatoDaFita = (fita, cabecote) => {
    return fita.map((char, i) => (i === cabecote ? `[${char}]` : char)).join(" ");
  };

  const mostrarConfig = (config) => (
    <ol>
      {config.map((step, i) => (
        <li key={i}>
          Estado: {step.estado}, Fita: {formatoDaFita(step.fita, step.cabecote)}
        </li>
      ))}
    </ol>
  );

  const mostrarListaDeResultados = (results) => {
    return results.map((r, i) => {
      const status = machine.estadosAceita.includes(r.estado)
        ? "✅ Aceita"
        : machine.estadosRejeita.includes(r.estado)
        ? "❌ Rejeita"
        : r.steps === -1
        ? "♾️ Provável loop"
        : "⏹ Parou sem encontrar transição válida";
      return (
        <div key={i} style={{ marginBottom: 10 }}>
          <div><strong>Resultado {i + 1}:</strong> {status}</div>
          {showDetails && mostrarConfig(r.config)}
        </div>
      );
    });
  };


  return (

    <div className="centro" style={{ padding: 50, fontFamily: "Arial" }}>
      <h1 style={{ marginBottom: 30, marginTop: 0 }}>Simulador de Máquina de Turing N.D.</h1>
      <div style={{display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap"}}>
        <input type="file" accept=".txt" ref={fileInputRef} onChange={handleFileUpload} style={{ display: "none" }}/>
        <label>Carregar máquina (.txt):{" "}</label>
        <button onClick={handleButtonClick} className="file">Selecionar arquivo .txt</button>
        <button onClick={() => setTests([])} style={{ marginLeft: 10 }}>Limpar testes</button>
            {fileName && <div>📄 Arquivo selecionado: <strong>{fileName}</strong></div>}
      </div>

      {machine && (
        <>
          <div className="div" style={{ marginTop: 20 }}>
            <div style={{display: "flex", flexWrap: "wrap", gap: 10}}>
            <input className="input2" type="text" placeholder="Digite uma string" value={inputString} onChange={(e) => setInputString(e.target.value)}
              style={{backgroundColor: "#b4b4c4", borderRadius: 5, border: "none", padding: 10, color: "black", fontSize: 15, fontWeight: "bold"}}
            />
            <button onClick={handleAddTest} style={{ marginLeft: 10 }}>Testar</button>
            </div>
            <div>
            <label style={{ marginLeft: 10 }}>
              Máximo de passos:{" "}
              <input className="input" type="number" value={maxSteps} onChange={(e) => setMaxSteps(parseInt(e.target.value))}
                style={{ width: 60, backgroundColor: "#b4b4c4", color: "black", borderRadius: 5, border: "none", padding: 10, fontWeight: "bold", fontSize: 14}}/>
            </label>
            </div>
            <div>
            <label style={{ marginLeft: 20 }}>
              <input type="checkbox" checked={showDetails} onChange={() => setShowDetails(!showDetails)}/> {} Mostrar configurações presentes na computação
            </label>
            </div>
          </div>

          <div style={{ marginTop: 30 }}>
            <h2>Testes:</h2>
            {tests.map((t, i) => (
              <div key={i}>
                <h3>Entrada: {t.input}</h3>
                {mostrarListaDeResultados(t.results)}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
