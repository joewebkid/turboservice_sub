import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useRouter } from "next/router";

import axios from "axios";
const save_user_data = (response, SESSIONID, user_auth_data) => {
  localStorage.setItem("user_info", response);
  localStorage.setItem("SESSIONID", SESSIONID);
  // localStorage.setItem("auth_data", user_auth_data);
  return true;
};
const auth_login = (login, callback_error, callback_success, router) => {
  return axios
    .get(
      process.env.NEXT_PUBLIC_URL + "/api-v2/auth/remember?Login=" + login,
      {}
    )
    .then(function (response) {
      const { data } = response;
      const { result, SESSIONID } = data;
      const { Status, Message, Response } = result;
      if (Status == 0) {
        callback_error("");
        if (callback_success("Success")) {
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
      if (typeof error) callback_error(error);
      return false;
    });
};
export const RememberPasswordPage = () => {
  const router = useRouter();

  const [login, setLogin] = useState("RID_vol");

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <Container className="login-container">
      <Row className="login-row">
        <Col className="login-form-1" md="6">
          <h3>TLT Repair orders</h3>
          <h5 className="text-secondary text-center">Restore password</h5>

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

            {error ? <Alert variant="danger">{error}</Alert> : <></>}
            {success ? <Alert variant="success">{success}</Alert> : <></>}
            <Form.Group
              controlId="formBasicPassword"
              className="formGroupCenter"
            >
              <Button
                variant="primary"
                className="btnSubmit"
                onClick={() => auth_login(login, setError, setSuccess, router)}
              >
                Restore
              </Button>
            </Form.Group>
            <Form.Group
              controlId="formBasicPassword"
              className="formGroupCenter"
            >
              <a href="/login" className="ForgetPwd">
                To sign in form
              </a>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RememberPasswordPage;