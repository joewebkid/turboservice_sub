import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
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

const get_messages = (callback, SESSIONID) => {
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

        callback(Messages.data[0]);
      })
      .catch(function (error) {
        console.log(error);
      });
};

const Statistics = (props) => {
  const { SESSIONID } = props;
  useEffect(() => {
    if (SESSIONID) {
      get_stat(setStats, SESSIONID);
      get_messages(setMessages, SESSIONID);
    }
  }, [SESSIONID]);

  const [stats, setStats] = useState([]);
  const [messages, setMessages] = useState([]);
  // AVERAGE_NORM_HOURS: "1.0000"
  // AVERAGE_VEHICLE_REPAIR_TIME: null
  // ID: 1
  // SERVICED_VEHICLES: "2"
  // TOTAL_REPAIR_ORDERS_DONE: "2"

  return (
    <>
      <p className="text-left b500">Statistics for 30 days</p>
      <Table bordered striped className="text-center" style={{ maxWidth: 500 }}>
        <thead>
          <tr>
            {statistic.map((e) => (
              <th scope="col">{e.title}</th>
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
