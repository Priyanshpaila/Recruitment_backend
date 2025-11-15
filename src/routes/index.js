import { Router } from "express";
import auth from "./auth.routes.js";
import user from "./user.routes.js";
import idcard from "./idcard.routes.js";
import application from "./application.routes.js"; 

const api = Router();
api.use("/auth", auth);
api.use("/users", user);
api.use("/idcard", idcard);
api.use("/application", application);

export default api;
