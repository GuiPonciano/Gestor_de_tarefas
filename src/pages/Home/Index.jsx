import { useEffect, useState, useRef } from "react";
import "./Style.css";
import Lixeira from "../../assets/trash.svg.svg";
import Editar from "../../assets/edit.svg.svg";
import api from "../../servises/api";

function Home() {
  const [tarefas, setTarefas] = useState([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const inputNome = useRef();
  const inputCusto = useRef();
  const inputDataLimite = useRef();

  async function getLista() {
    const tarefasFromApi = await api.get("/lista");
    setTarefas(tarefasFromApi.data);
  }

  async function createLista() {
    await api.post("/lista", {
      nome: inputNome.current.value,
      custo: inputCusto.current.value,
      datalimite: inputDataLimite.current.value,
    });
    getLista();
  }

  async function deleteLista(id) {
    const confirmar = window.confirm("Tem certeza de que deseja excluir este item?");
    if (confirmar) {
      try {
        await api.delete(`/lista/${id}`);
        alert("Item excluído com sucesso!");
        getLista();
      } catch (error) {
        console.error("Erro ao excluir o item:", error);
        alert("Houve um erro ao tentar excluir o item.");
      }
    }
  }

  function handleDragStart(index) {
    setDraggedItemIndex(index);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(index) {
    const updatedTarefas = [...tarefas];
    const draggedItem = updatedTarefas.splice(draggedItemIndex, 1)[0];
    updatedTarefas.splice(index, 0, draggedItem);

    setTarefas(updatedTarefas);
    setDraggedItemIndex(null);
  }

  useEffect(() => {
    getLista();
  }, []);

  return (
    <div className="Container">
      <form>
        <h1>Cadastro de Tarefas</h1>
        <input placeholder="Nome da Tarefa" name="Nome da Tarefa" type="text" ref={inputNome} />
        <input placeholder="Custo" name="Custo" type="number" ref={inputCusto} />
        <input placeholder="Data Limite" name="Data Limite" type="date" ref={inputDataLimite} />
        <button type="button" onClick={createLista}>
          Cadastrar
        </button>
      </form>

      {tarefas.map((tarefa, index) => (
        <div
          key={tarefa.id}
          className="card"
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(index)}
        >
          <div>
            <p>Nome da Tarefa: {tarefa.nome}</p>
            <p>Custo R$: {tarefa.custo}</p>
            <p>Data Limite: {tarefa.datalimite}</p>
            <button onClick={() => deleteLista(tarefa.id)}>
              <img src={Lixeira} alt="Deletar" />
            </button>
            <button>
              <img src={Editar} alt="Editar" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
