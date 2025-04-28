import { Document, Types } from "mongoose";
export interface IEvent{
    _id?:Types.ObjectId;
    user_id?:string;
    event_name: string;
    event_datetime: string;
    event_location: string;
    event_description: string;
    created_at?:Date;
    updated_at?:Date;
}
export type IEventCreate = Omit<IEvent, "id" | "created_at" | "updated_at">;

export interface IEventRepository{
    create(event: IEventCreate): Promise<IEvent>;
    findAll(user_id:string): Promise<IEvent[]>;
    findById(id: string): Promise<IEvent | null>;
    update(id: string, event: IEventCreate): Promise<IEvent | null>;
    delete(id: string): Promise<void>;

}
export interface IEventService{
    create(event: IEventCreate): Promise<IEvent>;
    findAll(user_id:string): Promise<IEvent[]>;
    findById(id: string): Promise<IEvent | null>;
    update(id: string, event: IEventCreate): Promise<IEvent | null>;
    delete(id: string): Promise<void>;
}


