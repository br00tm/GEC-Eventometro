import express from "express";
import { LocalController } from "./controllers/LocalController.js";
import { EventoController } from "./controllers/EventoController.js";
import { AvaliacaoController } from "./controllers/AvaliacaoController.js";
import { CertificadoController } from "./controllers/CertificadoController.js";
import { PresencaController } from "./controllers/PresencaController.js";
import { ParticipanteController } from "./controllers/ParticipanteController.js";
import { PalestranteController } from "./controllers/PalestranteController.js";
import { PatrocinadorController } from "./controllers/PatrocinadorController.js";
import { FuncionarioController } from "./controllers/FuncionarioController.js";

const routes = express.Router();

// Rotas para Local
routes.get('/local', LocalController.findAll);
routes.get('/local/:id', LocalController.findByPk);
routes.post('/local', LocalController.create);
routes.put('/local/:id', LocalController.update);
routes.delete('/local/:id', LocalController.delete);

// Rotas para Evento
routes.get('/evento', EventoController.findAll);
routes.get('/evento/:id', EventoController.findByPk);
routes.post('/evento', EventoController.create);
routes.put('/evento/:id', EventoController.update);
routes.delete('/evento/:id', EventoController.delete);

// Rotas para Avaliacao
routes.get('/avaliacao', AvaliacaoController.findAll);
routes.get('/avaliacao/:id', AvaliacaoController.findByPk);
routes.post('/avaliacao', AvaliacaoController.create);
routes.put('/avaliacao/:id', AvaliacaoController.update);
routes.delete('/avaliacao/:id', AvaliacaoController.delete);

// Rotas para Certificado
routes.get('/certificado', CertificadoController.findAll);
routes.get('/certificado/:id', CertificadoController.findByPk);
routes.post('/certificado', CertificadoController.create);
routes.put('/certificado/:id', CertificadoController.update);
routes.delete('/certificado/:id', CertificadoController.delete);

// Rotas para Presenca
routes.get('/presenca', PresencaController.findAll);
routes.get('/presenca/:id', PresencaController.findByPk);
routes.post('/presenca', PresencaController.create);
routes.put('/presenca/:id', PresencaController.update);
routes.delete('/presenca/:id', PresencaController.delete);

// Rotas para Participante
routes.get('/participante', ParticipanteController.findAll);
routes.get('/participante/:id', ParticipanteController.findByPk);
routes.post('/participante', ParticipanteController.create);
routes.put('/participante/:id', ParticipanteController.update);
routes.delete('/participante/:id', ParticipanteController.delete);

// Rotas para Palestrante
routes.get('/palestrante', PalestranteController.findAll);
routes.get('/palestrante/:id', PalestranteController.findByPk);
routes.post('/palestrante', PalestranteController.create);
routes.put('/palestrante/:id', PalestranteController.update);
routes.delete('/palestrante/:id', PalestranteController.delete);

// Rotas para Patrocinador
routes.get('/patrocinador', PatrocinadorController.findAll);
routes.get('/patrocinador/:id', PatrocinadorController.findByPk);
routes.post('/patrocinador', PatrocinadorController.create);
routes.put('/patrocinador/:id', PatrocinadorController.update);
routes.delete('/patrocinador/:id', PatrocinadorController.delete);

// Rotas para Funcionario
routes.get('/funcionario', FuncionarioController.findAll);
routes.get('/funcionario/:id', FuncionarioController.findByPk);
routes.post('/funcionario', FuncionarioController.create);
routes.put('/funcionario/:id', FuncionarioController.update);
routes.delete('/funcionario/:id', FuncionarioController.delete);

export default routes;