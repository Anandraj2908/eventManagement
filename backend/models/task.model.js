import mongoose, {Schema} from "mongoose";

const taskSchema = new Schema({
    assignedTo:{
        type:Schema.Types.ObjectId,
        ref:'Attendee'
    },
    eventId:{
        type:Schema.Types.ObjectId,
        ref:'Event',
        required:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    deadline:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:['Pending','Completed'],
        default:'Pending'
    }
},{timestamps: true});

export const Task = mongoose.model('Task',taskSchema)