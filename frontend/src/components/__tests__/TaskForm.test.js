import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from '../TaskForm';

describe('TaskForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders create form correctly', () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText('Nueva Tarea')).toBeInTheDocument();
    expect(screen.getByLabelText('Título *')).toBeInTheDocument();
    expect(screen.getByLabelText('Descripción')).toBeInTheDocument();
    expect(screen.getByLabelText('Prioridad')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  test('renders edit form with task data', () => {
    const mockTask = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'high',
    };

    render(
      <TaskForm task={mockTask} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing />
    );

    expect(screen.getByText('Editar Tarea')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    // Selected option label is displayed for selects
    expect(screen.getByDisplayValue('Alta')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /actualizar/i })).toBeInTheDocument();
  });

  test('handles form submission correctly', () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = screen.getByLabelText('Título *');
    const descriptionInput = screen.getByLabelText('Descripción');
    const prioritySelect = screen.getByLabelText('Prioridad');
    const submitButton = screen.getByRole('button', { name: /crear/i });

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'New Description',
      priority: 'high',
    });
  });

  test('handles form cancellation', () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('requires title field', () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = screen.getByLabelText('Título *');
    const submitButton = screen.getByRole('button', { name: /crear/i });

    fireEvent.click(submitButton);

    expect(titleInput).toBeInvalid();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
