import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

export const login = () => {
  return (
    <Container className="login-container">
      <Row className="login-row">
        <Col className="login-form-1" md="6">
          <h3>TLT Repair orders</h3>

          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Control type="email" placeholder="Login *" />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Control type="password" placeholder="Password *" />
            </Form.Group>

            <Form.Group
              controlId="formBasicPassword"
              className="formGroupCenter"
            >
              <Button variant="primary" type="submit" className="btnSubmit">
                Login
              </Button>
            </Form.Group>
            <Form.Group
              controlId="formBasicPassword"
              className="formGroupCenter"
            >
              <a href="#" class="ForgetPwd">
                Restore password
              </a>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default login;
