import { Button } from "react-bootstrap";
import React from "react";
import Block from "../../atoms/Block";
import CustomLink from "../../atoms/CustomLink";
import FlexBlock from "../../atoms/FlexBlock";
import Section from "../../atoms/Section";
import Fade from "react-reveal/Fade";

const RequestSection = (props) => {
  const { order_info, callback_start, callback_cancel, callback_done } = props;
  return (
    <>
      <Section className="text-center">
        <Block className="text-left w500">Repair request</Block>
        <FlexBlock justify="space-between" className="text-left">
          <Block
            className="border p-1 mb-1"
            style={{ minWidth: 470 }}
            dangerouslySetInnerHTML={{ __html: order_info["REQUEST_TEXT"] }}
          />
          <FlexBlock
            className="p-1 mb-2 text-right"
            style={{ whiteSpace: "nowrap", marginLeft: 40 }}
          >
            {order_info["ORDER_STATUS_ID"] == 0 ? (
              <Fade>
                <Button
                  variant="warning"
                  className="mr-2"
                  onClick={callback_start}
                >
                  Start jobs
                </Button>
              </Fade>
            ) : order_info["ORDER_STATUS_ID"] == 1 ? (
              <Fade>
                <Button
                  variant="danger"
                  className="mr-2"
                  onClick={() =>
                    confirm(
                      "Warring. Are you sure cancel start repair order?",
                      callback_cancel()
                    )
                  }
                >
                  Cancel start
                </Button>
                <Button variant="success" onClick={callback_done}>
                  Repair order done
                </Button>
              </Fade>
            ) : (
              <></>
            )}
          </FlexBlock>
        </FlexBlock>
      </Section>
    </>
  );
};

export default RequestSection;
