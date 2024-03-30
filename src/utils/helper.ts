import {saltRounds, secret} from "../constant/common";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export const makeHashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, saltRounds);
  console.log("🚀 ~ makeHashPassword ~ hash:", hash);
  return hash;
};

export const generateJWTToken = async (email: string) => {
  const jwtToken = jwt.sign({email: email, iat: Math.floor(Date.now() / 1000) - 60 * 10}, secret);
  return jwtToken;
};

export const matchPassword = async (password: string, hash: string) => {
  console.log(hash, password, "hash password");
  const isValid = await bcrypt.compare(password, hash);
  return isValid;
};
