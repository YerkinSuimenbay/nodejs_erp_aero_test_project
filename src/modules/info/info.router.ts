import { Response, Router, Request } from "express";
import * as InfoService from "./info.service";

export const infoRouter = Router();

infoRouter.get("/", async (req: any, res: Response) => {
  return res.json({ id: req.body.user.userId });
});
