const jwt = require("jsonwebtoken");
const TOKEN_SECRET = "*CMACC+!";
const database = require("../config/database");
const jsonWebTokenService = require("../service/jsonWebTokenService");
const { statusCode, errorResponse } = require("../utils/errorResponse");

module.exports.token = function (payload) {
  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: "3d" });
};

module.exports.resetPasswordToken = function (payload) {
  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: "1h" });
};

module.exports.confirmEmailToken = function (payload) {
  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: "7d" });
};

module.exports.auth = async function (req, res, next) {
  const token = req.headers.authorization;
  if (!token)
    return errorResponse(res, {
      statusResponse: 401,
      statusCode: statusCode(1002),
      errorMessage: `Invalid token`,
    });
  // const decodedToken = jwt.verify(token, TOKEN_SECRET)
  jwt.verify(token.split(" ")[1], TOKEN_SECRET, async function (err, decoded) {
    if (err)
      return errorResponse(res, {
        statusResponse: 500,
        statusCode: statusCode(1001),
        errorMessage: err,
      });
    if (decoded) {
      const jwtLogout =
        await jsonWebTokenService.getJsonWebTokenByTokenAndTokenTypeAndAccountId(
          {
            token: token.split(" ")[1],
            token_type: "Logout",
            account_id: decoded.account_id,
          }
        );
      if (jwtLogout) {
        return errorResponse(res, {
          statusResponse: 401,
          statusCode: statusCode(1002),
          errorMessage: `Invalid token, token this has been logged out.`,
        });
      }
      req.jwt = decoded;
      req.token = token.split(" ")[1];
      next();
    }
  });
};

module.exports.verify = async function (res, token) {
  if (!token)
    return errorResponse(res, {
      statusResponse: 401,
      statusCode: statusCode(1002),
      errorMessage: `Invalid token`,
    });
  let data;
  jwt.verify(token, TOKEN_SECRET, function (err, decoded) {
    if (err)
      return errorResponse(res, {
        statusResponse: 500,
        statusCode: statusCode(1001),
        errorMessage: err,
      });
    if (decoded) {
      data = decoded;
    }
  });
  return data;
};
