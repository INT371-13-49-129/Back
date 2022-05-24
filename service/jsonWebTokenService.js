const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { json_web_token,sequelize } = database;

exports.createJsonWebToken = (data) => {
    try {
      return json_web_token.create(data);
    } catch (error) {
      throw error;
    }
};

exports.getJsonWebTokenByTokenAndTokenTypeAndAccountId = ({ token,token_type,account_id }) => {
    try {
      return json_web_token.findOne({
        where: {
          token: token,
          token_type: token_type,
          account_id: account_id,
          is_delete: false
        }
      });
    } catch (error) {
      throw error;
    }
};

exports.updateJsonWebToken = (json_web_token_id,payload) => {
    try {
      return json_web_token.update(
        payload,
        {
          where: {
            json_web_token_id,
            is_delete: false,
          },
        }
      )
    } catch (e) {
      throw e
    }
}

exports.updateJsonWebTokenByTokenTypeAndAccountId = ({ token_type,account_id },payload) => {
    try {
      return json_web_token.update(
        payload,
        {
        where: {
            token_type: token_type,
            account_id: account_id,
            is_delete: false
        }
        }
      );
    } catch (error) {
      throw error;
    }
};