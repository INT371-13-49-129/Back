module.exports = (sequelize, Sequelize) => {
  const mood = sequelize.define(
    "mood",
    {
      mood_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: Sequelize.STRING,
      color: Sequelize.STRING,
      icon: Sequelize.STRING,
      mood_level: Sequelize.INTEGER,
      is_delete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    }
  );
  return mood;
};
