import { createHash, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";

const secret = "eSparkBiz";

function md5(content) {
  return createHash("md5").update(content).digest("hex");
}

function randomString(length) {
  if (length % 2 !== 0) {
    length++;
  }

  return randomBytes(length / 2).toString("hex");
}

function generateToken(username) {
  return jwt.sign(
    {
      iss: "espark-biz.com",
      iat: Date.now(),
      exp: Date.now() + 40 * 60000,
      message: username,
    },
    secret,
    {
      algorithm: "HS256",
    }
  );
}

function authenticate(req, res, next) {
  try {
    if (req?.cookies?.Token) {
      const decoded = jwt.verify(req?.cookies?.Token, secret, {
        algorithms: "HS256",
      });
      if (Number(decoded.exp) <= Date.now()) {
        res.redirect("/login");
      } else {
        next();
      }
    } else {
      throw new Error("Unauthorized Request");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/login");
  }
}

export { md5, randomString, generateToken, authenticate };
