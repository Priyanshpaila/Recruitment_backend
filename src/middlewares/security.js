import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

export function securityMiddlewares() {
  return [
    helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }),
    cors({ origin: true, credentials: true }),
    hpp(),
    mongoSanitize(),
    xss(),
  ];
}
