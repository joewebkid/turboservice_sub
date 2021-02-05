import React, { useEffect, useState } from "react";
import { Modal, Table, Button } from "react-bootstrap";
import { statistic } from "./data";
import axios from "axios";

const get_stat = (callback, SESSIONID) => {
  if (SESSIONID)
    axios
      .get(
        process.env.NEXT_PUBLIC_URL +
          "/api-v2/Contractors/WorkshopStatistics30Days?SESSIONID=" +
          SESSIONID
        // {
        //   auth: auth_data,
        // }
      )
      .then(function (response) {
        const { data } = response;
        const { result } = data;
        const { Response } = result;
        const { WorkshopStatistics30Days } = Response;

        callback(WorkshopStatistics30Days.data[0]);
      })
      .catch(function (error) {
        console.log(error);
        // router.push("/login?session");
      });
};

const get_messages = (callback, SESSIONID, handleShow) => {
  if (SESSIONID)
    axios
      .get(
        process.env.NEXT_PUBLIC_URL +
          "/api-v2/Contractors/GetMessages?SESSIONID=" +
          SESSIONID
        // {
        //   auth: auth_data,
        // }
      )
      .then(function (response) {
        const { data } = response;
        const { result } = data;
        const { Response } = result;
        const { Messages } = Response;
        if (
          Messages &&
          Messages.data &&
          Messages.data[0] != undefined &&
          Messages.data[0].MESSAGE != undefined
        ) {
          callback(Messages.data[0].MESSAGE);

          localStorage.setItem("shown_modal", 1);
          handleShow();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
};

const Statistics = (props) => {
  const { SESSIONID, shownModal } = props;

  const [stats, setStats] = useState([]);
  const [messages, setMessages] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (SESSIONID) {
      get_stat(setStats, SESSIONID);
      if (!shownModal) get_messages(setMessages, SESSIONID, handleShow);
    }
  }, [SESSIONID]);

  // AVERAGE_NORM_HOURS: "1.0000"
  // AVERAGE_VEHICLE_REPAIR_TIME: null
  // ID: 1
  // SERVICED_VEHICLES: "2"
  // TOTAL_REPAIR_ORDERS_DONE: "2"

  return (
    <>
      <Modal show={show && !shownModal && messages} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{"Warning"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{messages}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Ок
          </Button>
        </Modal.Footer>
      </Modal>
      <p className="text-left b500">Statistics for 30 days</p>
      <Table
        bordered
        striped
        className="text-center box"
        style={{ maxWidth: 500 }}
      >
        <thead>
          <tr>
            {statistic.map((e, k) => (
              <th scope="col" key={k}>
                {e.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="">
            {stats ? (
              statistic.map((e, k) => {
                const x = stats[e.slug];
                return (
                  <>
                    {!k || !x ? (
                      <th scope="row" key={k}>
                        {x}
                      </th>
                    ) : (
                      <td key={k}>
                        {typeof x != "object" ? Number(x).toFixed(2) : x}
                      </td>
                    )}
                  </>
                );
              })
            ) : (
              <></>
            )}
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default Statistics;
