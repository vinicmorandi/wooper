const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Pokemons extends Model {
        // 
    }
    Pokemons.init(
        {
            // Campos
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nome: DataTypes.STRING,
            tipo1: DataTypes.INTEGER,
            tipo2: DataTypes.INTEGER,
            move1: DataTypes.INTEGER,
            move2: DataTypes.INTEGER,
            move3: DataTypes.INTEGER,
            move4: DataTypes.INTEGER,
            statHp: DataTypes.INTEGER,
            statAtk: DataTypes.INTEGER,
            statDef: DataTypes.INTEGER,
            statSpa: DataTypes.INTEGER,
            statSpd: DataTypes.INTEGER,
            statSpe: DataTypes.INTEGER,
            spriteFrente: DataTypes.STRING,
            spriteCostas: DataTypes.STRING
        },
        {
            // Opções
            sequelize,
            modelName: 'Pokemons',
            tableName: 'Pokemons',
            timestamps: false
        },
    );
    return Pokemons;
};