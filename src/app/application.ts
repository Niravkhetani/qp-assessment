import bodyParser from "body-parser";
import express, {Express} from "express";
import cors from "cors";
import {applicationRouter} from "../router";

export class Application {
  private server: Express;
  constructor() {
    this.server = express();
    this.server.set("host", process.env.HOST || "localhost");
    this.server.set("port", process.env.PORT || 3005);
    this.server.use(bodyParser.json());
    this.server.use(bodyParser.urlencoded({extended: true}));
    this.server.use(cors());
    this.server.use("/v1", applicationRouter);
  }

  public startServer(): void {
    const host: string = this.server.get("host");
    const port: number = this.server.get("port");

    this.server.listen(port, host, () => {
      console.log("listening on port number http://localhost:" + port);
    });
  }
}
