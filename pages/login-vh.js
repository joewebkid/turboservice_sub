import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useRouter } from "next/router";

import axios from "axios";
import FlexBlock from "../components/atoms/FlexBlock";
import Block from "../components/atoms/Block";
import { t } from "../components/translation/data";
import LangChooser from "../components/atoms/LangChooser";
import { langCode } from "../components/atoms/data";

const MODAL_SHOWN = 0;

const save_user_data = (response, SESSIONID, user_auth_data) => {
  localStorage.setItem("user_info", response);
  localStorage.setItem("SESSIONID", SESSIONID);
  // localStorage.setItem("auth_data", user_auth_data);
  return true;
};
const auth_login = (
  login,
  password,
  callback_error,
  callback_success,
  router
) => {
  const lang =
    typeof window !== "undefined"
      ? localStorage.getItem("lang")
        ? localStorage.getItem("lang")
        : "en"
      : "en";

  return axios
    .get(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/auth/login?Locale=" +
        langCode[lang],
      {
        auth: {
          username: login,
          password: password,
        },
      }
    )
    .then(function (response) {
      const { data } = response;
      const { result, SESSIONID } = data;
      const { Status, Message, Response } = result;
      if (Status == 0) {
        callback_error("");
        if (
          callback_success(
            JSON.stringify(Response),
            SESSIONID,
            JSON.stringify({
              username: login,
              password: password,
            })
          )
        ) {
          localStorage.removeItem("filter_values");
          localStorage.removeItem("filter_status");
          localStorage.removeItem("current_page");

          localStorage.removeItem("type_cab");
          localStorage.setItem("type_cab", "vehicles");

          localStorage.setItem("shown_modal", MODAL_SHOWN);
          router.push(router.query.redirectto || "/");
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
export const LoginPage = () => {
  const router = useRouter();

  const [login, setLogin] = useState(
    process.env.NEXT_PUBLIC_STATUS == "DEV" ? "SCA_zel" : ""
  );
  const [password, setPassword] = useState(
    process.env.NEXT_PUBLIC_STATUS == "DEV" ? "1" : ""
  );

  const [error, setError] = useState(false);

  return (
    <Container className="login-container">
      <Row className="login-row">
        <Col className="login-form-1" md="6">
          <FlexBlock justify="center" className="mb-4">
            <img
              src="/TLT-Logo.png"
              alt="Aktsiaselts Tallinna Linnatransport (TLT)"
              height="64"
            />
          </FlexBlock>
          <h3>{t("viewer")}</h3>
          <FlexBlock justify="center" className="mb-4 radioLogin">
            <Block
              className={"indexTab "}
              onClick={() => {
                router.push("/login");
              }}
            >
              {t("tlt_Repair_orders")}
            </Block>
            <Block className={"indexTab active"}>{t("viewer")}</Block>
          </FlexBlock>
          <FlexBlock justify="center">
            <LangChooser />
          </FlexBlock>
          <Form>
            {router.query.session != undefined ? (
              <Alert variant="warning">{t("session_expired")}</Alert>
            ) : (
              <></>
            )}
            {router.query.message != undefined ? (
              <Alert variant="warning">{router.query.message}</Alert>
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
                className="btnSubmit"
                onClick={() =>
                  auth_login(login, password, setError, save_user_data, router)
                }
              >
                {t("login")}
              </Button>
            </Form.Group>
            <Form.Group
              controlId="formBasicPassword"
              className="formGroupCenter"
            >
              <a href="/remember" className="ForgetPwd">
                {t("restore_password_to")}
              </a>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
