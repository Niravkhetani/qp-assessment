import {secret} from "../constant/common";
import {AppDataSource} from "../schema/data-source";
import {Users} from "../schema/entity/User";

const jwt = require("jsonwebtoken");

export class UserAuthentication {
  private entityManager: any;
  constructor() {
    this.entityManager = AppDataSource.getRepository(Users);
  }
  public isUserAuthenticated = () => {
    return async (req, res, next) => {
      console.log(req.headers);
      if (!req.headers.authorization) {
        return res.status(401).send({success: false, message: "Unauthorized..."});
      }
      jwt.verify(req.headers.authorization.replace("Bearer ", ""), secret, async (err, decode) => {
        if (err) {
          return res.status(401).send({success: false, message: "Invalid token"});
        }
        const user = await this.entityManager.findBy({email: decode.email});
        console.log("user", user);
        req.user = user[0];
        next();
      });
    };
  };
}

export const userAuthentication = new UserAuthentication();
