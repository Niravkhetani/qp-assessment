import express, {Router} from "express";
import {UserController} from "../controller/users.controllers";

const router: Router = express.Router();
const userController: UserController = new UserController();

router.get("/", (req, res) => {
  res.status(200).send({message: "hello world"});
});

router.post("/register", (req, res) => {
  userController.registerUser(req, res);
});

router.post("/login", (req, res) => {
  userController.loginUser(req, res);
});

export const userRouter: Router = router;
