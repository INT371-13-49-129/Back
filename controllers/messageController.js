const messageService = require("../service/messageService");
const messageConnectService = require("../service/messageConnectService");
const accountService = require("../service/accountService");
const requestService = require("../service/requestService");
const { statusCode, errorResponse } = require("../utils/errorResponse");
const database = require("../config/database");
const e = require("cors");
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

exports.getMessageConnectPagination = async (req, res) => {
  const { account_id } = req.jwt;
  const { account_id_2 } = req.params;
  let { limit = 20, page = 1 } = req.query;
  limit = parseInt(limit);
  page = parseInt(page);
  let offset = page === 1 ? 0 : (page - 1) * limit;
  try {
    const account = await accountService.getAccountByAccountId(account_id_2);
    if (!account)
      return errorResponse(res, {
        statusResponse: 404,
        statusCode: statusCode(2003),
        errorMessage: `Account Id(${account_id_2}) Does not exist`,
      });
    let messageConnect =
      await messageConnectService.getMessageConnectByAccountId1AndAccountId2Pagination(
        {
          account_id_1: account_id,
          account_id_2,
          limit,
          offset,
        }
      );
    if (!messageConnect) {
      await messageConnectService.createMessageConnect({
        account_id_1: account_id,
        account_id_2,
      });
      messageConnect =
        await messageConnectService.getMessageConnectByAccountId1AndAccountId2Pagination(
          {
            account_id_1: account_id,
            account_id_2,
            limit,
            offset,
          }
        );
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
  const { account_id_2, message_connect_id, text, image_url } = req.body;
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
    if (messageConnect.message_connect_status != "active") {
      return errorResponse(res, {
        statusResponse: 400,
        statusCode: statusCode(5003),
        errorMessage: `Message Connect Id(${message_connect_id}) is not active`,
      });
    }
    await messageService.createMessage({
      message_connect_id,
      account_id,
      text,
      image_url,
    });
    await messageConnectService.updateMessageConnect(message_connect_id, {
      last_messages: sequelize.fn("NOW"),
    });
    res.io.emit("message_connect_id_" + message_connect_id, message_connect_id);
    res.io.emit("message_account_id_" + account_id, account_id);
    res.io.emit("message_account_id_" + account_id_2, account_id_2);
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
      res.io.emit("message_account_id_" + account_id, account_id);
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

exports.createRequest = async (req, res) => {
  const { account_id } = req.jwt;
  const { message_connect_id, text } = req.body;
  try {
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
      messageConnect.account_id_1 != account_id &&
      messageConnect.account_id_2 != account_id
    )
      return errorResponse(res, {
        statusResponse: 401,
        statusCode: statusCode(2007),
        errorMessage: `Account Id(${account_id}) don't have permission to Create Request Message Connect Id(${message_connect_id})`,
      });
    if (messageConnect.message_connect_status == "inactive") {
      await messageConnectService.updateMessageConnect(message_connect_id, {
        message_connect_status: "waiting",
        last_messages: sequelize.fn("NOW"),
      });
      await requestService.createRequest({
        message_connect_id,
        account_id,
        text,
      });
    } else if (messageConnect.message_connect_status == "waiting") {
      const request = await requestService.getRequestByMessageConnectId(
        messageConnect.message_connect_id
      );
      await messageConnectService.updateMessageConnect(message_connect_id, {
        last_messages: sequelize.fn("NOW"),
      });
      await requestService.updateRequest(request.request_id, {
        text,
      });
    }
    res.io.emit("message_connect_id_" + message_connect_id, message_connect_id);
    res.io.emit(
      "message_account_id_" + messageConnect.account_id_1,
      messageConnect.account_id_1
    );
    res.io.emit(
      "message_account_id_" + messageConnect.account_id_2,
      messageConnect.account_id_2
    );
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

exports.getRequestByMessageConnectId = async (req, res) => {
  const { account_id } = req.jwt;
  const { message_connect_id } = req.params;
  try {
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
      messageConnect.account_id_1 != account_id &&
      messageConnect.account_id_2 != account_id
    )
      return errorResponse(res, {
        statusResponse: 401,
        statusCode: statusCode(2007),
        errorMessage: `Account Id(${account_id}) don't have permission to Get Request Message Connect Id(${message_connect_id})`,
      });
    const request = await requestService.getRequestByMessageConnectId(
      message_connect_id
    );
    res.status(200).send({
      request,
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

exports.acceptRequest = async (req, res) => {
  const { account_id } = req.jwt;
  const { message_connect_id } = req.body;
  try {
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
      messageConnect.account_id_1 != account_id &&
      messageConnect.account_id_2 != account_id
    )
      return errorResponse(res, {
        statusResponse: 401,
        statusCode: statusCode(2007),
        errorMessage: `Account Id(${account_id}) don't have permission to Accept Request Message Connect Id(${message_connect_id})`,
      });
    if (messageConnect.message_connect_status != "waiting") {
      return errorResponse(res, {
        statusResponse: 400,
        statusCode: statusCode(5003),
        errorMessage: `Message Connect Id(${message_connect_id}) is not waiting`,
      });
    }
    if (messageConnect.message_connect_status == "waiting") {
      const request = await requestService.getRequestByMessageConnectId(
        messageConnect.message_connect_id
      );
      if (request.account_id == account_id) {
        return errorResponse(res, {
          statusResponse: 400,
          statusCode: statusCode(2007),
          errorMessage: `Account Id(${account_id}) don't have permission to Accept Request Message Connect Id(${message_connect_id})`,
        });
      }
      if (
        request.account_id != messageConnect.account_id_1 &&
        request.account_id != messageConnect.account_id_2
      ) {
        return errorResponse(res, {
          statusResponse: 400,
          statusCode: statusCode(5004),
          errorMessage: `Request Account Id(${request.account_id}) is not in Message Connect Id(${message_connect_id})`,
        });
      }
      await messageService.createMessage({
        message_connect_id,
        account_id: request.account_id,
        text: request.text,
        created_at: request.updated_at,
      });
      await messageConnectService.updateMessageConnect(message_connect_id, {
        message_connect_status: "active",
        last_messages: sequelize.fn("NOW"),
      });
      await requestService.updateRequest(request.request_id, {
        request_status: "Accept",
      });
      res.io.emit(
        "message_connect_id_" + message_connect_id,
        message_connect_id
      );
      res.io.emit("message_account_id_" + account_id, account_id);
      res.io.emit(
        "message_account_id_" + request.account_id,
        request.account_id
      );
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

exports.rejectRequest = async (req, res) => {
  const { account_id } = req.jwt;
  const { message_connect_id } = req.body;
  try {
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
      messageConnect.account_id_1 != account_id &&
      messageConnect.account_id_2 != account_id
    )
      return errorResponse(res, {
        statusResponse: 401,
        statusCode: statusCode(2007),
        errorMessage: `Account Id(${account_id}) don't have permission to Reject Request Message Connect Id(${message_connect_id})`,
      });
    if (messageConnect.message_connect_status != "waiting") {
      return errorResponse(res, {
        statusResponse: 400,
        statusCode: statusCode(5003),
        errorMessage: `Message Connect Id(${message_connect_id}) is not waiting`,
      });
    }
    if (messageConnect.message_connect_status == "waiting") {
      await messageConnectService.updateMessageConnect(message_connect_id, {
        message_connect_status: "inactive",
      });
      const request = await requestService.getRequestByMessageConnectId(
        messageConnect.message_connect_id
      );
      if (request.account_id == account_id) {
        return errorResponse(res, {
          statusResponse: 400,
          statusCode: statusCode(2007),
          errorMessage: `Account Id(${account_id}) don't have permission to Reject Request Message Connect Id(${message_connect_id})`,
        });
      }
      if (
        request.account_id != messageConnect.account_id_1 &&
        request.account_id != messageConnect.account_id_2
      ) {
        return errorResponse(res, {
          statusResponse: 400,
          statusCode: statusCode(5004),
          errorMessage: `Request Account Id(${request.account_id}) is not in Message Connect Id(${message_connect_id})`,
        });
      }
      await requestService.updateRequest(request.request_id, {
        request_status: "Reject",
      });
    }
    res.io.emit("message_connect_id_" + message_connect_id, message_connect_id);
    res.io.emit(
      "message_account_id_" + messageConnect.account_id_1,
      messageConnect.account_id_1
    );
    res.io.emit(
      "message_account_id_" + messageConnect.account_id_2,
      messageConnect.account_id_2
    );
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

exports.activateMessageConnect = async (req, res) => {
  const { account_id } = req.jwt;
  const { message_connect_id } = req.body;
  try {
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
      messageConnect.account_id_1 != account_id &&
      messageConnect.account_id_2 != account_id
    )
      return errorResponse(res, {
        statusResponse: 401,
        statusCode: statusCode(2007),
        errorMessage: `Account Id(${account_id}) don't have permission to Activate Message Connect Id(${message_connect_id})`,
      });
    if (messageConnect.message_connect_status != "inactive") {
      return errorResponse(res, {
        statusResponse: 400,
        statusCode: statusCode(5005),
        errorMessage: `Message Connect Id(${message_connect_id}) is not inactive`,
      });
    }
    const otherAccount = await accountService.getAccountByAccountId(
      messageConnect.account_id_1 == account_id
        ? messageConnect.account_id_2
        : messageConnect.account_id_1
    );
    if (otherAccount.role == "member" && otherAccount.is_listener == false) {
      return errorResponse(res, {
        statusResponse: 400,
        statusCode: statusCode(2007),
        errorMessage: `Account Id(${otherAccount.account_id}) is not listener`,
      });
    }
    await messageConnectService.updateMessageConnect(message_connect_id, {
      message_connect_status: "active",
    });
    res.io.emit("message_connect_id_" + message_connect_id, message_connect_id);
    res.io.emit(
      "message_account_id_" + messageConnect.account_id_1,
      messageConnect.account_id_1
    );
    res.io.emit(
      "message_account_id_" + messageConnect.account_id_2,
      messageConnect.account_id_2
    );
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

exports.deactivateMessageConnect = async (req, res) => {
  const { account_id } = req.jwt;
  const { message_connect_id } = req.body;
  try {
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
      messageConnect.account_id_1 != account_id &&
      messageConnect.account_id_2 != account_id
    )
      return errorResponse(res, {
        statusResponse: 401,
        statusCode: statusCode(2007),
        errorMessage: `Account Id(${account_id}) don't have permission to Deactivate Message Connect Id(${message_connect_id})`,
      });
    if (messageConnect.message_connect_status != "active") {
      return errorResponse(res, {
        statusResponse: 400,
        statusCode: statusCode(5006),
        errorMessage: `Message Connect Id(${message_connect_id}) is not active`,
      });
    }
    await messageConnectService.updateMessageConnect(message_connect_id, {
      message_connect_status: "inactive",
    });
    res.io.emit("message_connect_id_" + message_connect_id, message_connect_id);
    res.io.emit(
      "message_account_id_" + messageConnect.account_id_1,
      messageConnect.account_id_1
    );
    res.io.emit(
      "message_account_id_" + messageConnect.account_id_2,
      messageConnect.account_id_2
    );
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

exports.deactivateAllMessageConnect = async (req, res) => {
  const { account_id } = req.jwt;
  try {
    const messageConnects =
      await messageConnectService.getAllMessageConnectByAccountId(account_id);
    for (let i = 0; i < messageConnects.length; i++) {
      const messageConnect = messageConnects[i];
      if (messageConnect.message_connect_status == "active") {
        const otherAccount = await accountService.getAccountByAccountId(
          messageConnect.account_id_1 == account_id
            ? messageConnect.account_id_2
            : messageConnect.account_id_1
        );
        if (
          otherAccount.role == "member" &&
          otherAccount.is_listener == false
        ) {
          await messageConnectService.updateMessageConnect(
            messageConnect.message_connect_id,
            {
              message_connect_status: "inactive",
            }
          );
          res.io.emit(
            "message_connect_id_" + messageConnect.message_connect_id,
            messageConnect.message_connect_id
          );
          res.io.emit(
            "message_account_id_" + messageConnect.account_id_1,
            messageConnect.account_id_1
          );
          res.io.emit(
            "message_account_id_" + messageConnect.account_id_2,
            messageConnect.account_id_2
          );
        }
      }
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
