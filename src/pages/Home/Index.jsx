import { useEffect, useState, useRef } from 'react';
import './Style.css';
import Lixeira from '../../assets/trash.svg.svg';
import Editar from '../../assets/edit.svg.svg';
import api from '../../servises/api';

function Home() {
  const [tarefas, setTarefas] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTarefa, setCurrentTarefa] = useState(null);
  
  const inputNome = useRef();
  const inputCusto = useRef();
  const inputDataLimite = useRef();
  
  async function getLista() {
    const tarefasFromApi = await api.get('/lista');
    setTarefas(tarefasFromApi.data);
  }

  async function createLista() {
    await api.post('/lista', {
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

  function openEditPopup(tarefa) {
    setCurrentTarefa(tarefa);
    setIsEditing(true);
  }

  function closeEditPopup() {
    setIsEditing(false);
    setCurrentTarefa(null);
  }

  async function saveEdit() {
    if (currentTarefa) {
      try {
        await api.put(`/lista/${currentTarefa.id}`, {
          nome: currentTarefa.nome,
          custo: currentTarefa.custo,
          datalimite: currentTarefa.datalimite,
        });
        alert("Item atualizado com sucesso!");
        closeEditPopup();
        getLista();
      } catch (error) {
        console.error("Erro ao atualizar o item:", error);
        alert("Houve um erro ao tentar atualizar o item.");
      }
    }
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setCurrentTarefa((prevTarefa) => ({
      ...prevTarefa,
      [name]: value,
    }));
  }

  useEffect(() => {
    getLista();
  }, []);

  return (
    <div className='Container'>
      <form>
        <h1>Cadastro de Tarefas</h1>
        <input placeholder='Nome da Tarefa' name='Nome da Tarefa' type='text' ref={inputNome} />
        <input placeholder='Custo' name='Custo' type='number' ref={inputCusto} />
        <input placeholder='Data Limite' name='Data Limite' type='date' ref={inputDataLimite} />
        <button type='button' onClick={createLista}>Cadastrar</button>
      </form>

      {tarefas.map((tarefa) => (
        <div key={tarefa.id} className='card'>
          <div>
            <p>Nome da Tarefa: {tarefa.nome}</p>
            <p>Custo R$: {tarefa.custo}</p>
            <p>Data Limite: {tarefa.datalimite}</p>
            <button onClick={() => deleteLista(tarefa.id)}>
              <img src={Lixeira} alt="Deletar" />
            </button>
            <button onClick={() => openEditPopup(tarefa)}>
              <img src={Editar} alt="Editar" />
            </button>
          </div>
        </div>
      ))}

      {isEditing && (
        <div className="popup">
          <div className="popup-content">
            <h2>Editar Tarefa</h2>
            <form onSubmit={(e) => { e.preventDefault(); saveEdit(); }}>
              <label>
                Nome:
                <input
                  type="text"
                  name="nome"
                  value={currentTarefa.nome}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Custo:
                <input
                  type="number"
                  name="custo"
                  value={currentTarefa.custo}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Data Limite:
                <input
                  type="date"
                  name="datalimite"
                  value={currentTarefa.datalimite}
                  onChange={handleEditChange}
                />
              </label>
              <button type="submit">Salvar</button>
              <button type="button" onClick={closeEditPopup}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
