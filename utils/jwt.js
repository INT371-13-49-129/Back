const jwt = require("jsonwebtoken");
const TOKEN_SECRET = "*CMACC+!";
const database = require("../config/database");
const jsonWebTokenService = require("../service/jsonWebTokenService");
module.exports.token = function (payload) {
  return jwt.sign(payload, TOKEN_SECRET,{expiresIn:'3d'});
};

module.exports.resetPasswordToken = function (payload) {
  return jwt.sign(payload, TOKEN_SECRET,{expiresIn:'1h'});
};

module.exports.confirmEmailToken = function (payload) {
  return jwt.sign(payload, TOKEN_SECRET,{expiresIn:'7d'});
};

module.exports.auth = async function (req, res, next) {
  
  const token = req.headers.authorization;
  if (!token)
    return res.status(401).send({ status: "error", error: "Invalid token" });
  // const decodedToken = jwt.verify(token, TOKEN_SECRET)
  jwt.verify(token.split(' ')[1], TOKEN_SECRET, async function (err, decoded) {
    if (err)
      return res.status(401).send({ status: "error", error: err.message });
    if (decoded) { 
      const jwtLogout = await jsonWebTokenService.getJsonWebTokenByTokenAndTokenTypeAndAccountId({ token:token.split(' ')[1], token_type:"Logout", account_id:decoded.account_id })
      if(jwtLogout){
        return res.status(401).send({ status: "error", error:"token this has been logged out." });
      }
      req.jwt = decoded
      req.token = token.split(' ')[1]
      next();
    }
  });
};

module.exports.verify = async function ( res,token ) {
  if (!token)
    return res.status(401).send({ status: "error", error: "Invalid token" });
  let data
  jwt.verify(token, TOKEN_SECRET, function (err, decoded) {
    if (err)
      return res.status(401).send({ status: "error", error: err.message });
    if (decoded) { 
      data =  decoded
    }
  });
  return data
};
