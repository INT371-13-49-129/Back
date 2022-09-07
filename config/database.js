const Sequelize = require("sequelize");
const config = require("./config");
console.log(config);
let sequelize;

sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  port: config.port_db,
  dialect: "mysql",
  dialectOption: {
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
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
db.post = require("../models/post")(sequelize, Sequelize);
db.comment = require("../models/comment")(sequelize, Sequelize);
db.tag = require("../models/tag")(sequelize, Sequelize);
db.post_tag = require("../models/postTag")(sequelize, Sequelize);
db.emotion = require("../models/emotion")(sequelize, Sequelize);
db.log_edit = require("../models/logEdit")(sequelize, Sequelize);
db.message_connect = require("../models/messageConnect")(sequelize, Sequelize);
db.message = require("../models/message")(sequelize, Sequelize);

db.account.hasMany(db.json_web_token, {
  foreignKey: "account_id",
});
db.json_web_token.belongsTo(db.account, {
  foreignKey: "account_id",
});

db.account.hasMany(db.post, {
  foreignKey: "account_id",
});
db.post.belongsTo(db.account, {
  foreignKey: "account_id",
});

db.post.hasMany(db.post, {
  as: 'posts',
  foreignKey: "refer_post_id",
});
db.post.belongsTo(db.post, {
  as: 'refer_post',
  foreignKey: "refer_post_id",
});

db.account.hasMany(db.comment, {
  foreignKey: "account_id",
});
db.comment.belongsTo(db.account, {
  foreignKey: "account_id",
});

db.post.hasMany(db.comment, {
  foreignKey: "post_id",
});
db.comment.belongsTo(db.post, {
  foreignKey: "post_id",
});

db.comment.hasMany(db.comment, {
  foreignKey: "reply_comment_id",
});
db.comment.belongsTo(db.comment, {
  foreignKey: "reply_comment_id",
});

db.post.hasMany(db.post_tag, {
  foreignKey: "post_id",
});
db.post_tag.belongsTo(db.post, {
  foreignKey: "post_id",
});

db.tag.hasMany(db.post_tag, {
  foreignKey: "tag_id",
});
db.post_tag.belongsTo(db.tag, {
  foreignKey: "tag_id",
});

db.account.hasMany(db.emotion, {
  foreignKey: "account_id",
});
db.emotion.belongsTo(db.account, {
  foreignKey: "account_id",
});

db.post.hasMany(db.emotion, {
  foreignKey: "post_id",
});
db.emotion.belongsTo(db.post, {
  foreignKey: "post_id",
});

db.comment.hasMany(db.emotion, {
  foreignKey: "comment_id",
});
db.emotion.belongsTo(db.comment, {
  foreignKey: "comment_id",
});

db.post.hasMany(db.log_edit, {
  foreignKey: "post_id",
});
db.log_edit.belongsTo(db.post, {
  foreignKey: "post_id",
});

db.comment.hasMany(db.log_edit, {
  foreignKey: "comment_id",
});
db.log_edit.belongsTo(db.comment, {
  foreignKey: "comment_id",
});

db.account.hasMany(db.message_connect, {
  foreignKey: "account_id_1",
});
db.message_connect.belongsTo(db.account, {
  as: 'account_1',
  foreignKey: "account_id_1",
});

db.account.hasMany(db.message_connect, {
  foreignKey: "account_id_2",
});
db.message_connect.belongsTo(db.account, {
  as: 'account_2',
  foreignKey: "account_id_2",
});

db.message_connect.hasMany(db.message, {
  foreignKey: "message_connect_id",
});
db.message.belongsTo(db.message_connect, {
  foreignKey: "message_connect_id",
});

db.account.hasMany(db.message, {
  foreignKey: "account_id",
});
db.message.belongsTo(db.account, {
  foreignKey: "account_id",
});

module.exports = db;
