const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { account,sequelize } = database;

exports.createAccount = (data) => {
    try {
      return account.create(data);
    } catch (error) {
      throw error;
    }
};

exports.getAccountByUsername = (username) => {
  try {
    return account.findOne({
      where: {
        username: username,
        is_delete: false
      }
    });
  } catch (error) {
    throw error;
  }
};

exports.getAccountByEmail = (email) => {
  try {
    return account.findOne({
      where: {
        email: email,
        is_delete: false
      }
    });
  } catch (error) {
    throw error;
  }
};

exports.getAccountByAccountId = ( account_id ) => {
  try {
    return account.findOne({
      where: {
        account_id: account_id,
        is_delete: false
      }
    });
  } catch (error) {
    throw error;
  }
};

exports.updateAccount = (account_id,payload) => {
  try {
    return account.update(
      payload,
      {
        where: {
          account_id,
          is_delete: false,
        },
      }
    )
  } catch (e) {
    throw e
  }
}
