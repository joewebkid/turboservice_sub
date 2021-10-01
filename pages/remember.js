import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useRouter } from "next/router";

import axios from "axios";
import FlexBlock from "../components/atoms/FlexBlock";
import { t } from "../components/translation/data";
import LangChooser from "../components/atoms/LangChooser";
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
          <FlexBlock justify="center" className="mb-4">
            <img
              src="/TLT-Logo.png"
              alt="Aktsiaselts Tallinna Linnatransport (TLT)"
              height="64"
              style={{display: "none"}}
            />
          </FlexBlock>
          <h3>{t("tlt_Repair_orders")}</h3>
          <h5 className="text-secondary text-center">
            {t("restore_password")}
          </h5>
          <FlexBlock justify="center">
            <LangChooser />
          </FlexBlock>

          <Form>
            {router.query.session != undefined ? (
              <Alert variant="warning">{t("session_expired")}</Alert>
            ) : (
              <></>
            )}
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="text"
                placeholder={t("login_placeholder")}
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
                onClick={() => {
                  if (login) auth_login(login, setError, setSuccess, router);
                }}
              >
                {t("restore")}
              </Button>
            </Form.Group>
            <Form.Group
              controlId="formBasicPassword"
              className="formGroupCenter"
            >
              <a href="/login" className="ForgetPwd">
                {t("to_sign")}
              </a>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RememberPasswordPage;
