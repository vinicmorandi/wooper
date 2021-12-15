const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Usuarios extends Model {
        // 
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
            tableName: 'usuarios',
            timestamps: false
        },
    );
    return Usuarios;
};