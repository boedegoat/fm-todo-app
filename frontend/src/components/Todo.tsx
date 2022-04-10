import { useContext } from 'context/useContext'
import { cn } from 'lib/utils'
import { FC, useEffect, useState } from 'react'
import Checkbox from './Checkbox'
import CrossIcon from 'images/icon-cross.svg'
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd'

interface Props {
  todo: Todo
  provided: DraggableProvided
  snapshot: DraggableStateSnapshot
}

const Todo: FC<Props> = ({ todo, provided, snapshot }) => {
  const { dispatchTodos } = useContext().todos
  const [content, setContent] = useState<string>()

  const markComplete = () => {
    dispatchTodos({
      type: 'editTodo',
      payload: { ...todo, isCompleted: !todo.isCompleted ? true : false },
    })
  }

  const deleteTodo = () => {
    dispatchTodos({
      type: 'deleteTodo',
      payload: todo,
    })
  }

  const editTodoContent = () => {
    dispatchTodos({
      type: 'editTodo',
      payload: { ...todo, content },
    })
  }

  useEffect(() => {
    // if content already a string
    if (typeof content == 'string') {
      content ? editTodoContent() : deleteTodo()
    }
  }, [content])

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={cn(
        'flex items-center',
        snapshot.isDragging
          ? 'bg-primary-cyan dark:bg-primary-purple rounded-md'
          : 'bg-white dark:bg-dark-desaturated-blue'
      )}
    >
      <div className='p-4'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-3 w-3'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth='2'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M4 8h16M4 16h16' />
        </svg>
      </div>

      {/* CHECKBOX */}
      <div className='mr-4'>
        <Checkbox onChange={markComplete} checked={todo.isCompleted} />
      </div>

      {/* TODO CONTENT + EDIT */}
      <input
        className={cn(
          'flex-1 py-5',
          todo.isCompleted
            ? 'line-through text-light-grayish-blue-300 dark:text-dark-grayish-blue-300'
            : ''
        )}
        type='text'
        onChange={(e) => setContent(e.target.value)}
        value={todo.content}
      />

      {/* DELETE BUTTON */}
      <button className='p-4' onClick={deleteTodo}>
        <img className='w-3 h-3' src={CrossIcon} alt='cross-icon' />
      </button>
    </div>
  )
}

export default Todo
