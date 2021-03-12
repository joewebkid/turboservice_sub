import React, { useEffect, useState } from "react";
import Section from "../../atoms/Section";
import axios from "axios";
import { ListGroup } from "react-bootstrap";
import { formatDateForView } from "../../molecules/data";
import Block from "../../atoms/Block";

const getJobsAndPartsList = (id, SESSIONID, callback) => {
  axios
    .get(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/JobsAndPartsListByVehicleID/" +
        id +
        "?SESSIONID=" +
        SESSIONID
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;
      const { Response } = result;
      const { JobsAndPartsListByVehicleID } = Response;
      // console.log(response);
      callback(JobsAndPartsListByVehicleID.data);
    })
    .catch(function (error) {
      console.log(error);
    });
};

const getWorkOrdersList = (id, SESSIONID, callback) => {
  axios
    .get(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkordersListByVehicleID/" +
        id +
        "?SESSIONID=" +
        SESSIONID
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;
      const { Response } = result;
      const { WorkordersListByVehicleID } = Response;
      // console.log(response);
      callback(WorkordersListByVehicleID.data);
    })
    .catch(function (error) {
      console.log(error);
    });
};
const TSHistory = (props) => {
  const { SESSIONID, user_info, vehiclesId } = props;
  const [workOrderList, setWorkOrderList] = useState([]);
  const [jobsAndPartsList, setJobsAndPartsList] = useState([]);

  useEffect(() => {
    if (SESSIONID && vehiclesId) {
      getWorkOrdersList(vehiclesId, SESSIONID, setWorkOrderList);
      getJobsAndPartsList(vehiclesId, SESSIONID, setJobsAndPartsList);
    }
  }, [SESSIONID]);

  return (
    <>
      <Section className="text-center mb-4  tsHistory">
        <Block>
          {workOrderList === undefined ? (
            <></>
          ) : (
            <>
              {workOrderList.map((order) => {
                const jobsAndPartsListFiltred = jobsAndPartsList.filter(
                  (i) => i.WORKORDER_ID == order.WORKORDER_ID
                );

                // jobsAndPartsListFiltred =
                //   jobsAndPartsListFiltred === undefined
                //     ? false
                //     : jobsAndPartsListFiltred;

                return (
                  <Block className="text-left box border mb-2">
                    <Block className="headerTableList">
                      Repair order #{order["WORKORDER_NUMBER"]} from{" "}
                      {formatDateForView(order["WORKORDER_END_DATE"], "/")}.
                      Millage {order["VEHICLE_MILEAGE"]}.{" "}
                      {order["ORDER_TYPE_NAME"]}
                    </Block>
                    <Block className="p-2">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        {!jobsAndPartsListFiltred ? (
                          <></>
                        ) : (
                          jobsAndPartsListFiltred.map((job) => (
                            <tr>
                              <td>{job.POS_TYPE_NAME}</td>
                              <td>{job.NAME}</td>
                              <td>{Number(job.AMOUNT).toFixed(2)}</td>
                            </tr>
                          ))
                        )}
                      </table>
                    </Block>
                  </Block>
                );
              })}
            </>
          )}
        </Block>
      </Section>
    </>
  );
};
export default TSHistory;
