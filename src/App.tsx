import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, CheckCircle, XCircle, Info } from 'lucide-react';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import { Task, Column } from './types';

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
    setShowForm(false);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setEditingTask(null);
    setShowForm(false);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const markAsComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: 'completed' } : task
    ));
  };

  const moveTask = (taskId: string, newStatus: Column) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const clearAllTasks = () => {
    if (window.confirm('Are you sure you want to clear all tasks?')) {
      setTasks([]);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, columnStatus: Column) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    moveTask(taskId, columnStatus);
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="min-h-screen bg-[#f5f5f7] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-[#1d1d1f]">Plan </span> 
            <span className="bg-gradient-to-r from-red-400 via-pink-500 to-blue-500 text-transparent bg-clip-text">
              Grid
            </span>
          </h1>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowForm(true)}
                className="apple-button flex items-center gap-2"
              >
                <PlusCircle size={16} />
                <span>Add Task</span>
              </button>
              <button 
                onClick={clearAllTasks}
                className="apple-button apple-button-danger flex items-center gap-2"
              >
                <Trash2 size={16} />
                <span>Clear All</span>
              </button>
            </div>
          </div>
          
          {tasks.length === 0 && (
            <div className="apple-card p-6 flex items-center gap-3 text-gray-600">
              <Info size={20} className="text-[#0071e3]" />
              <p>Your task board is empty. Click "Add Task" to get started!</p>
            </div>
          )}
        </header>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-[#1d1d1f]">
                  {editingTask ? 'Edit Task' : 'Add New Task'}
                </h2>
                <button 
                  onClick={() => {
                    setShowForm(false);
                    setEditingTask(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={24} />
                </button>
              </div>
              <TaskForm 
                onSubmit={editingTask ? updateTask : addTask} 
                initialTask={editingTask}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Todo Column */}
          <div 
            className="apple-card overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'todo')}
          >
            <div className="bg-[#0071e3] p-4 apple-column-header">
              <h2 className="text-white">To Do</h2>
            </div>
            <div className="p-4 min-h-[200px]">
              {todoTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No tasks to do</p>
              ) : (
                <div className="space-y-3">
                  {todoTasks.map(task => (
                    <TaskCard 
                      key={task.id}
                      task={task}
                      onDelete={deleteTask}
                      onComplete={markAsComplete}
                      onEdit={startEditing}
                      onDragStart={handleDragStart}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div 
            className="apple-card overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'in-progress')}
          >
            <div className="bg-[#f56300] p-4 apple-column-header">
              <h2 className="text-white">In Progress</h2>
            </div>
            <div className="p-4 min-h-[200px]">
              {inProgressTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No tasks in progress</p>
              ) : (
                <div className="space-y-3">
                  {inProgressTasks.map(task => (
                    <TaskCard 
                      key={task.id}
                      task={task}
                      onDelete={deleteTask}
                      onComplete={markAsComplete}
                      onEdit={startEditing}
                      onDragStart={handleDragStart}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Completed Column */}
          <div 
            className="apple-card overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'completed')}
          >
            <div className="bg-[#29c76f] p-4 apple-column-header">
              <h2 className="text-white">Completed</h2>
            </div>
            <div className="p-4 min-h-[200px]">
              {completedTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No completed tasks</p>
              ) : (
                <div className="space-y-3">
                  {completedTasks.map(task => (
                    <TaskCard 
                      key={task.id}
                      task={task}
                      onDelete={deleteTask}
                      onComplete={markAsComplete}
                      onEdit={startEditing}
                      onDragStart={handleDragStart}
                      isCompleted
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;