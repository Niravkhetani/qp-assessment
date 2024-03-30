import {responseType} from "../constant/response.types";
import {groceryItemResponse, orderResponse} from "../constant/response_status_code";
import {AppDataSource} from "../schema/data-source";
import {GroceryItems} from "../schema/entity/GroceryItems";
import {Orders} from "../schema/entity/Order";

export class GroceryController {
  private entityManager: any;
  private orderEntityManager: any;
  constructor() {
    this.entityManager = AppDataSource.getRepository(GroceryItems);
    this.orderEntityManager = AppDataSource.getRepository(Orders);
  }
  public addItem = async (req: any, res: any): Promise<any> => {
    let response: responseType = {
      success: false,
      data: {},
      code: groceryItemResponse.GROCERY_ITEM_FETCH_FAILED,
      message: "",
      err: "",
    };
    const groceryItem = await this.entityManager.create(req.body);
    await this.entityManager
      .save(groceryItem)
      .then((data) => {
        response = {
          success: true,
          data: data,
          code: groceryItemResponse.GROCERY_ITEM_CREATED,
          message: "Item created successfully",
          err: "",
        };
      })
      .catch((err) => {
        console.log(err);
        response = {
          code: response && !response.code ? groceryItemResponse.GROCERY_ITEM_FETCH_FAILED : response.code,
          message: response && !response.message ? "Item fetch failed" : response.message,
          success: false,
          data: {},
          err: err.code,
        };
      });
    return res.status(200).send(response);
  };
  public getItemList = async (req: any, res: any): Promise<any> => {
    let response: responseType = {
      success: false,
      data: {},
      code: groceryItemResponse.GROCERY_ITEM_FETCH_FAILED,
      message: "",
      err: "",
    };
    const page: number = req.query.page || 0;
    const limit: number = req.query.limit || 10;
    let groceryItem: any = {};
    if (req.query.id) {
      groceryItem = await this.entityManager.findBy({id: req.query.id}).catch((err) => {
        response = {
          code: response && !response.code ? groceryItemResponse.GROCERY_ITEM_FETCH_FAILED : response.code,
          message: response && !response.message ? "Item fetch failed" : response.message,
          success: false,
          data: {},
          err: err.code,
        };
      });
    } else {
      groceryItem = await this.entityManager.find({skip: limit * page, take: limit}).catch((err) => {
        response = {
          code: response && !response.code ? groceryItemResponse.GROCERY_ITEM_FETCH_FAILED : response.code,
          message: response && !response.message ? "Item fetch failed" : response.message,
          success: false,
          data: {},
          err: err.code,
        };
      });
    }

    const groceryCount = await this.entityManager.count();
    if (groceryItem.length > 0) {
      response = {
        code: groceryItemResponse.GROCERY_ITEM_SUCCESS,
        message: "GroceryItem was successfully fetched",
        success: true,
        data: {items: groceryItem, total: groceryCount},
        err: "",
      };
    } else {
      response = {
        code: groceryItemResponse.GROCERY_ITEM_SUCCESS,
        message: "GroceryItem list not found",
        success: true,
        data: {},
        err: "",
      };
    }
    return res.status(200).send(response);
  };
  public removeItem = async (req: any, res: any): Promise<any> => {
    let response: responseType = {
      success: false,
      data: {},
      code: groceryItemResponse.GROCERY_ITEM_FETCH_FAILED,
      message: "Item fetch failed",
      err: "",
    };
    const groceryItem = await this.entityManager.findBy({id: req.query.id}).catch((err) => {
      response = {
        code: response && !response.code ? groceryItemResponse.GROCERY_ITEM_FETCH_FAILED : response.code,
        message: response && !response.message ? "Item fetch failed" : response.message,
        success: false,
        data: {},
        err: err.code,
      };
    });
    if (groceryItem.length > 0) {
      await this.entityManager.remove({id: req.query.id}).catch((err) => {
        response = {
          code: response && !response.code ? groceryItemResponse.GROCERY_ITEM_FETCH_FAILED : response.code,
          message: response && !response.message ? "Item fetch failed" : response.message,
          success: false,
          data: {},
          err: err.code,
        };
      });
      response = {
        code: groceryItemResponse.GROCERY_ITEM_REMOVED_SUCCESS,
        message: "GroceryItem was successfully removed",
        success: true,
        data: groceryItem,
        err: "",
      };
    }
    return res.status(200).send(response);
  };
  public addOrder = async (req: any, res: any): Promise<any> => {
    let response: responseType = {
      success: false,
      data: {},
      code: orderResponse.ORDER_CREATED_FAILED,
      message: "Order created Failed",
      err: "",
    };
    // check asked quantity is available or not send response accordingly
    /* [{Pid:sjlfksf,status:available,quantity:1},{Pid:dfsdf,status:not available, quantity:0}]*/
    const productIdList = req.body.orderItem.map((product) => product.id);
    const groceryItemWithQuantity = await this.entityManager.findByIds(productIdList);
    let output = [];
    groceryItemWithQuantity.map((item) => {
      let itemObj: any = {...item};
      let quantity = req.body.orderItem.filter((prod) => prod.id === item.id && item.quantity <= prod.quantity);
      this.orderEntityManager.items = item;
      itemObj.status = quantity ? "Success" : "Not Available";
      output.push(itemObj);
    });
    //Create a new order
    let succeedItems = output.filter((item) => item.status === "Success");
    let totalAmount = succeedItems.reduce((acc, item) => {
      return item.price + acc;
    }, 0);
    let orderObject = {
      order_total_amount: totalAmount + 10,
      amount: totalAmount,
      items: succeedItems,
      user: [req.user],
    };
    let orderObj = await this.orderEntityManager.create(orderObject);
    this.orderEntityManager.save(orderObj);
    response = {
      success: true,
      data: output,
      code: orderResponse.ORDER_CREATED,
      message: "Order created",
      err: "",
    };
    return res.status(200).json(response);
  };
}
