import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Container } from "react-bootstrap";
import VehiclesList from "../../components/organisms/VehiclesList/VehiclesList";
import VehiclesListBackup from "../../components/organisms/VehiclesList/VehiclesListBackup";
import TopOrderView from "../../components/organisms/TopOrderView/TopOrderView";

const get_user_data = (callback, router) => {
  const user_info = localStorage.getItem("user_info");
  const SESSIONID = localStorage.getItem("SESSIONID");
  if (SESSIONID) {
    if (user_info) callback(JSON.parse(user_info));
  } else router.push("/login");

  return SESSIONID;
};
const logout = (SESSIONID, router) => {
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

      router.push("/login");
      // console.log(result);
    })
    .catch(function (error) {
      // console.log(error);
      router.push("/login");
      // router.push("/login");
    });
};

const Vehicles = () => {
  const router = useRouter();
  useEffect(() => {
    setSESSIONID(get_user_data(setUserInfo, router));
  }, []);
  const [user_info, setUserInfo] = useState(false);
  const [SESSIONID, setSESSIONID] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <TopOrderView
        repair_order_list
        user_info={user_info}
        SESSIONID={SESSIONID}
        router={router}
        logout={logout}
      />

      <Container fluid className="mt-3 orders-list-container order-container">
        <VehiclesList
          SESSIONID={SESSIONID}
          setLoading={setLoading}
          loading={loading}
          filter_values={{}}
          type_cab={"vehicles"}
        />
        <VehiclesListBackup
          SESSIONID={SESSIONID}
          setLoading={setLoading}
          loading={loading}
          filter_values={{}}
        />
      </Container>
    </>
  );
};

export default Vehicles;
