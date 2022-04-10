import mongoose from 'mongoose'

export interface ITodo extends MongoDoc {
  userId: mongoose.Types.ObjectId
  content: string
  isCompleted: boolean
  position: number
}

const TodoSchema = new mongoose.Schema<ITodo>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    position: {
      type: Number,
    },
  },
  { timestamps: true }
)

export default mongoose.model<ITodo>('Todo', TodoSchema)
