import React, { useState, useEffect } from "react";
import FlexBlock from "./FlexBlock";
import Block from "./Block";
import { langs, langCode } from "./data";
import { useRouter, useLocation } from "next/router";
import axios from "axios";

const set_lang = (callback, id) => {
  axios
    .get(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/auth/SetLocale/" +
        id +
        "?SESSIONID=" +
        localStorage.getItem("SESSIONID")
    )
    .then(function (response) {
      const { data } = response;
      callback();
    })
    .catch(function (error) {
      console.log(error);
    });
};

const LangChooser = (props) => {
  const [choosed_lang, setLang] = useState(0);
  const [isNotFirstTime, setIsNotFirstTime] = useState(0);
  const router = useRouter();
  useEffect(() => {
    if (choosed_lang) {
      localStorage.setItem("lang", choosed_lang);

      if (router.route != "/remember" && router.route != "/login") {
        if (isNotFirstTime) set_lang(router.reload, langCode[choosed_lang]);
        else setIsNotFirstTime(1);
      } else {
        if (isNotFirstTime) router.reload();
        else setIsNotFirstTime(1);
      }
    }
  }, [choosed_lang]);

  useEffect(() => {
    setLang(
      typeof window !== "undefined"
        ? localStorage.getItem("lang")
          ? localStorage.getItem("lang")
          : langs[1]
        : langs[1]
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
