// Configuração do banco de dados no ambiente de produção
export const databaseConfig = {
  dialect: 'postgres',
  host: 'dpg-d11cqdidbo4c739tgfog-a.oregon-postgres.render.com',
  username: 'gec_eventometro_user',
  password: '9DDR5TvHQK17R7UZeTR7MblvzetRktr7',
  database: 'gec_eventometro',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  },
  dialectOptions: {
    ssl: true
  }
};
