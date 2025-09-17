import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
  updateTodo,
} from '../slice/todoSlice'; // Ensure this path is correct
import {
  Button,
  Form,
  InputGroup,
  ListGroup,
  Modal,
  Container,
  Card,
  Badge,
  Stack,
} from 'react-bootstrap';
import { PlusLg, Check2Square, Pencil, Trash } from 'react-bootstrap-icons';
import './TodoApp.css';

export function TodoApp() {
  const [name, setName] = useState('');
  const [editName, setEditName] = useState('');
  const [currentTodo, setCurrentTodo] = useState(null);

  const { todoData: todos, todoLoading } = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = () => {
    if (name.trim()) {
      dispatch(addTodo(name));
      setName('');
    }
  };

  const handleUpdate = () => {
    if (editName.trim() && currentTodo) {
      dispatch(updateTodo({ id: currentTodo.id, newText: editName }));
      setCurrentTodo(null);
    }
  };

  const handleEdit = (todo) => {
    setCurrentTodo(todo);
    setEditName(todo.text);
  };

  const handleCloseModal = () => {
    setCurrentTodo(null);
  };

  const sortedTodos = [...todos].sort((a, b) => a.completed - b.completed);

  return (
    <Container className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <Card
        className="shadow-lg border-0"
        style={{ maxWidth: '600px', margin: 'auto' }}
      >
        <Card.Header
          as="h4"
          className="fw-bold text-center p-3 bg-primary text-white"
        >
          My To-Do List
        </Card.Header>
        <Card.Body className="p-4">
          <Stack gap={4}>
            <InputGroup>
              <Form.Control
                placeholder="Add a new task..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                className="py-2"
              />
              <Button variant="primary" onClick={handleAddTodo}>
                <PlusLg className="me-2" />
                Add
              </Button>
            </InputGroup>

            {todoLoading ? (
              <div className="text-center">Loading...</div>
            ) : sortedTodos.length === 0 ? (
              <div className="text-center text-muted mt-4">
                <Check2Square size={50} />
                <p className="mt-3 fs-5">Your to-do list is empty!</p>
              </div>
            ) : (
              <ListGroup variant="flush">
                {sortedTodos.map((todo) => (
                  <ListGroup.Item
                    key={todo.id}
                    className="d-flex justify-content-between align-items-center todo-item"
                  >
                    <div
                      className="d-flex align-items-center flex-grow-1 me-3"
                      style={{ cursor: 'pointer', minWidth: 0 }}
                      onClick={() => dispatch(toggleTodo(todo))}
                    >
                      <Form.Check
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => {}}
                        className="me-3"
                      />
                      <span
                        className={
                          todo.completed
                            ? 'text-decoration-line-through text-muted'
                            : ''
                        }
                        style={{ wordBreak: 'break-word' }}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <div className="d-flex align-items-center">
                      {todo.completed ? (
                        <Badge pill bg="success" className="me-3">
                          Completed
                        </Badge>
                      ) : (
                        <Badge pill bg="warning" text="dark" className="me-3">
                          Pending
                        </Badge>
                      )}
                      <div className="todo-actions">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(todo)}
                        >
                          <Pencil /> Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => dispatch(deleteTodo(todo.id))}
                        >
                          <Trash /> Remove
                        </Button>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )
          }
          </Stack>
        </Card.Body>
      </Card>

      <Modal show={currentTodo !== null} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
            autoFocus
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}