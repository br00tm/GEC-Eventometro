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

Local.init(sequelize);
Evento.init(sequelize);
Avaliacao.init(sequelize);
Palestrante.init(sequelize);
Patrocinador.init(sequelize);
Funcionario.init(sequelize);
Participante.init(sequelize);
Certificado.init(sequelize);
Presenca.init(sequelize);


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

(async () => {
    await sequelize.sync({ force: true });
    
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

    const local3 = await Local.create({
        nome: "Centro de Eventos", 
        uf: "MG", 
        cidade: "Belo Horizonte", 
        bairro: "Savassi", 
        lotacao: 1200
    });

    const local4 = await Local.create({
        nome: "Convention Center", 
        uf: "RS", 
        cidade: "Porto Alegre", 
        bairro: "Centro", 
        lotacao: 1500
    });
    
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

    const participante3 = await Participante.create({
        nome: "Roberto Santos", 
        email: "roberto@email.com", 
        telefone: "(31) 94567-8901", 
        endereco: "Av Paulista, 789"
    });

    const participante4 = await Participante.create({
        nome: "Ana Paula Lima", 
        email: "ana@email.com", 
        telefone: "(51) 92345-6789", 
        endereco: "Rua dos Pampas, 321"
    });
    
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

    const palestrante3 = await Palestrante.create({
        nome: "Prof. Marcos Lima", 
        email: "marcos@email.com", 
        especialidade: "Cloud Computing", 
        nome_palestra: "Cloud Computing para Iniciantes"
    });

    const palestrante4 = await Palestrante.create({
        nome: "Dra. Paula Silva", 
        email: "paula@email.com", 
        especialidade: "Cibersegurança", 
        nome_palestra: "Segurança na Era Digital"
    });
    
    const patrocinador1 = await Patrocinador.create({
        nome: "TechCorp", 
        empresa: "TechCorp Ltda", 
        cnpj: "12.345.678/0001-90", 
        endereco: "Rua da Tecnologia, 789"
    });

    const patrocinador2 = await Patrocinador.create({
        nome: "Inovatech", 
        empresa: "Inovatech SA", 
        cnpj: "98.765.432/0001-21", 
        endereco: "Av da Inovação, 456"
    });

    const patrocinador3 = await Patrocinador.create({
        nome: "CloudTech", 
        empresa: "CloudTech Solutions", 
        cnpj: "45.678.901/0001-34", 
        endereco: "Rua das Nuvens, 123"
    });

    const patrocinador4 = await Patrocinador.create({
        nome: "SecurIT", 
        empresa: "SecurIT Systems", 
        cnpj: "23.456.789/0001-56", 
        endereco: "Av da Segurança, 789"
    });
    
    const funcionario1 = await Funcionario.create({
        nome: "Pedro Almeida", 
        cargo: "Coordenador de Eventos", 
        matricula: "FUNC001", 
        carga_horaria: 40.0
    });

    const funcionario2 = await Funcionario.create({
        nome: "Maria Santos", 
        cargo: "Assistente de Produção", 
        matricula: "FUNC002", 
        carga_horaria: 30.0
    });

    const funcionario3 = await Funcionario.create({
        nome: "José Oliveira", 
        cargo: "Técnico de Suporte", 
        matricula: "FUNC003", 
        carga_horaria: 40.0
    });

    const funcionario4 = await Funcionario.create({
        nome: "Carla Lima", 
        cargo: "Coordenadora de Marketing", 
        matricula: "FUNC004", 
        carga_horaria: 40.0
    });
    
    const evento1 = await Evento.create({
        nome: "Conferência de Tecnologia 2023", 
        data: "2023-11-20", 
        local_id: local1.id
    });
    
    const evento2 = await Evento.create({
        nome: "Workshop de Inovação", 
        data: "2023-12-05", 
        local_id: local2.id
    });

    const evento3 = await Evento.create({
        nome: "Cloud Computing Summit", 
        data: "2023-12-15", 
        local_id: local3.id
    });

    const evento4 = await Evento.create({
        nome: "Security Conference", 
        data: "2023-12-20", 
        local_id: local4.id
    });

    const avaliacao1 = await Avaliacao.create({
        nota: 3.5, 
        comentarios: "Evento excelente!", 
        data_avaliacao: "2023-10-15", 
        participante: "Carlos Silva",
        participante_id: participante1.id,
        evento_id: evento1.id
    });

    const avaliacao2 = await Avaliacao.create({
        nota: 4.0,
        comentarios: "Muito bom o evento!",
        data_avaliacao: "2023-10-16",
        participante: "Maria Santos",
        participante_id: participante2.id,
        evento_id: evento2.id
    });

    const avaliacao3 = await Avaliacao.create({
        nota: 5.0,
        comentarios: "Evento perfeito, superou minhas expectativas!",
        data_avaliacao: "2023-10-17",
        participante: "João Oliveira",
        participante_id: participante3.id,
        evento_id: evento3.id
    });

    const avaliacao4 = await Avaliacao.create({
        nota: 4.8, 
        comentarios: "Conteúdo muito relevante e bem apresentado!", 
        data_avaliacao: "2023-10-18", 
        participante: "Ana Paula Lima",
        participante_id: participante4.id,
        evento_id: evento4.id
    });

    // Atualizar os eventos com as avaliações
    await evento1.update({ avaliacao_id: avaliacao1.id });
    await evento2.update({ avaliacao_id: avaliacao2.id });
    await evento3.update({ avaliacao_id: avaliacao3.id });
    await evento4.update({ avaliacao_id: avaliacao4.id });
    
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

    await sequelize.query(
        `INSERT INTO evento_palestrante (eventoId, palestranteId, createdAt, updatedAt) 
         VALUES (${evento3.id}, ${palestrante3.id}, datetime('now'), datetime('now'))`
    );

    await sequelize.query(
        `INSERT INTO evento_palestrante (eventoId, palestranteId, createdAt, updatedAt) 
         VALUES (${evento4.id}, ${palestrante4.id}, datetime('now'), datetime('now'))`
    );
    
    await sequelize.query(
        `INSERT INTO evento_patrocinador (eventoId, patrocinadorId, createdAt, updatedAt) 
         VALUES (${evento1.id}, ${patrocinador1.id}, datetime('now'), datetime('now'))`
    );

    await sequelize.query(
        `INSERT INTO evento_patrocinador (eventoId, patrocinadorId, createdAt, updatedAt) 
         VALUES (${evento2.id}, ${patrocinador2.id}, datetime('now'), datetime('now'))`
    );

    await sequelize.query(
        `INSERT INTO evento_patrocinador (eventoId, patrocinadorId, createdAt, updatedAt) 
         VALUES (${evento3.id}, ${patrocinador3.id}, datetime('now'), datetime('now'))`
    );

    await sequelize.query(
        `INSERT INTO evento_patrocinador (eventoId, patrocinadorId, createdAt, updatedAt) 
         VALUES (${evento4.id}, ${patrocinador4.id}, datetime('now'), datetime('now'))`
    );
    
    await sequelize.query(
        `INSERT INTO evento_funcionario (eventoId, funcionarioId, createdAt, updatedAt) 
         VALUES (${evento1.id}, ${funcionario1.id}, datetime('now'), datetime('now'))`
    );
    
    await sequelize.query(
        `INSERT INTO evento_funcionario (eventoId, funcionarioId, createdAt, updatedAt) 
         VALUES (${evento2.id}, ${funcionario1.id}, datetime('now'), datetime('now'))`
    );

    await sequelize.query(
        `INSERT INTO evento_funcionario (eventoId, funcionarioId, createdAt, updatedAt) 
         VALUES (${evento3.id}, ${funcionario2.id}, datetime('now'), datetime('now'))`
    );

    await sequelize.query(
        `INSERT INTO evento_funcionario (eventoId, funcionarioId, createdAt, updatedAt) 
         VALUES (${evento4.id}, ${funcionario3.id}, datetime('now'), datetime('now'))`
    );
    
    const certificado1 = await Certificado.create({
        nome: "Certificado de Participação - Conferência de Tecnologia 2023", 
        data_emissao: "2023-11-21", 
        cod_validacao: 123456, 
        tipo_certificado: "Participação",
        descricao: "Certificamos a participação no evento de tecnologia com carga horária de 8 horas",
        participante_id: participante1.id,
        evento_id: evento1.id
    });

    const certificado2 = await Certificado.create({
        nome: "Certificado de Participação - Workshop de Inovação", 
        data_emissao: "2023-12-06", 
        cod_validacao: 234567, 
        tipo_certificado: "Participação",
        descricao: "Certificamos a participação no workshop de inovação com carga horária de 4 horas",
        participante_id: participante2.id,
        evento_id: evento2.id
    });

    const certificado3 = await Certificado.create({
        nome: "Certificado de Participação - Cloud Computing Summit", 
        data_emissao: "2023-12-16", 
        cod_validacao: 345678, 
        tipo_certificado: "Participação",
        descricao: "Certificamos a participação no summit de cloud computing com carga horária de 6 horas",
        participante_id: participante3.id,
        evento_id: evento3.id
    });

    const certificado4 = await Certificado.create({
        nome: "Certificado de Participação - Security Conference", 
        data_emissao: "2023-12-21", 
        cod_validacao: 456789, 
        tipo_certificado: "Participação",
        descricao: "Certificamos a participação na conferência de segurança com carga horária de 8 horas",
        participante_id: participante4.id,
        evento_id: evento4.id
    });
    
    const presenca1 = await Presenca.create({
        data: "2023-11-20", 
        horario: "09:00", 
        tipo_presenca: "Entrada", 
        modo_registro: "QR Code",
        participante_id: participante1.id,
        evento_id: "1"
    });

    const presenca2 = await Presenca.create({
        data: "2023-12-05", 
        horario: "14:00", 
        tipo_presenca: "Entrada", 
        modo_registro: "QR Code",
        participante_id: participante2.id,
        evento_id: "2"
    });

    const presenca3 = await Presenca.create({
        data: "2023-12-15", 
        horario: "10:00", 
        tipo_presenca: "Entrada", 
        modo_registro: "QR Code",
        participante_id: participante3.id,
        evento_id: "3"

    });

    const presenca4 = await Presenca.create({
        data: "2023-12-20", 
        horario: "13:00", 
        tipo_presenca: "Entrada", 
        modo_registro: "QR Code",
        participante_id: participante4.id,
        evento_id: "4"
    });
    const presenca5 = await Presenca.create({
        data: "2023-11-20", 
        horario: "09:00", 
        tipo_presenca: "Entrada", 
        modo_registro: "QR Code",
        participante_id: participante1.id,
        evento_id: "2"
    });
    
    console.log("Banco de dados inicializado com sucesso!");
})();

export default sequelize;