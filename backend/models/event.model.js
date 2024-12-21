import mongoose, {Schema} from "mongoose";

const eventSchema = new Schema({
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    date:{
        type:Date,
        required:true
    },
    location:{
        type:String,
        required:true,
        trim:true
    },
},{timestamps: true});

export const Event = mongoose.model('Event',eventSchema)