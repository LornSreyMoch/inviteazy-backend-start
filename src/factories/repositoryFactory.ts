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
import { MongoEventRepository } from "../repositories/mongodb/eventRepository";

import { MariaDbUserRepository } from "../repositories/mariadb/userRepository";
import { MariaDBInviteesRepository } from "../repositories/mariadb/inviteesRepository";
import { MariaDbEventRepository } from "../repositories/mariadb/eventRepository";
import { eventModel } from "../models/eventModel";


import { FirebaseEventRepository } from "../repositories/firestore/eventRepository";
import { FirebaseUserRepository } from "../repositories/firestore/userRepository";
import { FirebaseInviteesRepository } from "../repositories/firestore/inviteesRepository";
import { db } from "../config/firebase/db";  // Firebase DB setup


export async function createRepositories(dbType: string):Promise< {
  userRepository: IUserRepository;
  inviteesRepository: IInviteeRepository;
  eventRepository: IEventRepository;
}> {
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
        await connectMongoDB();       return {
        userRepository: new MongoUserRepository(),
        inviteesRepository: {} as any, 
        eventRepository: new MongoEventRepository(eventModel),
      };
    case "firebase":
      return {
        userRepository: new FirebaseUserRepository(),
        inviteesRepository: new FirebaseInviteesRepository(),
        eventRepository: new FirebaseEventRepository(),
      };
    default:
      throw new Error("Unsupported DB_TYPE");
  }
}
