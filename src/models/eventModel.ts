import mongoose, { Schema, Document ,ObjectId} from "mongoose";


export interface IEvent extends Document{
    id?:ObjectId | string;
    user_id:string;
    event_name: string;
    event_datetime: string;
    event_location: string;
    event_description: string;
    createdAt?:Date;
    updatedAt?:Date;

}

const eventSchema:Schema=new Schema(
    {
        user_id: {type:String,required:true},
        event_name: {type:String,required:true},
        event_datetime: {type:String,required:true},
        event_location: {type:String,required:true},
        event_description: {type:String,required:true},
    
        },
        {
            timestamps: true,
            collection: 'events'
            }
        
)
export const eventModel= mongoose.model<IEvent>('Event',eventSchema);  