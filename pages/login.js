import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useRouter } from "next/router";

import axios from "axios";
const save_user_data = (response, SESSIONID) => {
  localStorage.setItem("user_info", response);
  localStorage.setItem("SESSIONID", SESSIONID);
  return true;
};
const auth_login = (
  login,
  password,
  callback_error,
  callback_success,
  router
) => {
  return axios
    .get("https://zenon.basgroup.ru:55723/api-v2/auth/login", {
      auth: {
        username: login,
        password: password,
      },
    })
    .then(function (response) {
      const { data } = response;
      const { result, SESSIONID } = data;
      const { Status, Message, Response } = result;
      if (Status == 0) {
        callback_error("");
        if (callback_success(JSON.stringify(Response), SESSIONID)) {
          router.push("/");
          return SESSIONID;
        }
      } else {
        callback_error(Message);
        return false;
      }
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
      callback_error(error);
      return false;
    });
};
export const LoginPage = () => {
  const router = useRouter();
  // router.query.session
  console.log(router.query.session == undefined);
  const [login, setLogin] = useState("RID_vol");
  const [password, setPassword] = useState("1");

  const [error, setError] = useState(false);

  return (
    <Container className="login-container">
      <Row className="login-row">
        <Col className="login-form-1" md="6">
          <h3>TLT Repair orders</h3>

          <Form>
            {router.query.session != undefined ? (
              <Alert variant="warning">Your session time is expired</Alert>
            ) : (
              <></>
            )}
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="text"
                placeholder="Login *"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Password *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            {error ? <Alert variant="danger">{error}</Alert> : <></>}
            <Form.Group
              controlId="formBasicPassword"
              className="formGroupCenter"
            >
              <Button
                variant="primary"
                // type="submit"
                className="btnSubmit"
                onClick={() =>
                  auth_login(login, password, setError, save_user_data, router)
                }
              >
                Login
              </Button>
            </Form.Group>
            <Form.Group
              controlId="formBasicPassword"
              className="formGroupCenter"
            >
              <a href="#" className="ForgetPwd">
                Restore password
              </a>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
