import React, { createContext, useContext, useReducer, useEffect } from 'react';

const TaskContext = createContext();

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, action.payload];
    case 'UPDATE_TASK':
      return state.map((task) =>
        task.id === action.payload.id ? { ...task, ...action.payload } : task
      );
    case 'DELETE_TASK':
      return state.filter((task) => task.id !== action.payload);
    default:
      return state;
  }
};

const TaskProvider = ({ children }) => {
  const [tasks, dispatch] = useReducer(taskReducer, [], () => {
    const localData = localStorage.getItem('tasks');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <TaskContext.Provider value={{ tasks, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

const useTasks = () => useContext(TaskContext);

export { TaskProvider, useTasks };
