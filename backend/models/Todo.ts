import mongoose from 'mongoose'
import User from './User'

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

// before save the document, update todo position in user
TodoSchema.pre('save', async function () {
  const user = await User.findById(this.userId)
  if (user) {
    user.todoPositions = [...user.todoPositions, { todoId: this.id }]
    await user.save()
  }
})

// before remove the document, update todo position in user
TodoSchema.pre('remove', async function () {
  const user = await User.findById(this.userId)
  if (user) {
    user.todoPositions = user.todoPositions.filter((todo) => {
      return todo.todoId.toString() !== this.id
    })
    await user.save()
  }
})

export default mongoose.model<ITodo>('Todo', TodoSchema)
