import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001', // URL da API (json-server ou sua API)
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador de requisições para adicionar tokens de autorização, se necessário
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador de respostas para tratar erros comuns
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Personalizar tratamento de erros
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('Erro na resposta da API:', error.response.status, error.response.data);
      
      // Tratamento específico para erros de autenticação
      if (error.response.status === 401) {
        // Lógica de redirecionamento ou renovação de token
        console.log('Erro de autenticação, redirecionando...');
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Sem resposta da API:', error.request);
    } else {
      // Algo aconteceu durante a requisição
      console.error('Erro na configuração da requisição:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;