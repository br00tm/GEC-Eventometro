export const databaseConfig = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'gec-eventometro',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  }
};
