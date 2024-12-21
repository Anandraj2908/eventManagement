import mongoose, {Schema} from "mongoose";

const attendeeSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    eventId:{
        type:Schema.Types.ObjectId,
        ref:"Event",
        required:true
    },
},{timestamps: true});

export const Attendee = mongoose.model('Attendee',attendeeSchema)