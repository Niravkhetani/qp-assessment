import {EntityManager, Repository, getConnection, getConnectionManager, getManager} from "typeorm";
import {Users} from "../schema/entity/User";
import {AppDataSource} from "../schema/data-source";
import {responseType} from "../constant/response.types";
import {userResponse} from "../constant/response_status_code";
import {generateJWTToken, makeHashPassword, matchPassword} from "../utils/helper";

export class UserController {
  private entityManager: any;
  constructor() {
    this.entityManager = AppDataSource.getRepository(Users);
  }

  public registerUser = async (req: any, res: any): Promise<any> => {
    let response: responseType = {
      success: false,
      data: {},
      code: userResponse.USER_FETCH_FAILED,
      message: "",
      err: "",
    };
    const password = await makeHashPassword(req.body.password);
    const token = await generateJWTToken(req.body.email);
    let userObj = {email: req.body.email, name: req.body.name, password: password, token: token};
    const user = await this.entityManager.create(userObj);
    await this.entityManager
      .save(user)
      .then((data) => {
        response = {
          success: true,
          data: data,
          code: userResponse.USER_SUCCESS,
          message: "user created successfully",
          err: "",
        };
      })
      .catch((err) => {
        if (err.code === "ER_DUP_ENTRY") {
          response = {
            code: userResponse.USER_ALREADY_EXIST,
            message: "User already exists",
            success: false,
            err: "User already exists",
            data: {},
          };
        }
        console.log(err);
        response = {
          code: response && !response.code ? userResponse.USER_FETCH_FAILED : response.code,
          message: response && !response.message ? "User fetch failed" : response.message,
          success: false,
          data: {},
          err: err.code,
        };
      });
    return res.status(200).send(response);
  };

  public loginUser = async (req: any, res: any): Promise<any> => {
    let response: responseType = {
      success: false,
      data: {},
      code: userResponse.USER_FETCH_FAILED,
      message: "",
      err: "",
    };
    const user = await this.entityManager.findBy({email: req.body.email});
    if (!user.length) {
      response = {
        success: false,
        data: {},
        code: userResponse.USER_NOT_FOUND,
        message: "User not found",
        err: "",
      };
    } else {
      console.log("user", user);
      const password = await matchPassword(req.body.password, user[0].password);
      if (user && !password) {
        response = {
          success: false,
          data: {},
          code: userResponse.USER_PASSWORD_INCORRECT,
          message: "Invalid password",
          err: "",
        };
      } else {
        const token = await generateJWTToken(req.body.email);
        const updateUser = await this.entityManager.update({email: req.body.email}, {token: token});
        response = {
          success: true,
          data: user,
          code: userResponse.USER_SUCCESS,
          err: "",
          message: "User logged in successfully",
        };
      }
    }
    // let userObj = {email: req.body.email, name: req.body.name, token: token};
    // const user = await this.entityManager.create(userObj);
    // await this.entityManager
    //   .save(user)
    //   .then((data) => {
    //     response = {
    //       success: true,
    //       data: data,
    //       code: userResponse.USER_SUCCESS,
    //       message: "user created successfully",
    //       err: "",
    //     };
    //   })
    //   .catch((err) => {
    //     if (err.code === "ER_DUP_ENTRY") {
    //       response = {
    //         code: userResponse.USER_ALREADY_EXIST,
    //         message: "User already exists",
    //         success: false,
    //         err: "User already exists",
    //         data: {},
    //       };
    //     }
    //     console.log(err);
    //     response = {
    //       code: response && !response.code ? userResponse.USER_FETCH_FAILED : response.code,
    //       message: response && !response.message ? "User fetch failed" : response.message,
    //       success: false,
    //       data: {},
    //       err: err.code,
    //     };
    //   });
    return res.status(200).send(response);
  };
}
