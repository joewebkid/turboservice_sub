import React from "react";
import axios from "axios";

const get_vehicles = (callback, SESSIONID, auth_data) => {
  if (SESSIONID)
    axios
      .get(
        process.env.NEXT_PUBLIC_URL +
          "/api-v2/Contractors/VehiclesList?Total=1&SESSIONID=" +
          SESSIONID
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

  axios
    .get(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkordersListByVehicleID/210777?SESSIONID=" +
        SESSIONID
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

  axios
    .get(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/JobsAndPartsListByWorkorderID/130888?SESSIONID=" +
        SESSIONID
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

  axios
    .get(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/JobsAndPartsListCSV?SESSIONID=" +
        SESSIONID
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

const VehiclesListBackup = (props) => {
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

export default VehiclesListBackup;
