import { db } from "../../config/firebase/db";
import { IEvent, IEventRepository } from "../../interfaces/eventInterface";
import { v4 as uuidv4 } from "uuid";

export class FirebaseEventRepository implements IEventRepository {
  async findAll(): Promise<IEvent[]> {
    try {
      const snapshot = await db.collection("events").get();
      const events: IEvent[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          user_id: data.user_id,
          event_name: data.event_name,
          event_datetime: data.event_datetime,
          event_location: data.event_location,
          event_description: data.event_description,
          createdAt: data.createdAt?.toDate(),  // if stored as Timestamp
          updatedAt: data.updatedAt?.toDate(),
        } as IEvent;
      });
      return events;
    } catch (error) {
      throw new Error("Failed to retrieve all events from Firebase");
    }
  }

  async create(event: IEvent): Promise<IEvent> {
    try {
      const id = uuidv4();
      const createdAt = new Date();
      const newEvent = {
        ...event,
        createdAt,
        updatedAt: createdAt,
      };
      await db.collection("events").doc(id).set(newEvent);
      return newEvent as IEvent;
    } catch (error) {
      throw new Error("Failed to create event in Firebase");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.collection("events").doc(id).delete();
    } catch (error) {
      throw new Error(`Failed to delete event with ID ${id} from Firebase`);
    }
  }

  async update(id: string, event: IEvent): Promise<IEvent> {
    try {
      const updatedAt = new Date();
      const updatedEvent = {
        ...event,
        updatedAt,
      };
      await db.collection("events").doc(id).update(updatedEvent);
      const updatedDoc = await db.collection("events").doc(id).get();
      const data = updatedDoc.data();
      if (!data) throw new Error(`No event found with ID ${id}`);
      return {
        user_id: data.user_id,
        event_name: data.event_name,
        event_datetime: data.event_datetime,
        event_location: data.event_location,
        event_description: data.event_description,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as IEvent;
    } catch (error) {
      throw new Error(`Failed to update event with ID ${id} in Firebase`);
    }
  }

  async findById(id: string): Promise<IEvent | null> {
    try {
      const doc = await db.collection("events").doc(id).get();
      if (!doc.exists) {
        return null;
      }
      const data = doc.data();
      return {
        user_id: data!.user_id,
        event_name: data!.event_name,
        event_datetime: data!.event_datetime,
        event_location: data!.event_location,
        event_description: data!.event_description,
        createdAt: data!.createdAt?.toDate(),
        updatedAt: data!.updatedAt?.toDate(),
      } as IEvent;
    } catch (error) {
      throw new Error(`Failed to find event with ID ${id} in Firebase`);
    }
  }
}
