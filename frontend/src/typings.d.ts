interface Todo {
  id?: string
  content?: string
  isCompleted?: boolean
}

interface State {
  todos: Todo[]
}

type Action =
  | { type: 'createNewTodo'; payload: Todo }
  | { type: 'setTodo'; payload: Todo[] | undefined }
  | { type: 'editTodo'; payload: Todo }
  | { type: 'deleteTodo'; payload: Todo }
