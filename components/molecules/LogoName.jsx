import React from "react";
import { Image } from "react-bootstrap";
import FlexBlock from "../atoms/FlexBlock";

const LogoName = (props) => {
  const { user_info } = props;
  return (
    <FlexBlock className="imageLogo">
      <h4>{user_info.CompanyName}</h4>
      {user_info.CompanyLogoURL ? (
        <Image src={user_info.CompanyLogoURL} thumbnail className="imageLogo" />
      ) : (
        <></>
      )}
    </FlexBlock>
  );
};

export default LogoName;

{
  /*  */
}
