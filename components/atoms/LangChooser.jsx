import React, { useState } from "react";
import FlexBlock from "./FlexBlock";
import Block from "./Block";
import { langs } from "./data";

const LangChooser = (props) => {
  const [choosed_lang, setLang] = useState(langs[0]);
  return (
    <FlexBlock>
      {langs.map((l, k) => (
        <>
          {k ? <Block className="divider_lang">|</Block> : ""}
          <Block
            key={k}
            onClick={() => setLang(l)}
            className={choosed_lang != l ? "lang_symb" : "active_symb"}
          >
            {l}
          </Block>
        </>
      ))}
    </FlexBlock>
  );
};

export default LangChooser;
