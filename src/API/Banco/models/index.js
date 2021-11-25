require('dotenv').config();
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(
    'pokemon',
    'root',
    '',
    {
        host: '127.0.0.1',
        port: '3306',
        dialect: 'mysql',
    }
);

fs.readdirSync(path.join(__dirname, ''))
    .filter(
        (file) =>
            file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
    .forEach((file) => {
        var model = require(path.join(__dirname, '', file));
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;