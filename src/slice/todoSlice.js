import { createSlice } from '@reduxjs/toolkit';

let nextId = 1;

const todoSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push({
        id: nextId++,
        text: action.payload, // Changed from 'name' to 'text'
        completed: false,
      });
    },
    toggleTodo: (state, action) => { // Renamed from toggleComplete
      const todo = state.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action) => { // Renamed from removeTodo
      return state.filter(t => t.id !== action.payload);
    },
    updateTodo: (state, action) => { // Renamed from updateTodoName
      const { id, newText } = action.payload;
      const todo = state.find(t => t.id === id);
      if (todo) {
        todo.text = newText; // Changed from 'name' to 'text'
      }
    },
  }
});

export const { addTodo, toggleTodo, deleteTodo, updateTodo } = todoSlice.actions;
export default todoSlice.reducer;