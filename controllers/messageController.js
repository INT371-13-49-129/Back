const messageService = require("../service/messageService");
const messageConnectService = require("../service/messageConnectService");
const accountService = require("../service/accountService");
const { statusCode, errorResponse } = require("../utils/errorResponse");
const database = require("../config/database");
const { sequelize } = database;

exports.createMessageConnect = async (req, res) => {
  const { account_id } = req.jwt;
  const { account_id_2 } = req.body;
  try {
    const account = await accountService.getAccountByAccountId(account_id_2);
    if (!account)
      return errorResponse(res, {
        statusResponse: 404,
        statusCode: statusCode(2003),
        errorMessage: `Account Id(${account_id_2}) Does not exist`,
      });
    const messageConnect =
      await messageConnectService.getMessageConnectByAccountId1AndAccountId2({
        account_id_1: account_id,
        account_id_2,
      });
    if (messageConnect)
      return errorResponse(res, {
        statusResponse: 400,
        statusCode: statusCode(5001),
        errorMessage: `Message Connect Account Id(${account_id_2}) Already exists`,
      });
    await messageConnectService.createMessageConnect({
      account_id_1: account_id,
      account_id_2,
    });
    res.status(200).send({
      status: "success",
    });
  } catch (error) {
    console.log(error);
    errorResponse(res, {
      statusResponse: 500,
      statusCode: statusCode(1001),
      errorMessage: error,
    });
  }
};

exports.getMessageConnect = async (req, res) => {
  const { account_id } = req.jwt;
  const { account_id_2 } = req.params;
  try {
    const account = await accountService.getAccountByAccountId(account_id_2);
    if (!account)
      return errorResponse(res, {
        statusResponse: 404,
        statusCode: statusCode(2003),
        errorMessage: `Account Id(${account_id_2}) Does not exist`,
      });
    let messageConnect =
      await messageConnectService.getMessageConnectByAccountId1AndAccountId2({
        account_id_1: account_id,
        account_id_2,
      });
    if (!messageConnect) {
      await messageConnectService.createMessageConnect({
        account_id_1: account_id,
        account_id_2,
      });
      messageConnect =
        await messageConnectService.getMessageConnectByAccountId1AndAccountId2({
          account_id_1: account_id,
          account_id_2,
        });
    }
    res.status(200).send({
      messageConnect,
    });
  } catch (error) {
    console.log(error);
    errorResponse(res, {
      statusResponse: 500,
      statusCode: statusCode(1001),
      errorMessage: error,
    });
  }
};

exports.createMessage = async (req, res) => {
  const { account_id } = req.jwt;
  const { account_id_2, message_connect_id, text } = req.body;
  try {
    const account = await accountService.getAccountByAccountId(account_id_2);
    if (!account)
      return errorResponse(res, {
        statusResponse: 404,
        statusCode: statusCode(2003),
        errorMessage: `Account Id(${account_id_2}) Does not exist`,
      });
    const messageConnect =
      await messageConnectService.getMessageConnectByMessageConnectId(
        message_connect_id
      );
    if (!messageConnect)
      return errorResponse(res, {
        statusResponse: 400,
        statusCode: statusCode(5002),
        errorMessage: `Message Connect Id(${message_connect_id}) Does not exist`,
      });
    if (
      messageConnect.account_1.account_id != account_id &&
      messageConnect.account_2.account_id != account_id
    )
      return errorResponse(res, {
        statusResponse: 401,
        statusCode: statusCode(2007),
        errorMessage: `Account Id(${account_id}) don't have permission to Create Message Connect Id(${message_connect_id})`,
      });
    if (
      messageConnect.account_1.account_id != account_id_2 &&
      messageConnect.account_2.account_id != account_id_2
    )
      return errorResponse(res, {
        statusResponse: 401,
        statusCode: statusCode(2007),
        errorMessage: `Account Id(${account_id_2}) don't have permission to Create Message Connect Id(${message_connect_id})`,
      });
    await messageService.createMessage({
      message_connect_id,
      account_id,
      text,
    });
    await messageConnectService.updateMessageConnect(message_connect_id, {
      last_messages: sequelize.fn("NOW"),
    });
    res.io.emit("message_connect_id_" + message_connect_id, message_connect_id )
    res.io.emit("message_account_id_" + account_id, account_id )
    res.io.emit("message_account_id_" + account_id_2, account_id_2 )
    res.status(200).send({
      status: "success",
    });
  } catch (error) {
    console.log(error);
    errorResponse(res, {
      statusResponse: 500,
      statusCode: statusCode(1001),
      errorMessage: error,
    });
  }
};

exports.getAllMessageConnect = async (req, res) => {
  const { account_id } = req.jwt;
  try {
    let messageConnects =
      await messageConnectService.getAllMessageConnectByAccountId(account_id);
    res.status(200).send({
      messageConnects,
    });
  } catch (error) {
    console.log(error);
    errorResponse(res, {
      statusResponse: 500,
      statusCode: statusCode(1001),
      errorMessage: error,
    });
  }
};

exports.readMessage = async (req, res) => {
  const { account_id } = req.jwt;
  const { message_id } = req.body;
  try {
    const message = await messageService.getMessage(message_id);
    if (
      message &&
      ((message.message_connect.account_id_1 == account_id &&
        message.message_connect.account_id_1 != message.account_id) ||
        (message.message_connect.account_id_2 == account_id &&
          message.message_connect.account_id_2 != message.account_id))
    ) {
      await messageService.updateMessage(message_id, {
        is_read: true,
      });
      res.io.emit("message_account_id_" + account_id, account_id )
    }
    res.status(200).send({
      status: "success",
    });
  } catch (error) {
    console.log(error);
    errorResponse(res, {
      statusResponse: 500,
      statusCode: statusCode(1001),
      errorMessage: error,
    });
  }
};
