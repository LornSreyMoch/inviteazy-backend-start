import { Pool } from "mysql2/promise";
import bcrypt from "bcrypt";
import { IUser, IUserRepository } from "../../interfaces/userInterface";
import { queryWithLogging } from "./utils";

export class MariaDbUserRepository implements IUserRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findAll(): Promise<IUser[]> {
    const [rows] = await queryWithLogging<IUser[]>(
      this.pool,
      "SELECT id, name, email, role FROM users"
    );
    return rows;
  }

  async findById(id: string): Promise<IUser | null> {
    const [rows] = await queryWithLogging<IUser[]>(
      this.pool,
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const [rows] = await queryWithLogging<IUser[]>(
      this.pool,
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows[0] || null;
  }

  async create(user: Omit<IUser, "id">): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const [result] = await queryWithLogging<any>(
      this.pool,
      `INSERT INTO users 
       (name, email, password, role, phone_number, profile_picture, address) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        user.name,
        user.email,
        hashedPassword,
        user.role,
        user.phone_number,
        user.profile_picture,
        user.address,
      ]
    );

    const [rows] = await queryWithLogging<IUser[]>(
      this.pool,
      "SELECT id, name, email, role, phone_number, profile_picture, address FROM users WHERE id = LAST_INSERT_ID()"
    );

    return rows[0];
  }
}
