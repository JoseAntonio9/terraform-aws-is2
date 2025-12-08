import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { taskAPI } from '../services/api';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const { user, logout } = useAuth();

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTasks();
      setTasks(response.data.tasks);
    } catch (err) {
      setError('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await taskAPI.createTask(taskData);
      setTasks([...tasks, response.data.task]);
      setShowForm(false);
    } catch (err) {
      setError('Error al crear la tarea');
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      const response = await taskAPI.updateTask(id, taskData);
      setTasks(tasks.map((task) => (task.id === id ? response.data.task : task)));
      setEditingTask(null);
    } catch (err) {
      setError('Error al actualizar la tarea');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskAPI.deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError('Error al eliminar la tarea');
    }
  };

  const handleToggleComplete = async (task) => {
    await handleUpdateTask(task.id, { ...task, completed: !task.completed });
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>TaskFlow</h1>
          <div className="user-info">
            <span>Bienvenido, {user?.username}!</span>
            <button onClick={logout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total de Tareas</h3>
            <p className="stat-number">{totalTasks}</p>
          </div>
          <div className="stat-card">
            <h3>Completadas</h3>
            <p className="stat-number">{completedTasks}</p>
          </div>
          <div className="stat-card">
            <h3>Pendientes</h3>
            <p className="stat-number">{totalTasks - completedTasks}</p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="task-controls">
          <button onClick={() => setShowForm(true)} className="add-task-button">
            + Nueva Tarea
          </button>
        </div>

        {showForm && (
          <TaskForm onSubmit={handleCreateTask} onCancel={() => setShowForm(false)} />
        )}

        {editingTask && (
          <TaskForm
            task={editingTask}
            onSubmit={(taskData) => handleUpdateTask(editingTask.id, taskData)}
            onCancel={() => setEditingTask(null)}
            isEditing
          />
        )}

        {loading ? (
          <div className="loading">Cargando tareas...</div>
        ) : (
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onEdit={setEditingTask}
            onDelete={handleDeleteTask}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;

