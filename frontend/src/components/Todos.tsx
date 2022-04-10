import { useContext } from 'context/useContext'
import { cn } from 'lib/utils'
import { FC, useCallback, useState } from 'react'
import Todo from './Todo'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'

const Todos = () => {
  const [filter, setFilter] = useState('all')
  const [{ todos }, dispatch] = useContext()

  const FilterButton: FC = useCallback(
    ({ children }) => {
      const isSelected = filter === children!.toString().toLowerCase()
      return (
        <button
          onClick={() => setFilter(children!.toString().toLowerCase())}
          className={cn(
            'font-bold',
            isSelected ? 'text-primary-blue' : 'text-light-grayish-blue-300'
          )}
        >
          {children}
        </button>
      )
    },
    [filter]
  )

  const clearCompleted = () => {
    todos
      .filter((todo) => todo.isCompleted)
      .forEach((todo) => {
        dispatch({
          type: 'deleteTodo',
          payload: todo,
        })
      })
  }

  const filterTodos = (todo: Todo) => {
    if (filter == 'all') return true
    if (filter == 'active') return !todo.isCompleted
    if (filter == 'completed') return todo.isCompleted
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const newTodos = [...todos]
    // take reorderedItem from todos
    const [reorderedItem] = newTodos.splice(result.source.index, 1)
    // put reordered item to destination
    newTodos.splice(result.destination.index, 0, reorderedItem)

    dispatch({
      type: 'setTodo',
      payload: newTodos,
    })
  }

  if (!todos.length) return null

  const filteredTodos = todos.filter(filterTodos)

  return (
    <div className='wrapper -mt-8 lg:-mt-12'>
      <div className='overflow-hidden bg-white dark:bg-dark-desaturated-blue rounded-md shadow-2xl divide-y divide-light-grayish-blue-100 dark:divide-dark-grayish-blue-500'>
        {/* Todos Map */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='todos'>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className='divide-y divide-light-grayish-blue-100 dark:divide-dark-grayish-blue-500'
              >
                {filteredTodos.map((todo, index) => (
                  <Draggable draggableId={todo.id!} key={todo.id} index={index}>
                    {(provided, snapshot) => (
                      <Todo snapshot={snapshot} provided={provided} key={todo.id} todo={todo} />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {/* End Todos Map */}

        <div className='flex justify-between px-4 py-5'>
          <p>{filteredTodos.length} items left</p>
          <button onClick={clearCompleted}>Clear Completed</button>
        </div>
      </div>

      {/* Todos Filter */}
      <div className='bg-white dark:bg-dark-desaturated-blue rounded-md flex justify-center p-5 mt-5 space-x-8 text-light-grayish-blue-300 shadow-2xl'>
        <FilterButton>All</FilterButton>
        <FilterButton>Active</FilterButton>
        <FilterButton>Completed</FilterButton>
      </div>
      {/* End Todos Filter */}

      <p className='text-center text-light-grayish-blue-300 my-12'>Drag and drop to reorder list</p>
    </div>
  )
}

export default Todos
