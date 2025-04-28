import { IEvent, IEventRepository } from "../../interfaces/eventInterface";
import { Model } from "mongoose";
import logger from "./utils";
import { eventModel } from "../../models/eventModel";

export class MongoEventRepository implements IEventRepository {
  constructor(private readonly model: typeof eventModel) {}

  async findAll(): Promise<IEvent[]> {
    try {
      const events = await this.model.find().lean().exec();
      logger.info(`Retrieved ${events.length} events from MongoDB`);
      return events.map(event => ({
        ...event.toObject(),
        _id: event._id.toString(), // Convert ObjectId to string
      }));
    } catch (error) {
      logger.error("Error retrieving all events:", error);
      throw new Error("Failed to retrieve all events from MongoDB");
    }
  }

  async create(eventData: Omit<IEvent, '_id'>): Promise<IEvent> {
    try {
      const event = new this.model(eventData);
      const createdEvent = await event.save();
      logger.info(`Event created with ID: ${createdEvent._id}`);
      return {
        ...createdEvent.toObject(),
        _id: createdEvent.id.toString()
      };
    } catch (error) {
      logger.error("Error creating event:", error);
      throw new Error("Failed to create event in MongoDB");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await this.model.findByIdAndDelete(id).exec();
      if (!result) {
        logger.warn(`No event found to delete with ID: ${id}`);
        throw new Error(`No event found with ID ${id}`);
      }
      logger.info(`Event deleted with ID: ${id}`);
    } catch (error) {
      logger.error(`Error deleting event with ID ${id}:`, error);
      throw new Error(`Failed to delete event with ID ${id} in MongoDB`);
    }
  }

  async update(id: string, eventData: Partial<IEvent>): Promise<IEvent> {
    try {
      const updatedEvent = await this.model.findByIdAndUpdate(
        id,
        eventData,
        { new: true, lean: true }
      ).exec();

      if (!updatedEvent) {
        logger.warn(`No event found to update with ID: ${id}`);
        throw new Error(`No event found with ID ${id}`);
      }

      logger.info(`Event updated with ID: ${id}`);
      return {
        ...updatedEvent.toObject(),
        _id:updatedEvent._id.toString()
      };
    } catch (error) {
      logger.error(`Error updating event with ID ${id}:`, error);
      throw new Error(`Failed to update event with ID ${id} in MongoDB`);
    }
  }

  async findById(id: string): Promise<IEvent | null> {
    try {
      const event = await this.model.findById(id).lean().exec();
      if (event) {
        logger.info(`Found event with ID: ${id}`);
        return {
          ...event.toObject(),
          _id: event._id.toString()
        };
      }
      logger.warn(`No event found with ID: ${id}`);
      return null;
    } catch (error) {
      logger.error(`Error finding event with ID ${id}:`, error);
      throw new Error(`Failed to find event with ID ${id} in MongoDB`);
    }
  }
}