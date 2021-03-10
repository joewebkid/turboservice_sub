import React, { useEffect, useState } from "react";
import Section from "../../atoms/Section";
import axios from "axios";
import { ListGroup } from "react-bootstrap";
import { formatDateForView } from "../../molecules/data";

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

  useEffect(() => {
    console.log(vehiclesId);
    if (SESSIONID && vehiclesId) {
      getWorkOrdersList(vehiclesId, SESSIONID, setWorkOrderList);
    }
  }, [SESSIONID]);
  return (
    <>
      <Section className="border p-4 text-center mb-4 box">
        <ListGroup as="ul" className="text-left">
          {workOrderList ? (
            <>
              {workOrderList.map((e) => (
                <ListGroup.Item as="li">
                  Repair order #{e["WORKORDER_ID"]} from{" "}
                  {formatDateForView(e["WORKORDER_ID"])}. Millage{" "}
                  {e["VEHICLE_MILEAGE"]}. {e["ORDER_TYPE_NAME"]}
                </ListGroup.Item>
              ))}
            </>
          ) : (
            <></>
          )}
        </ListGroup>
      </Section>
    </>
  );
};
export default TSHistory;
