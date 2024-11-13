import axios from 'axios'

const api = axios.create({
    baseURL: 'https://gestor-de-tarefas-back-end-3.onrender.com/'
})
export default api