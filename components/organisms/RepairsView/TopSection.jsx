import React from "react";
import { Col, Row } from "react-bootstrap";
import CustomLink from "../../atoms/CustomLink";
import FlexBlock from "../../atoms/FlexBlock";
import Block from "../../atoms/Block";
import Section from "../../atoms/Section";
import { formatDateForView } from "../../molecules/data";
import { t } from "../../translation/data";

const TopSection = (props) => {
  const { order_info } = props;
  const status = order_info["ORDER_STATUS_ID"];
  return (
    <>
      <Section className="text-center mb-4">
        <h5>
          {t("repair_order_for_tlt_reques", {
            repair_request_order_id: order_info["REQUEST_NUMBER"],
            repair_order_id: order_info["WORKORDER_NUMBER"],
            date: formatDateForView(order_info["REQUEST_DATE"], "/"),
          })}
        </h5>
        <FlexBlock
          justify="space-between"
          className="text-left border p-4 mb-4"
        >
          <Block sm>
            <div>{order_info["VEHICLE"]}</div>
            <FlexBlock justify="flex-start">
              <span>
                {" "}
                {t("registration")} {order_info["VEHICLE_REGISTRATION_DATE"]}
              </span>
            </FlexBlock>
            <FlexBlock justify="flex-start">
              <span style={{ whiteSpace: "nowrap", display: "block" }}>
                {t("tlt_contact")}
                &nbsp;
              </span>
              <span className="text-right">
                {order_info["CONTACT_NAME"]} {order_info["CONTACT_PHONE"]},{" "}
                {order_info["CONTACT_EMAIL"] ? (
                  <CustomLink href={"mailto:" + order_info["CONTACT_EMAIL"]}>
                    {order_info["CONTACT_EMAIL"]}
                  </CustomLink>
                ) : (
                  <></>
                )}
              </span>
            </FlexBlock>
          </Block>
          <Block sm={2} style={{ maxWidth: 290, width: "100%" }}>
            <FlexBlock justify="space-between">
              <span>{t("plate")}</span>
              <span>{order_info["PLATE_NUMBER"]}</span>
            </FlexBlock>
            <FlexBlock justify="space-between">
              <span>{t("garage")}</span>
              <span>{order_info["GARAGE_NUMBER"]}</span>
            </FlexBlock>
          </Block>
          <Block sm className="text-right">
            <FlexBlock justify="flex-start">{order_info["VIN"]}</FlexBlock>
            <FlexBlock justify="flex-start">
              {t("manufacture_year")} {order_info["VEHICLE_MANUFACTURE_YEAR"]}
            </FlexBlock>{" "}
            <FlexBlock justify="space-between" className="mt-2">
              <span>{t("status")}</span>
              <b
                className={
                  status == 2
                    ? "text-success"
                    : status == 1
                    ? "text-warning"
                    : "text-secondary"
                }
              >
                {t(order_info["ORDER_STATUS_NAME"])}
              </b>
            </FlexBlock>
          </Block>
        </FlexBlock>
      </Section>
    </>
  );
};

export default TopSection;
