import express, {Router} from "express";
import {groceryRouter} from "./grocery.routes";
import {userRouter} from "./user.routes";

const router: Router = express.Router();

router.use("/grocery", groceryRouter);
router.use("/user", userRouter);

export const applicationRouter: Router = router;
