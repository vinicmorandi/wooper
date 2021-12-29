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
            times: DataTypes.TEXT('medium'),
            elo: DataTypes.INTEGER,
            tipo: DataTypes.INTEGER,
            vitorias: DataTypes.INTEGER,
            derrotas: DataTypes.INTEGER
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