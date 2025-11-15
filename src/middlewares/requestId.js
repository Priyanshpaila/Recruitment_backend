import { nanoid } from "nanoid";

export function requestId(req, _res, next) {
  req.id = req.headers["x-request-id"] || nanoid(12);
  next();
}
