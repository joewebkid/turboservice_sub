import React, { useState } from "react";
import { Image, Spinner } from "react-bootstrap";
import Block from "../atoms/Block";
import FlexBlock from "../atoms/FlexBlock";

const LogoName = (props) => {
  const [loading, setLoading] = useState(false);
  const { user_info, SESSIONID } = props;
  return (
    <Block>
      <FlexBlock className="imageLogoBlock">
        <h5>{user_info.CompanyName}</h5>
        {user_info.CompanyLogoURL ? (
          <Image src={user_info.CompanyLogoURL} className="imageLogo box" />
        ) : (
          <></>
        )}
      </FlexBlock>
      <>
        {SESSIONID ? (
          <FlexBlock
            className={"btn btn-link" + (loading ? " loading" : "")}
            justify="flex-end"
            onClick={() => {
              if (!loading) {
                setLoading(true);
                logout(SESSIONID, router);
              }
            }}
          >
            Logout {loading ? <Spinner animation="grow" /> : <></>}
          </FlexBlock>
        ) : (
          <></>
        )}
      </>
    </Block>
  );
};

export default LogoName;

{
  /*  */
}
