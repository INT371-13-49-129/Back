module.exports = (sequelize, Sequelize) => {
    const Emotion = sequelize.define(
      "emotion",
      {
        emotion_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        is_emotion: Sequelize.BOOLEAN,
        is_delete: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        }
      },
      {
        freezeTableName: true,
        underscored: true,
        timestamps: true,
      }
    );
    return Emotion;
  };
  