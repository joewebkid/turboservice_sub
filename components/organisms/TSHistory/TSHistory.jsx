import React from "react";
const getWorkOrdersList = () => {
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
      const { WorkordersListByVehicleID } = Response;
      // console.log(response);
      callback(WorkordersListByVehicleID.data);
    })
    .catch(function (error) {
      console.log(error);
    });
};
export default function TSHistory() {
  return <div>2</div>;
}
