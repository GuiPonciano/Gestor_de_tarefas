import axios from 'axios'

const api = axios.create({
    baseURL: 'https://gestor-de-tarefas-back-end.onrender.com/lista'
})
export default api