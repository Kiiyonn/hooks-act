// src/components/TaskManager.js
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useTasks } from './TaskContext';

const TaskManager = () => {
  const { tasks, dispatch } = useTasks();
  const [taskText, setTaskText] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [filter, setFilter] = useState('all');
  const inputRef = useRef(null);

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'completed':
        return tasks.filter((task) => task.completed);
      case 'incomplete':
        return tasks.filter((task) => !task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const addTask = useCallback(() => {
    if (taskText.trim()) {
      dispatch({
        type: 'ADD_TASK',
        payload: { id: Date.now(), text: taskText, completed: false }
      });
      setTaskText('');
      inputRef.current.focus();
    }
  }, [taskText, dispatch]);

  const editTask = useCallback((task) => {
    setTaskText(task.text);
    setEditTaskId(task.id);
    inputRef.current.focus();
  }, []);

  const updateTask = useCallback(() => {
    if (taskText.trim() && editTaskId) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: { id: editTaskId, text: taskText }
      });
      setTaskText('');
      setEditTaskId(null);
      inputRef.current.focus();
    }
  }, [taskText, editTaskId, dispatch]);

  const deleteTask = useCallback((taskId) => {
    dispatch({
      type: 'DELETE_TASK',
      payload: taskId
    });
  }, [dispatch]);

  const toggleTaskCompletion = useCallback((taskId) => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: { id: taskId, completed: !tasks.find(task => task.id === taskId).completed }
    });
  }, [tasks, dispatch]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="Add a new task"
      />
      <button onClick={editTaskId ? updateTask : addTask}>
        {editTaskId ? 'Update Task' : 'Add Task'}
      </button>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="incomplete">Incomplete</option>
      </select>
      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            <span>{task.text}</span>
            <button onClick={() => editTask(task)}>Edit</button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
