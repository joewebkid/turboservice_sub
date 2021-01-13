import { useEffect, useState } from "react";
import Block from "../../atoms/Block";

const MessageToast = (props) => {
  const { type, text } = props;
  const [toHide, setToHide] = useState(" ");
  useEffect(() => {
    setTimeout(() => {
      setToHide(" toHide");
    }, 200);
    setTimeout(() => {
      setToHide(" toHide hideIt");
    }, 2000);
  }, []);
  return <Block className={"show alert toast-" + type + toHide}>{text}</Block>;
};

export default MessageToast;
