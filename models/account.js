module.exports = (sequelize, Sequelize) => {
  const Account = sequelize.define(
    "account",
    {
      account_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: Sequelize.STRING,
      name: Sequelize.STRING,
      password: Sequelize.STRING,
      email: {
        type: Sequelize.STRING,
        validate: { isEmail: true },
      },
      gender: {
        type: Sequelize.ENUM,
        allowNull: false,
        defaultValue: "Unspecified",
        values: ["Male", "Female", "Unspecified"],
      },
      bio: Sequelize.TEXT,
      image_url: Sequelize.STRING,
      cover_image_url: Sequelize.STRING,
      date_of_birth: Sequelize.DATEONLY,
      role: {
        type: Sequelize.ENUM,
        allowNull: false,
        defaultValue: "Member",
        values: ["Member", "Psychologist"],
      },
      status: {
        type: Sequelize.ENUM,
        allowNull: false,
        defaultValue: "Waiting",
        values: ["Confirmed", "Waiting"],
      },
      file_approve: Sequelize.JSON,
      approve: {
        type: Sequelize.ENUM,
        defaultValue: null,
        values: ["Approve", "Waiting", "Reject"],
      },
      is_listener: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
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
  return Account;
};
