import React from "react";
import { TodoApp } from "./todo/TodoApp";
import { Container, Row, Col } from "react-bootstrap";

function App() {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h1 className="text-center my-4">My Todo App</h1>
          <TodoApp />
        </Col>
      </Row>
    </Container>
  );
}

export default App;