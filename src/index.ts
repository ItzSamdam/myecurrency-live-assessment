import express, {
  Application,
  Express,
  Request,
  Response,
  json,
} from "express";
import cors from "cors";
import helmet from "helmet";
// import routesConfigs from "./routes/route";
import errorHandler from "./middleware/errorHandler";
import { logger } from "./utils/logger.utils";
import { config } from "./config/config.config";
import bodyParser from "body-parser";
import session from "express-session";
import NotFoundException from "./exceptions/NotFoundException";
import passport from "passport";
import httpStatus from "http-status";
import http, { Server as HTTPServer } from "http";
import endpoints = require("express-list-endpoints");
import swaggerDocs from "./swagger";
import { prisma } from "./utils/misc.utils";

const app: Application = express();
const httpServer: HTTPServer = http.createServer(app);


app.use(express.json());

app.use(cors());
app.disable('x-powered-by'); // less hackers know about our stack
app.use(bodyParser.urlencoded({ extended: true }));
app.use(json());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'https://res.cloudinary.com/', 'data:'],
    },
  },
}));
// Set up session and passport middleware
app.use(
  session({
    secret: config.jwt.access_token.secret,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.get(`/healthCheck`, (req: Request, res: Response) => {
  /**
   * An array of paths extracted from the endpoints.
   *
   * @type {string[]}
   */
  const result: string[] = endpoints(app as Express).map((endpoint) => endpoint.path);
  return res.status(httpStatus.OK).json({
    statusCode: httpStatus.OK,
    status: "success",
    message: 'Ehyo Routes are up and running',
    data: result
  });
});

app.get(`/`, (req: Request, res: Response) => {
  return res.status(httpStatus.OK).json({
    statusCode: httpStatus.OK,
    status: "success",
    message: 'EhYo Communication API',
  });
});

app.get(`/checkDB`, (req: Request, res: Response) => {
  //connect to mysql database
  const check = prisma.$connect();
  if (check !== undefined) {
    return res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      status: "success",
      message: 'EhYo Database is up and running',
    });
  } else {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      status: "error",
      message: 'EhYo Database is down',
    });
  }
});


// routesConfigs.forEach((routeConfig) => new routeConfig(app));

const port = config.port || 3000;
const env = config.env || "development";


httpServer.listen(port, async () => {
  logger.info(`server running on port ${port}`);
  logger.info(`server running on ${env} environment`);
});


swaggerDocs(app, port);

app.use("*", () => {
  throw new NotFoundException();
});

app.use(errorHandler);

