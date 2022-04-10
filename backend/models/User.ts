import mongoose from 'mongoose'

export interface IUser extends MongoDoc {
  name: string
  email: string
  password: string
  todoPositions: { todoId: mongoose.Types.ObjectId }[]
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    password: { type: String, required: true },
    todoPositions: [
      {
        todoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Todo',
        },
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model<IUser>('User', UserSchema)