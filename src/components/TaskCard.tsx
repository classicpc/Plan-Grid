import React from 'react';
import { Trash2, Edit, CheckCircle, Calendar, ArrowRight, Check } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  isCompleted?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onDelete, 
  onComplete, 
  onEdit, 
  onDragStart,
  isCompleted = false
}) => {
  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-amber-100 text-amber-800',
    low: 'bg-green-100 text-green-800'
  };

  const handleMoveToInProgress = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.status === 'todo') {
      const updatedTask = { ...task, status: 'in-progress' as const };
      onEdit(updatedTask);
    }
  };

  const handleMoveToCompleted = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.status === 'in-progress') {
      const updatedTask = { ...task, status: 'completed' as const };
      onEdit(updatedTask);
    }
  };

  return (
    <div 
      className={`apple-task-card p-3 cursor-grab ${
        isCompleted ? 'opacity-80' : ''
      }`}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
          {task.title}
        </h3>
        <div className="flex gap-1">
          {task.status === 'todo' && (
            <button 
              onClick={handleMoveToInProgress}
              className="text-[#0071e3] hover:text-[#0077ed] p-1"
              title="Move to In Progress"
            >
              <ArrowRight size={16} />
            </button>
          )}
          {task.status === 'in-progress' && (
            <button 
              onClick={handleMoveToCompleted}
              className="text-[#29c76f] hover:text-green-600 p-1"
              title="Move to Completed"
            >
              <Check size={16} />
            </button>
          )}
          {!isCompleted && (
            <button 
              onClick={() => onComplete(task.id)}
              className="text-[#29c76f] hover:text-green-600 p-1"
              title="Mark as Complete"
            >
              <CheckCircle size={16} />
            </button>
          )}
          <button 
            onClick={() => onEdit(task)}
            className="text-gray-600 hover:text-gray-800 p-1"
            title="Edit Task"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="text-[#ff3b30] hover:text-[#ff453a] p-1"
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="text-sm text-gray-600 mb-2">
          {task.description}
        </p>
      )}
      
      <div className="flex flex-wrap gap-2 mt-2">
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs apple-tag bg-gray-100 text-gray-700">
            <Calendar size={12} />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
        
        <div className={`text-xs apple-tag ${priorityColors[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
        </div>
      </div>
    </div>
  );
};

export default TaskCard;