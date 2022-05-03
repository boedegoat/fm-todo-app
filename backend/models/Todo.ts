import mongoose from 'mongoose'
import { IUser } from './User'

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

// before save the document, update todo position in user
TodoSchema.pre('save', async function () {
  const user = await this.model('User').findById(this.userId)
  if (user) {
    // @ts-ignore
    user.todoPositions = [...user.todoPositions, { todoId: this._id }]
    await user.save()
    console.log('success update todo positions')
  }
})

// before remove the document, update todo position in user
TodoSchema.pre('remove', async function () {
  const user = await this.model('User').findById(this.userId)
  if (user) {
    // @ts-ignore
    user.todoPositions = user.todoPositions.filter((todo) => todo.todoId !== this._id)
    await user.save()
    console.log('success update todo positions')
  }
})
