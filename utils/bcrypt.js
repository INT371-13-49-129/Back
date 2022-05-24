const bcrypt = require("bcryptjs");

const comparePassword = async (candidate, hashPassword) => {
  const isMatch = bcrypt.compareSync(candidate, hashPassword);
  // console.log("is", isMatch);
  return isMatch;
};

module.exports = {
  comparePassword,
};
