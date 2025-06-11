import express from "express";
import routes from './routes.js';
import errorHandler from '../src/_middleware/error-handler.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Para obter o __dirname no ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importando configuração e estabelecimento da conexão com o banco de dados
import sequelize from './config/database-connection.js';

const app = express();

// Configuração CORS aprimorada
app.use(function (req, res, next) {
    // Permitir origens específicas ou todas com '*'
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Métodos HTTP permitidos
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
    // Cabeçalhos permitidos (incluindo authorization)
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, authorization, Authorization');
    
    // Permitir cookies
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    // Lidar com requisições OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
});

// Limite máximo de request aumentado
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Configuração para servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(routes);
app.use(errorHandler); // Manipulador de erro global (error handler)

app.listen(3333);