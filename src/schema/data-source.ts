import "reflect-metadata";
import {DataSource} from "typeorm";
import {Users} from "./entity/User";
import {GroceryItems} from "./entity/GroceryItems";
import {Orders} from "./entity/Order";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "root",
  database: "grocery_booking_system",
  synchronize: true,
  logging: false,
  entities: [Users, GroceryItems, Orders],
  migrations: [],
  subscribers: [],
});
