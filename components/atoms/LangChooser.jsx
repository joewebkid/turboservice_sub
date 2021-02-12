import React, { useState, useEffect } from "react";
import FlexBlock from "./FlexBlock";
import Block from "./Block";
import { langs } from "./data";
import { useRouter, useLocation } from "next/router";

const LangChooser = (props) => {
  const [choosed_lang, setLang] = useState(0);
  const [isNotFirstTime, setIsNotFirstTime] = useState(0);
  const router = useRouter();
  useEffect(() => {
    if (choosed_lang) {
      localStorage.setItem("lang", choosed_lang);

      if (isNotFirstTime) router.reload();
      else setIsNotFirstTime(1);
    }
  }, [choosed_lang]);

  useEffect(() => {
    setLang(
      typeof window !== "undefined" ? localStorage.getItem("lang") : langs[0]
    );
  }, []);

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
