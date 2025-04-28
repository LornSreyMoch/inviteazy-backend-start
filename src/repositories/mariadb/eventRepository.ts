import { Pool } from "mysql2/promise";
import { IEvent, IEventRepository } from "../../interfaces/eventInterface";
import { queryWithLogging } from "./utils"; 

export class MariaDbEventRepository implements IEventRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findAll(): Promise<IEvent[]> {
    try {
      const [rows] = await queryWithLogging<IEvent[]>(
        this.pool,
        "SELECT * FROM events;"
      );
      return rows; // rows will be of type IEvent[]
    } catch (error) {
      throw new Error("Failed to retrieve all events");
    }
  }

  async create(event: IEvent): Promise<IEvent> {
    try {
      const [rows] = await queryWithLogging<IEvent[]>(
        this.pool,
        `INSERT INTO events (user_id, event_name, event_datetime, event_location, event_description)
         VALUES (?, ?, ?, ?, ?)`,
        [event.user_id, event.event_name, event.event_datetime, event.event_location, event.event_description]
      );

      const [result] = await queryWithLogging<IEvent[]>(
        this.pool,
        `SELECT * FROM events WHERE id = LAST_INSERT_ID()`
      );

      return result[0]; // result[0] is of type IEvent
    } catch (error) {
      throw new Error("Failed to create event");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await queryWithLogging(this.pool, "DELETE FROM events WHERE id = ?", [id]);
    } catch (error) {
      throw new Error(`Failed to delete event with ID ${id}`);
    }
  }

  async update(id: string, event: IEvent): Promise<IEvent> {
    try {
      await queryWithLogging(
        this.pool,
        `UPDATE events SET user_id = ?, event_name = ?, event_datetime = ?, 
         event_location = ?, event_description = ? WHERE id = ?`,
        [
          event.user_id,
          event.event_name,
          event.event_datetime,
          event.event_location,
          event.event_description,
          id,
        ]
      );

      const [rows] = await queryWithLogging<IEvent[]>(
        this.pool,
        "SELECT * FROM events WHERE id = ?",
        [id]
      );
      return rows[0]; // rows[0] is of type IEvent
    } catch (error) {
      throw new Error(`Failed to update event with ID ${id}`);
    }
  }

  async findById(id: string): Promise<IEvent | null> {
    try {
      const [rows] = await queryWithLogging<IEvent[]>(
        this.pool,
        "SELECT * FROM events WHERE id = ?",
        [id]
      );
      return rows[0] || null; // rows[0] is of type IEvent
    } catch (error) {
      throw new Error(`Failed to find event with ID ${id}`);
    }
  }
}
