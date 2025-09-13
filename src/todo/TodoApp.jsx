import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, toggleTodo, deleteTodo, updateTodo } from '../slice/todoSlice';
import { Button, Form, InputGroup, ListGroup, Modal, Container, Card } from 'react-bootstrap';
import { PlusLg, Check2Square, Pencil, Trash } from 'react-bootstrap-icons';

export function TodoApp() {
  const [name, setName] = useState('');
  const [editName, setEditName] = useState('');
  const [currentTodo, setCurrentTodo] = useState(null);

  const todos = useSelector(state => state.todos);
  const dispatch = useDispatch();

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

  return (
    <Container className="mt-5">
      <Card className="shadow-sm">
        <Card.Body>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Add a new task..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            />
            <Button variant="primary" onClick={handleAddTodo}>
              <PlusLg /> Add
            </Button>
          </InputGroup>

          {todos.length === 0 ? (
            <div className="text-center text-muted mt-4">
              <Check2Square size={48} />
              <p className="mt-2">No tasks yet. Add one above!</p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {todos.map(todo => (
                <ListGroup.Item key={todo.id} className="d-flex justify-content-between align-items-center">
                  <span
                    style={{
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      cursor: 'pointer',
                      flexGrow: 1
                    }}
                    onClick={() => dispatch(toggleTodo(todo.id))}
                  >
                    {todo.text}
                  </span>
                  <div>
                    <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleEdit(todo)}>
                      <Pencil /> Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => dispatch(deleteTodo(todo.id))}>
                      <Trash /> Delete
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      <Modal show={currentTodo !== null} onHide={handleCloseModal} centered>
        <Modal.Header>
          <Modal.Title>Update Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
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