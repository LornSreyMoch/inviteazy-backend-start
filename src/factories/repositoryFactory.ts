// src/factories/repositoryFactory.ts
import { IUserRepository } from "../interfaces/userInterface";
import { IInviteeRepository } from "../interfaces/InviteesInterface";
import { IEventRepository } from "../interfaces/eventInterface";

import { connectPostgresDb } from "../config/postgresdb/db";
import { connectMongoDB } from "../config/mongodb/db";
import mariadb from "../config/mariadb/db";

import { PostgresUserRepository } from "../repositories/postgres/userRepository";
import { PostgresInviteesRepository } from "../repositories/postgres/InviteesRepository";
import { PostgresEventRepository } from "../repositories/postgres/eventRepository";

import { MongoUserRepository } from "../repositories/mongodb/userRepository";

import { MariaDbUserRepository } from "../repositories/mariadb/userRepository";
import { MariaDBInviteesRepository } from "../repositories/mariadb/inviteesRepository";
import { MariaDbEventRepository } from "../repositories/mariadb/eventRepository";

export function createRepositories(dbType: string): {
  userRepository: IUserRepository;
  inviteesRepository: IInviteeRepository;
  eventRepository: IEventRepository;
} {
  switch (dbType) {
    case "postgres":
      const pgPool = connectPostgresDb();
      return {
        userRepository: new PostgresUserRepository(pgPool),
        inviteesRepository: new PostgresInviteesRepository(pgPool),
        eventRepository: new PostgresEventRepository(pgPool),
      };
    case "mariadb":
      return {
        userRepository: new MariaDbUserRepository(mariadb),
        inviteesRepository: new MariaDBInviteesRepository(mariadb),
        eventRepository: new MariaDbEventRepository(mariadb),
      };
    case "mongodb":
      const mongo = connectMongoDB(); // optional usage
      return {
        userRepository: new MongoUserRepository(),
        inviteesRepository: {} as any, 
        eventRepository: {} as any,
      };
    default:
      throw new Error("Unsupported DB_TYPE");
  }
}
