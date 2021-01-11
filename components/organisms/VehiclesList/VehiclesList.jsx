import React from "react";
import axios from "axios";

const get_vehicles = (callback, SESSIONID, auth_data) => {
  if (SESSIONID)
    axios
      .get(
        process.env.NEXT_PUBLIC_URL +
          "/api-v2/Contractors/VehiclesList?SESSIONID=" +
          SESSIONID,
        {
          //   auth: auth_data,
        }
      )
      .then(function (response) {
        const { data } = response;
        const { result } = data;
        const { Response } = result;
        const { VehiclesList } = Response;
        // console.log(response);
        callback(VehiclesList.data);
      })
      .catch(function (error) {
        console.log(error);
      });
};

const VehiclesList = (props) => {
  const { SESSIONID, auth_data } = props;
  return (
    <div
      onClick={() => {
        get_vehicles(console.log, SESSIONID, auth_data);
      }}
    >
      de
    </div>
  );
};

export default VehiclesList;
