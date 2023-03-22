import { Request } from "express";
import { IUser } from "src/models/user";

export interface APIV1Request extends Request {
  user: IUser;
}
