const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Usuarios extends Model {
        // Isso aqui a gente vê dps
    }
    Usuarios.init(
        {
            // Campos
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nome: DataTypes.STRING,
            email: DataTypes.STRING,
            senha: DataTypes.STRING,
            times: DataTypes.STRING,
            recorde: DataTypes.STRING,
            elo: DataTypes.INTEGER,
            tipo: DataTypes.INTEGER
        },
        {
            // Opções
            sequelize,
            modelName: 'Usuarios',
            tableName: 'usuarios'
        },
    );
    return Usuarios;
};