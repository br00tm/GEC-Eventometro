import Sequelize from 'sequelize';
import { databaseConfig } from './database.js';

// Importação dos modelos
import { Local } from '../models/Local.js';
import { Evento } from '../models/Evento.js';
import { Participante } from '../models/Participante.js';
import { Palestrante } from '../models/Palestrante.js';
import { Patrocinador } from '../models/Patrocinador.js';
import { Funcionario } from '../models/Funcionario.js';
import { Avaliacao } from '../models/Avaliacao.js';
import { Certificado } from '../models/Certificado.js';
import { Presenca } from '../models/Presenca.js';

// Configuração da conexão com o banco de dados
const sequelize = new Sequelize(databaseConfig);

// Inicialização dos modelos
Local.init(sequelize);
Evento.init(sequelize);
Participante.init(sequelize);
Palestrante.init(sequelize);
Patrocinador.init(sequelize);
Funcionario.init(sequelize);
Avaliacao.init(sequelize);
Certificado.init(sequelize);
Presenca.init(sequelize);

// Definição das associações entre os modelos
const models = {
    Local,
    Evento,
    Participante,
    Palestrante,
    Patrocinador,
    Funcionario,
    Avaliacao,
    Certificado,
    Presenca
};

// Executa o método associate de cada modelo, se existir
Object.values(models)
    .filter(model => typeof model.associate === 'function')
    .forEach(model => model.associate(models));

// Função para inicializar o banco de dados com dados de exemplo
// Esta função pode ser comentada em ambiente de produção
databaseInserts();

async function databaseInserts() {
    try {
        await sequelize.sync({ force: true }); // force:true recria as tabelas mesmo se já existirem
        console.log('Banco de dados sincronizado com sucesso!');

        // // Criação de dados de exemplo
        // const local1 = await Local.create({
        //     nome: "Centro de Convenções",
        //     uf: "SP",
        //     cidade: "São Paulo",
        //     bairro: "Centro",
        //     lotacao: 1000
        // });

        // const local2 = await Local.create({
        //     nome: "Teatro Municipal",
        //     uf: "RJ",
        //     cidade: "Rio de Janeiro",
        //     bairro: "Centro",
        //     lotacao: 800
        // });

        // const local3 = await Local.create({
        //     nome: "Centro de Eventos",
        //     uf: "MG",
        //     cidade: "Belo Horizonte",
        //     bairro: "Savassi",
        //     lotacao: 1200
        // });

        // const participante1 = await Participante.create({
        //     nome: "Carlos Silva",
        //     email: "carlos@email.com",
        //     telefone: "(11) 98765-4321",
        //     endereco: "Rua das Flores, 123"
        // });

        // const participante2 = await Participante.create({
        //     nome: "Mariana Oliveira",
        //     email: "mariana@email.com",
        //     telefone: "(21) 91234-5678",
        //     endereco: "Av Atlântica, 456"
        // });

        // const palestrante1 = await Palestrante.create({
        //     nome: "Dr. João Santos",
        //     email: "joao@email.com",
        //     especialidade: "Inteligência Artificial",
        //     nome_palestra: "O Futuro da IA"
        // });

        // const palestrante2 = await Palestrante.create({
        //     nome: "Dra. Ana Costa",
        //     email: "ana@email.com",
        //     especialidade: "Blockchain",
        //     nome_palestra: "Aplicações de Blockchain na Indústria"
        // });

        // const patrocinador1 = await Patrocinador.create({
        //     nome: "TechCorp",
        //     empresa: "TechCorp Ltda",
        //     cnpj: "12.345.678/0001-90",
        //     endereco: "Rua da Tecnologia, 789"
        // });

        // const patrocinador2 = await Patrocinador.create({
        //     nome: "Inovatech",
        //     empresa: "Inovatech SA",
        //     cnpj: "98.765.432/0001-21",
        //     endereco: "Av da Inovação, 456"
        // });

        // const funcionario1 = await Funcionario.create({
        //     nome: "Pedro Almeida",
        //     cargo: "Coordenador de Eventos",
        //     matricula: "FUNC001",
        //     carga_horaria: 40.0
        // });

        // const funcionario2 = await Funcionario.create({
        //     nome: "Maria Santos",
        //     cargo: "Assistente de Produção",
        //     matricula: "FUNC002",
        //     carga_horaria: 30.0
        // });

        // // Eventos
        // const evento1 = await Evento.create({
        //     nome: "Conferência de Tecnologia 2023",
        //     data: "2023-11-20",
        //     local_id: local1.id
        // });

        // const evento2 = await Evento.create({
        //     nome: "Workshop de Inovação",
        //     data: "2023-12-05",
        //     local_id: local2.id
        // });

        // const evento3 = await Evento.create({
        //     nome: "Hackathon de Desenvolvimento",
        //     data: "2024-02-15",
        //     local_id: local3.id
        // });

        // // Certificados
        // const certificado1 = await Certificado.create({
        //     nome: "Certificado de Participação - Conferência de Tecnologia 2023",
        //     data_emissao: "2023-11-21",
        //     cod_validacao: 123456,
        //     tipo_certificado: "Participação",
        //     participante_id: participante1.id,
        //     evento_id: evento1.id
        // });

        // const certificado2 = await Certificado.create({
        //     nome: "Certificado de Participação - Workshop de Inovação",
        //     data_emissao: "2023-12-06",
        //     cod_validacao: 234567,
        //     tipo_certificado: "Participação",
        //     participante_id: participante2.id,
        //     evento_id: evento2.id
        // });

        // // Presenças
        // const presenca1 = await Presenca.create({
        //     data: "2023-11-20",
        //     horario: "09:00",
        //     tipo_presenca: "Entrada",
        //     modo_registro: "QR Code",
        //     participante_id: participante1.id,
        //     evento_id: evento1.id
        // });

        // const presenca2 = await Presenca.create({
        //     data: "2023-12-05",
        //     horario: "14:00",
        //     tipo_presenca: "Entrada",
        //     modo_registro: "QR Code",
        //     participante_id: participante2.id,
        //     evento_id: evento2.id
        // });

        // // Avaliações
        // const avaliacao1 = await Avaliacao.create({
        //     nota: 4.0, 
        //     comentarios: "Evento excelente, muito bem organizado!",
        //     data_avaliacao: "2023-11-21",
        //     participante: "Carlos Silva",
        //     participante_id: participante1.id,
        //     evento_id: evento1.id
        // });

        // const avaliacao2 = await Avaliacao.create({
        //     nota: 5.0,
        //     comentarios: "Workshop incrível, aprendi muito!",
        //     data_avaliacao: "2023-12-06",
        //     participante: "Mariana Oliveira",
        //     participante_id: participante2.id,
        //     evento_id: evento2.id
        // });


    } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
    }
}

export default sequelize;