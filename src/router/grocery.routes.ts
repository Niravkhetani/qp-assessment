import express, {Router} from "express";
import {userAuthentication} from "../middleware/UserAuthentication";
import {userRole} from "../middleware/CheckUserRoles";
import {GroceryController} from "../controller/grocery.controllers";

const router: Router = express.Router();
const groceryController: GroceryController = new GroceryController();

router.get("/", [userAuthentication.isUserAuthenticated(), userRole.verifyRole(["admin", "user"])], (req, res) => {
  groceryController.getItemList(req, res);
});

router.post("/", [userAuthentication.isUserAuthenticated(), userRole.verifyRole(["admin"])], (req, res) => {
  groceryController.addItem(req, res);
});

router.delete("/", [userAuthentication.isUserAuthenticated(), userRole.verifyRole(["admin"])], (req, res) => {
  groceryController.removeItem(req, res);
});

router.post("/order", [userAuthentication.isUserAuthenticated(), userRole.verifyRole(["user"])], (req, res) => {
  groceryController.addOrder(req, res);
});
export const groceryRouter: Router = router;
