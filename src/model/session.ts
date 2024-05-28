import mongoose, {Document, Schema} from 'mongoose';

export interface ISession extends Document {
  courseId: number;
  date: Date;
  location: string;
}

const sessionSchema = new Schema({
  courseId: {
    required: true,
    type: Number,
    ref: 'Course',
  },

  date: {
    required: true,
    type: Date,
  },

  location: {
    required: true,
    type: String,
  },
});

const Session = mongoose.model<ISession>('Session', sessionSchema);

export default Session;