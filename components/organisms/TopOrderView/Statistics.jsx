import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { statistic } from "./data";
import axios from "axios";

const get_stat = (callback, SESSIONID, auth_data) => {
  if (SESSIONID)
    axios
      .get(
        "https://zenon.basgroup.ru:55723/api-v2/Contractors/WorkshopStatistics30Days?SESSIONID=" +
          SESSIONID,
        {
          auth: auth_data,
        }
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
      });
};

const Statistics = (props) => {
  const { SESSIONID, auth_data } = props;
  useEffect(() => {
    if (SESSIONID && auth_data) get_stat(setStats, SESSIONID, auth_data);
  }, [SESSIONID, auth_data]);

  const [stats, setStats] = useState([]);
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
                      <th scope="row">{x}</th>
                    ) : (
                      <td>{typeof x != "object" ? Number(x).toFixed(2) : x}</td>
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
