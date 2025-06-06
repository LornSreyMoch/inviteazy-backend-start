import express, { Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { UserService } from "./services/userService";
import { UserController } from "./controllers/userController";
import { AuthController } from "./controllers/authController";
import { InviteesController } from "./controllers/InviteesController";
import authRoutes from "./routes/authRoutes";
// import { connectPostgresDb } from "./config/postgresdb/db";
import { PostgresUserRepository } from "./repositories/postgres/userRepository";
import { InviteeService } from "./services/InviteesService";
// import { PostgresInviteesRepository } from "./repositories/postgres/InviteesRepository";
import { loggingMiddleware } from "./middlewares/loggingMiddleware";
import inviteesRoutes from "./routes/InviteesRoutes";
import eventRouter from "./routes/eventRoutes";
import { EventController } from "./controllers/eventController";
import { EventService } from "./services/eventService";
import { PostgresEventRepository } from "./repositories/postgres/eventRepository";
import { MongoUserRepository } from "./repositories/mongodb/userRepository";
import { connectMongoDB } from "./config/mongodb/db";
import guestRouter from "./routes/guestInRoutes"
import { GuestInsightController } from "./controllers/guestInsightController";
import { db } from "./config/firebase/db";
import inviteFireRoutes from "./routes/Invite-fire-route";
import { createRepositories } from "./factories/repositoryFactory";


dotenv.config();

const app = express();
const port = 3000;

const dbType = process.env.DB_TYPE || "mariadb";

async function initRepositories() {
const {
  userRepository,
  inviteesRepository,
  eventRepository,
} =await createRepositories(dbType);
// Services

const userService = new UserService(userRepository);
const inviteeService = new InviteeService(inviteesRepository);
// Controllers

const eventService = new EventService(eventRepository);
const userController = new UserController(userService);
const authController = new AuthController(userService);
const inviteesController = new InviteesController(inviteeService);
const eventController = new EventController(eventService, inviteeService);

// / Routes
app.use("/api/users", userRoutes(userController));
app.use("/api/auth", authRoutes(authController));
app.use("/api/v1", inviteesRoutes(inviteesController));
app.use("/api/v1/events", eventRouter(eventController));
}initRepositories();





// Middlewares
app.use(express.json());
app.use(loggingMiddleware);


// Handle Errors
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
