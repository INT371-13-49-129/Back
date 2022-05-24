const jwt = require("jsonwebtoken");
const TOKEN_SECRET = "*CMACC+!";
const database = require("../config/database");
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
  jwt.verify(token.split(' ')[1], TOKEN_SECRET, function (err, decoded) {
    if (err)
      return res.status(401).send({ status: "error", error: err.message });
    if (decoded) { 
      req.jwt = decoded
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
