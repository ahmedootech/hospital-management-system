import mongoose from 'mongoose';
import { transformDocument } from '../../services/mongoose-utils';

interface RoomAttr {
  name: string;
  price: number;
  description?: string;
  status?: string;
}

interface RoomDoc extends RoomAttr, mongoose.Document {}

interface RoomModel extends mongoose.Model<RoomDoc> {
  build(attrs: RoomAttr): RoomDoc;
}

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: { type: Number, required: true, default: 0 },
    description: {
      type: String,
    },
    status: {
      type: String,
      default: 'Available',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        transformDocument(ret);
      },
    },
  }
);

roomSchema.statics.build = (attrs: RoomAttr) => {
  return new Room(attrs);
};

const Room = mongoose.model<RoomDoc, RoomModel>('Room', roomSchema);

export { Room };
