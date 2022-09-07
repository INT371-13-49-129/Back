module.exports.statusCode = function (code) {
  const status_code = {
    1001: "INTERNAL_SERVER_ERROR",
    1002: "INVALID_TOKEN",

    2001: "ACCOUNT_USERNAME_ALREADY_EXISTS",
    2002: "ACCOUNT_EMAIL_ALREADY_EXISTS",
    2003: "ACCOUNT_DOES_NOT_EXIST",
    2004: "ACCOUNT_STATUS_INCORRECT",
    2005: "ACCOUNT_EMAIL_OR_PASSWORD_INCORRECT",
    2006: "ACCOUNT_WAITING_EMAIL_CONFIRM",
    2007: "ACCOUNT_UNAUTHORIZED",

    3001: "POST_DOES_NOT_EXIST",

    4001: "COMMENT_DOES_NOT_EXIST",

    5001: "MESSAGE_CONNECT_ALREADY_EXISTS",
    5002: "MESSAGE_CONNECT_DOES_NOT_EXIST",
  };
  Object.freeze(status_code);
  return status_code[code];
};

module.exports.errorResponse = function (res, data) {
  return res
    .status(data.statusResponse)
    .send({ statusCode: data.statusCode, errorMessage: data.errorMessage });
};
