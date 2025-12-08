import React from 'react';

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'low':
        return 'Baja';
      default:
        return 'Media';
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <div className="task-header">
          <div className="task-checkbox">
            <input type="checkbox" checked={task.completed} onChange={() => onToggleComplete(task)} />
          </div>
          <h4 className="task-title">{task.title}</h4>
          <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
            {getPriorityText(task.priority)}
          </span>
        </div>

        {task.description && <p className="task-description">{task.description}</p>}

        <div className="task-meta">
          <span className="task-date">Creada: {formatDate(task.created_at)}</span>
          {task.updated_at !== task.created_at && (
            <span className="task-date">Actualizada: {formatDate(task.updated_at)}</span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button onClick={() => onEdit(task)} className="edit-button" title="Editar tarea">
          ✏️
        </button>
        <button
          onClick={() => {
            if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
              onDelete(task.id);
            }
          }}
          className="delete-button"
          title="Eliminar tarea"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TaskItem;

