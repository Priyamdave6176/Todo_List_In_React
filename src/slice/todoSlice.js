import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://jsonplaceholder.typicode.com/todos';

// Async thunk for fetching todos
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  const data = await response.json();
  // Limiting to 10 todos for cleaner display with the fake API
  return data.slice(0, 10);
});

// Async thunk for adding a new todo
export const addTodo = createAsyncThunk('todos/addTodo', async (text) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: text,
      completed: false,
      userId: 1, // Placeholder userId
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to add todo');
  }
  const data = await response.json();
  // The fake API returns the created object with a new ID
  return { ...data, text: data.title };
});

// Async thunk for toggling the completed status of a todo
export const toggleTodo = createAsyncThunk('todos/toggleTodo', async (todo) => {
    const response = await fetch(`${API_URL}/${todo.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
    });
    if (!response.ok) {
        throw new Error('Failed to toggle todo');
    }
    return await response.json();
});

// Async thunk for deleting a todo
export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
  // The API returns an empty object on successful deletion
  return id;
});

// Async thunk for updating a todo's text
export const updateTodo = createAsyncThunk('todos/updateTodo', async ({ id, newText }) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH', // Using PATCH to partially update the resource
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: newText,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to update todo');
  }
  const data = await response.json();
  return { id: data.id, text: data.title };
});


const initialState = {
  todoLoading: false,
  todoData: [],
  todoError: null,
};

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Todos
      .addCase(fetchTodos.pending, (state) => {
        state.todoLoading = true;
        state.todoError = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todoLoading = false;
        state.todoData = action.payload.map(todo => ({...todo, text: todo.title}));
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.todoLoading = false;
        state.todoError = action.error.message;
      })
      // Add Todo
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todoData.push(action.payload);
      })
      // Toggle Todo
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const index = state.todoData.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
            state.todoData[index].completed = action.payload.completed;
        }
      })
      // Delete Todo
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todoData = state.todoData.filter((todo) => todo.id !== action.payload);
      })
      // Update Todo
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todoData.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
          state.todoData[index].text = action.payload.text;
        }
      });
  },
});

export default todoSlice.reducer;




// import { createSlice } from '@reduxjs/toolkit';

// let nextId = 1;

// const todoSlice = createSlice({
//   name: 'todos',
//   initialState: [],
//   reducers: {
//     addTodo: (state, action) => {
//       state.push({
//         id: nextId++,
//         text: action.payload, // Changed from 'name' to 'text'
//         completed: false,
//       });
//     },
//     toggleTodo: (state, action) => { // Renamed from toggleComplete
//       const todo = state.find(t => t.id === action.payload);
//       if (todo) {
//         todo.completed = !todo.completed;
//       }
//     },
//     deleteTodo: (state, action) => { // Renamed from removeTodo
//       return state.filter(t => t.id !== action.payload);
//     },
//     updateTodo: (state, action) => { // Renamed from updateTodoName
//       const { id, newText } = action.payload;
//       const todo = state.find(t => t.id === id);
//       if (todo) {
//         todo.text = newText; // Changed from 'name' to 'text'
//       }
//     },
//   }
// });

// export const { addTodo, toggleTodo, deleteTodo, updateTodo } = todoSlice.actions;
// export default todoSlice.reducer;