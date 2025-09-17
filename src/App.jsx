import React from "react";
import { TodoApp } from "./todo/TodoApp";
import { Container, Row, Col } from "react-bootstrap";

function App() {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <TodoApp />
        </Col>
      </Row>
    </Container>
  );
}

export default App;