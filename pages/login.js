import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  ButtonGroup,
} from "react-bootstrap";
import { useRouter } from "next/router";

import axios from "axios";
import FlexBlock from "../components/atoms/FlexBlock";
import { t } from "../components/translation/data";
import LangChooser from "../components/atoms/LangChooser";
import { langCode } from "../components/atoms/data";
import Block from "../components/atoms/Block";
import TextInput from "../components/atoms/TextInput";

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
          localStorage.setItem("type_cab", "orders");

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
      console.log(error);

      callback_error("Server error");
      // if (typeof error) callback_error(error);
      // return false;
    });
};

const logout = () => {
  const SESSIONID = localStorage.getItem("SESSIONID");
  if (SESSIONID) {
    axios
      .get(
        process.env.NEXT_PUBLIC_URL +
          "/api-v2/auth/logout/" +
          "?SESSIONID=" +
          SESSIONID
      )
      .then(function (response) {
        const { data } = response;
        const { result } = data;
        const { Message, Status } = result;

        localStorage.removeItem("filter_values");
        localStorage.removeItem("filter_status");
        localStorage.removeItem("current_page");
        localStorage.removeItem("SESSIONID");

        router.push("/login");
        // console.log(result);
      })
      .catch(function (error) {
        console.log(error);
        localStorage.removeItem("SESSIONID");
        // router.push("/login");
      });
  }
};

export const LoginPage = () => {
  const router = useRouter();

  const [login, setLogin] = useState(
    process.env.NEXT_PUBLIC_STATUS == "DEV" ? "RID_vol" : ""
  );
  const [password, setPassword] = useState(
    process.env.NEXT_PUBLIC_STATUS == "DEV" ? "1" : ""
  );

  useEffect(() => {
    logout();
  }, []);

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

          <h3>{t("tlt_Repair_orders")}</h3>
          <FlexBlock justify="center" className="mb-4 radioLogin">
            <Block className={"indexTab active"}>{t("contractor")}</Block>
            <Block
              className={"indexTab"}
              onClick={() => {
                router.push("/login-vh");
              }}
            >
              {t("viewer")}
            </Block>
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
            <Form.Group controlId="formBasicLogin">
              <Form.Control
                type="text"
                // placeholder={t("login_placeholder")}
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
              {login ? (
                <></>
              ) : (
                <Form.Label>{t("login_placeholder")}</Form.Label>
              )}
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Control
                type="password"
                // placeholder={t("password") + " *"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password ? (
                <></>
              ) : (
                <Form.Label>{t("password") + " *"}</Form.Label>
              )}
            </Form.Group>
            {error ? <Alert variant="danger">{error}</Alert> : <></>}
            <Form.Group
              controlId="formBasicPassword"
              className="formGroupCenter"
            >
              <Button
                variant="primary"
                className="btnSubmit"
                onClick={() => {
                  if (login && password)
                    auth_login(
                      login,
                      password,
                      setError,
                      save_user_data,
                      router
                    );
                  else setError(t("required_field_login"));
                }}
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
