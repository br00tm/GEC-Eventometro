import express from "express";
import routes from './routes.js';
import errorHandler from './_middleware/error-handler.js';

import './config/database.js';

const app = express();

app.use(express.json()); // possibilitar recuperação do corpo da solicitação (request.body) como um objeto JSON
app.use(routes); // especificar as rotas da API REST

// Middleware de tratamento de erros global
app.use(errorHandler);

app.listen(3333, () => console.log("Server is running on PORT 3333")); //  iniciar um socket que escuta as conexões em um caminho fornecido