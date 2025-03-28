import express from "express";
import { LocalController } from "./controllers/LocalController.js";

const routes = express.Router();

routes.get('/local', LocalController.findAll);
routes.get('/local/:id', LocalController.findByPk);
routes.post('/local', LocalController.create);
routes.put('/local/:id', LocalController.update);
routes.delete('/local/:id', LocalController.delete);


export default routes;