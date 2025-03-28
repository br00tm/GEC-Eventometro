import Sequelize from 'sequelize';
import { Local } from '../models/Local.js';
import { Evento } from '../models/Evento.js';
import { Avaliacao } from '../models/Avaliacao.js';
import { Palestrante } from '../models/Palestrante.js';
import { Patrocinador } from '../models/Patrocinador.js';
import { Funcionario } from '../models/Funcionario.js';
import { Participante } from '../models/Participante.js';
import { Certificado } from '../models/Certificado.js';
import { Presenca } from '../models/Presenca.js';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

// Inicialização dos modelos
Local.init(sequelize);
Evento.init(sequelize);
Avaliacao.init(sequelize);
Palestrante.init(sequelize);
Patrocinador.init(sequelize);
Funcionario.init(sequelize);
Participante.init(sequelize);
Certificado.init(sequelize);
Presenca.init(sequelize);

// Associações entre os modelos
const models = {
    Local,
    Evento,
    Avaliacao,
    Palestrante,
    Patrocinador,
    Funcionario,
    Participante,
    Certificado,
    Presenca
};

Object.values(models)
    .filter(model => typeof model.associate === 'function')
    .forEach(model => model.associate(models));

// Dados de exemplo
(async () => {
    await sequelize.sync({ force: true });
    
    // Criar locais
    const local1 = await Local.create({
        nome: "Centro de Convenções", 
        uf: "SP", 
        cidade: "São Paulo", 
        bairro: "Centro", 
        lotacao: 1000
    });
    
    const local2 = await Local.create({
        nome: "Teatro Municipal", 
        uf: "RJ", 
        cidade: "Rio de Janeiro", 
        bairro: "Centro", 
        lotacao: 800
    });
    
    // Criar participantes
    const participante1 = await Participante.create({
        nome: "Carlos Silva", 
        email: "carlos@email.com", 
        telefone: "(11) 98765-4321", 
        endereco: "Rua das Flores, 123"
    });
    
    const participante2 = await Participante.create({
        nome: "Mariana Oliveira", 
        email: "mariana@email.com", 
        telefone: "(21) 91234-5678", 
        endereco: "Av Atlântica, 456"
    });
    
    // Criar palestrantes
    const palestrante1 = await Palestrante.create({
        nome: "Dr. João Santos", 
        email: "joao@email.com", 
        especialidade: "Inteligência Artificial", 
        nome_palestra: "O Futuro da IA"
    });
    
    const palestrante2 = await Palestrante.create({
        nome: "Dra. Ana Costa", 
        email: "ana@email.com", 
        especialidade: "Blockchain", 
        nome_palestra: "Aplicações de Blockchain na Indústria"
    });
    
    // Criar patrocinadores
    const patrocinador1 = await Patrocinador.create({
        nome: "TechCorp", 
        empresa: "TechCorp Ltda", 
        cnpj: "12.345.678/0001-90", 
        endereco: "Rua da Tecnologia, 789"
    });
    
    // Criar funcionários
    const funcionario1 = await Funcionario.create({
        nome: "Pedro Almeida", 
        cargo: "Coordenador de Eventos", 
        matricula: "FUNC001", 
        carga_horaria: 40.0
    });
    
    // Criar avaliações
    const avaliacao1 = await Avaliacao.create({
        nota: 9.5, 
        comentarios: "Evento excelente!", 
        data_avaliacao: "2023-10-15", 
        participante: "Carlos Silva",
        participante_id: participante1.id
    });
    
    // Criar eventos
    const evento1 = await Evento.create({
        nome: "Conferência de Tecnologia 2023", 
        data: "2023-11-20", 
        local_id: local1.id, 
        avaliacao_id: avaliacao1.id
    });
    
    const evento2 = await Evento.create({
        nome: "Workshop de Inovação", 
        data: "2023-12-05", 
        local_id: local2.id
    });
    
    // Associar palestrantes a eventos - usando a tabela de junção
    await sequelize.query(
        `INSERT INTO evento_palestrante (eventoId, palestranteId, createdAt, updatedAt) 
         VALUES (${evento1.id}, ${palestrante1.id}, datetime('now'), datetime('now'))`
    );
    
    await sequelize.query(
        `INSERT INTO evento_palestrante (eventoId, palestranteId, createdAt, updatedAt) 
         VALUES (${evento1.id}, ${palestrante2.id}, datetime('now'), datetime('now'))`
    );
    
    await sequelize.query(
        `INSERT INTO evento_palestrante (eventoId, palestranteId, createdAt, updatedAt) 
         VALUES (${evento2.id}, ${palestrante1.id}, datetime('now'), datetime('now'))`
    );
    
    // Associar patrocinadores a eventos - usando a tabela de junção
    await sequelize.query(
        `INSERT INTO evento_patrocinador (eventoId, patrocinadorId, createdAt, updatedAt) 
         VALUES (${evento1.id}, ${patrocinador1.id}, datetime('now'), datetime('now'))`
    );
    
    // Associar funcionários a eventos - usando a tabela de junção
    await sequelize.query(
        `INSERT INTO evento_funcionario (eventoId, funcionarioId, createdAt, updatedAt) 
         VALUES (${evento1.id}, ${funcionario1.id}, datetime('now'), datetime('now'))`
    );
    
    await sequelize.query(
        `INSERT INTO evento_funcionario (eventoId, funcionarioId, createdAt, updatedAt) 
         VALUES (${evento2.id}, ${funcionario1.id}, datetime('now'), datetime('now'))`
    );
    
    // Criar certificados
    const certificado1 = await Certificado.create({
        nome: "Certificado de Participação - Conferência de Tecnologia 2023", 
        data_emissao: "2023-11-21", 
        cod_validacao: 123456, 
        tipo_certificado: "Participação",
        participante_id: participante1.id
    });
    
    // Criar presenças
    const presenca1 = await Presenca.create({
        data: "2023-11-20", 
        horario: "09:00", 
        tipo_presenca: "Entrada", 
        modo_registro: "QR Code",
        participante_id: participante1.id
    });
    
    console.log("Banco de dados inicializado com sucesso!");
})();

export default sequelize;