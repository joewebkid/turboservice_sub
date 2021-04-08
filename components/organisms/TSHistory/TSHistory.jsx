import React, { useEffect, useState } from "react";
import Section from "../../atoms/Section";
import axios from "axios";
import { ListGroup } from "react-bootstrap";
import { formatDateForView } from "../../molecules/data";
import Block from "../../atoms/Block";
import { t } from "../../translation/data";

const getJobsAndPartsList = (
  id,
  SESSIONID,
  callback,
  prevData = [],
  offset = 0
) => {
  axios
    .get(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/JobsAndPartsListByVehicleID/" +
        id +
        "?SESSIONID=" +
        SESSIONID +
        "&Total=1" +
        (offset ? "&Offset=" + offset : "")
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;
      const { Response } = result;
      const { JobsAndPartsListByVehicleID } = Response;
      const { data: dataRecord, totalRecords } = JobsAndPartsListByVehicleID;
      // console.log(totalRecords);
      callback([...prevData, ...dataRecord]);
      // console.log("totalRecords - offset - 200", totalRecords - offset - 200);
      // console.log(dataRecord.length);
      // console.log(
      //   `dataRecord.length(${dataRecord.length}) <= totalRecords(${totalRecords}) - offset(${offset})`,
      //   dataRecord.length <= totalRecords - offset
      // );
      if (dataRecord.length < totalRecords - offset)
        getJobsAndPartsList(
          id,
          SESSIONID,
          callback,
          [...prevData, ...dataRecord],
          offset + 200
        );
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
                const days_num =
                  (new Date(order["WORKORDER_END_DATE"]).getTime() -
                    new Date(order["WORKORDER_CREATE_DATE"]).getTime()) /
                  1000 /
                  60 /
                  1440;
                // jobsAndPartsListFiltred =
                //   jobsAndPartsListFiltred === undefined
                //     ? false
                //     : jobsAndPartsListFiltred;

                return (
                  <Block className="text-left box border mb-2">
                    <Block className="headerTableList">
                      {t("repair_order")}
                      {order["WORKORDER_NUMBER"]};{order["ORDER_TYPE_NAME"]}.{" "}
                      <span>
                        {t("milage")} {order["VEHICLE_MILEAGE"]}.{" "}
                      </span>
                      <br />
                      <span>{t("started")}:</span>{" "}
                      {formatDateForView(order["WORKORDER_CREATE_DATE"], "/")}{" "}
                      <span>{t("finished")}:</span>{" "}
                      {formatDateForView(order["WORKORDER_END_DATE"], "/")} ({" "}
                      {days_num} {t("days_short")})
                    </Block>
                    <Block className="p-2">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>{t("type")}</th>
                            <th>{t("name")}</th>
                            <th>{t("amount")}</th>
                          </tr>
                        </thead>
                        {!jobsAndPartsListFiltred ? (
                          <></>
                        ) : (
                          jobsAndPartsListFiltred.map((job) => (
                            <tr>
                              <td style={{ width: "15%" }}>
                                {job.POS_TYPE_NAME}
                              </td>
                              <td style={{ width: "80%" }}>{job.NAME}</td>
                              <td style={{ width: "5%" }}>
                                {Number(job.AMOUNT).toFixed(2)}
                              </td>
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
