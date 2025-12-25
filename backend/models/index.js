const sequelize = require('../config/database');
const fs = require('fs');
const path = require('path');

const db = {};

// Đọc tất cả các file model trong thư mục models
const files = fs.readdirSync(__dirname).filter(file => {
  return file.indexOf('.') !== 0 && file !== 'index.js' && file.slice(-3) === '.js';
});

// Load tất cả các model
files.forEach(file => {
  const model = require(path.join(__dirname, file))(sequelize);
  db[model.name] = model;
});

// Thiết lập associations cho tất cả models
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = require('sequelize');

module.exports = db;



