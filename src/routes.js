import express from "express";
import { ClienteController } from './controllers/ClienteController.js';
import { LocalController } from "./controllers/LocalController.js";

const routes = express.Router();

routes.get('/clientes', ClienteController.findAll);
routes.get('/clientes/:id', ClienteController.findByPk);
routes.post('/clientes', ClienteController.create);
routes.put('/clientes/:id', ClienteController.update);
routes.delete('/clientes/:id', ClienteController.delete);

routes.get('/local', LocalController.findAll);
routes.get('/local/:id', LocalController.findByPk);
routes.post('/local', LocalController.create);
routes.put('/local/:id', LocalController.update);
routes.delete('/local/:id', LocalController.delete);


export default routes;