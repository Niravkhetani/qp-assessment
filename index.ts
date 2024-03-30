// const express = require("express");
// const app = express();
// const port: number = 3000;

import {Application} from "./src/app/application";
import {AppDataSource} from "./src/schema/data-source";

const application: Application = new Application();
AppDataSource.initialize()
  .then(async () => {
    console.log("Database connection established");
    // const user = new User();
    // user.firstName = "Timber";
    // user.lastName = "Saw";
    // user.age = 25;
    // await AppDataSource.manager.save(user);
    // console.log("Saved a new user with id: " + user.id);

    // console.log("Loading users from the database...");
    // const users = await AppDataSource.manager.find(User);
    // console.log("Loaded users: ", users);

    // console.log("Here you can setup and run express / fastify / any other framework.");
  })
  .catch((error) => console.log(error));
application.startServer();
