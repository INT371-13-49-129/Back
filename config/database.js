const Sequelize = require("sequelize");
const config = require("./config");
console.log(config);
let sequelize;

sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  port: config.port_db,
  dialect: "mysql",
  dialectOption: {
    ssl: true,
    native: true,
  },
  timezone: "+07:00",
  logging: false,
});

sequelize
  .authenticate()
  .then(async () => {
    await sequelize.sync({ alter: true });
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const db = {};

db.sequelize = sequelize;

db.account = require("../models/account")(sequelize, Sequelize);
db.json_web_token = require("../models/jsonWebToken")(sequelize, Sequelize);

db.account.hasMany(db.json_web_token, {
  foreignKey: "account_id",
});
db.json_web_token.belongsTo(db.account, {
  foreignKey: "account_id",
});


module.exports = db;
