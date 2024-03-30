import {AppDataSource} from "../schema/data-source";
import {Users} from "../schema/entity/User";

class CheckUserRole {
  private entityManager: any;
  constructor() {
    this.entityManager = AppDataSource.getRepository(Users);
  }
  public verifyRole(role: ("admin" | "user")[]) {
    return async (req, res, next) => {
      if (role.includes(req.user.role)) {
        next();
      } else {
        return res.status(401).send({
          success: false,
          message: "unauthorized...",
        });
      }
    };
  }
}

export const userRole = new CheckUserRole();
