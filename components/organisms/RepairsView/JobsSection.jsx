import React, { useEffect, useState, useRef } from "react";
import { Table, Button, Popover, OverlayTrigger, Alert } from "react-bootstrap";
import Section from "../../atoms/Section";
import Block from "../../atoms/Block";
import { jobs_struct } from "./data";
import FlexBlock from "../../atoms/FlexBlock";
import { useRouter } from "next/router";
import axios from "axios";
import CustomLink from "../../atoms/CustomLink";
import useDebounce from "../../atoms/FilterInput/useDebounce";
import MessageToast from "./MessageToast";
// import XMLParser from "react-xml-parser";
import { parseXml } from "./DomXml";
import { formatDateForPost } from "../../molecules/data";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import Fade from "react-reveal/Fade";
import { t } from "../../translation/data";

const get_jobs = (callback, id, SESSIONID, setJobsNum) => {
  axios
    .get(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkorderContractJobs/" +
        id +
        "?SESSIONID=" +
        SESSIONID +
        "&Formats=1"
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;
      const { Response } = result;
      const WorkorderJobs = Response["WorkorderContractJobs"];
      // console.log(WorkorderJobs);
      callback(WorkorderJobs.data);
      setJobsNum(WorkorderJobs.data.length);
    })
    .catch(function (error) {
      console.log(error);
    });
};

const delete_jobs = (callback, id, SESSIONID, setMessage, setJobsNum) => {
  axios
    .delete(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkorderContractJobs/" +
        id +
        "?SESSIONID=" +
        SESSIONID,
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;
      const { Message } = result;
      if (Message == "Ok") {
        setMessage({ type: "success", text: "success", show: true });
        setTimeout(() => {
          setMessage({});
        }, 2500);
        callback([]);
        setJobsNum(0);
      }
    })
    .catch(function (error) {
      setMessage({ type: "error", text: "error", show: true });
      setTimeout(() => {
        setMessage({});
      }, 2500);
    });
};

const set_job = (
  callback,
  id,
  SESSIONID,
  changedJobs,
  setMessage,
  jobs,
  setLoadDebounce,
  setJobsNum,
  setSavedComplete
) => {
  const JOB_ID = changedJobs.JOB_ID;
  // delete changedJobs["JOB_ID"];
  setLoadDebounce(false);

  axios
    .post(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkorderContractJob/" +
        id +
        (JOB_ID ? "/" + JOB_ID : "") +
        "?SESSIONID=" +
        SESSIONID,
      changedJobs,
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;
      const { Response, Message, Status } = result;
      const { WorkorderContractJob } = Response;

      if (Status == 0) {
        setMessage({ type: "success", text: "success", show: true });
        setTimeout(() => {
          setMessage({});
        }, 2500);
        callback(
          jobs.map((e) => {
            // console.log(changedJobs.JOB_NAME == e.JOB_NAME, e, changedJobs);
            return changedJobs.JOB_NAME == e.JOB_NAME
              ? { ...e, JOB_ID: WorkorderContractJob.data.JOB_ID }
              : e;
          })
        );
        setJobsNum(jobs.length);
        setSavedComplete();
      } else {
        setMessage({ type: "error", text: "error", show: true });
        setTimeout(() => {
          setMessage({});
        }, 2500);
      }
      setLoadDebounce(true);
    })
    .catch(function (error) {
      setMessage({ type: "error", text: "error", show: true });
      setTimeout(() => {
        setMessage({});
      }, 2500);
      console.log(error);
      setLoadDebounce(true);
    });
};

const delete_job = (callback, id, SESSIONID, JOB_ID, jobs, setJobsNum) => {
  axios
    .delete(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkorderContractJob/" +
        id +
        "/" +
        JOB_ID +
        "?SESSIONID=" +
        SESSIONID,
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;
      const { Message } = result;

      const newJobs = jobs.filter((f) => f.JOB_ID != JOB_ID);
      if (Message == "Ok") callback(newJobs);
      setJobsNum(newJobs.lenght);
      return response;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};

const xmlLoad = async (
  e,
  setErrorText,
  setMessage,
  id,
  SESSIONID,
  errorText,
  refreshPage
) => {
  const file = e.target.files[0];
  const xml_text = await file.text();

  const xml = parseXml(xml_text);
  if (xml.getElementsByTagName("parsererror")[0]) {
    setErrorText(
      xml.getElementsByTagName("parsererror")[0].getElementsByTagName("div")[0]
        .innerHTML
    );

    setMessage({ type: "error", text: "error", show: true });
    setTimeout(() => {
      setMessage({});
    }, 2500);
  } else {
    axios
      .post(
        process.env.NEXT_PUBLIC_URL +
          "/api-v2/Contractors/WorkorderDetails/" +
          id +
          "?SESSIONID=" +
          SESSIONID,
        { data: xml_text },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      )
      .then(function (response) {
        const { data } = response;
        const { result } = data;
        const { Response, Status, Error } = result;
        if (Status == -1) {
          setErrorText(Error && Error.errorInfo && Error.errorInfo[2]);

          setMessage({ type: "error", text: "error", show: true });
          setTimeout(() => {
            setMessage({});
          }, 2500);
        } else {
          setErrorText("");
          refreshPage();
          const { Message } = result;

          if (Message == "Ok") {
            setMessage({ type: "success", text: "success", show: true });
            setTimeout(() => {
              setMessage({});
            }, 2500);
          }
        }
      })
      .catch(function (error) {
        console.log(error);
        return error;
      });
  }
};

const addNew = (jobs, setJobs, jobs_struct) => {
  const titles = jobs_struct.map((s) => {
    return s.slug;
  });
  let empty_object = {};
  titles.forEach((key, index) => {
    empty_object[`${key}`] = jobs_struct[index].default || "";
  });

  setJobs([...jobs, empty_object]);
};
const validation = (data, struct) => {
  let flag = true;
  data.map((e) => {
    struct.map((s) => {
      if (s.required && !e[s["slug"]]) flag = false;
    });
  });
  return flag;
};

const JobsSection = (props) => {
  const {
    SESSIONID,
    refresh,
    refreshPage,
    status,
    setTotal,
    debonceTime,
    save_date,
    save_state,
    setSaveState,
    setJobsNum,
    setJobsNumNotSaved,
    setValideState,
    valide_state,
    saveData,
  } = props;
  const router = useRouter();
  // jobs_struct
  const [jobs, setJobs] = useState([]);
  const [temp_jobs, setTempJobs] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [addNewStringFlag, setAddNewStringFlag] = useState(0);
  const [changedStringId, setChangedStringId] = useState(false);
  const [validate, setValidate] = useState(false);

  const [changedIds, setChangedIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  // console.log(savedIds);
  const popoverRef = useRef(null);
  const popover = (e) => {
    return (
      <Popover id="popover-basic" {...e}>
        <Popover.Title as="h3">{t("load_from_file")}</Popover.Title>
        <Popover.Content>
          {t("you_can_load_template")}
          <Block>
            <CustomLink
              href="/data.xml"
              target="_blank"
              download="template.xml"
              onClick={() => {
                popoverRef.current.click();
              }}
            >
              {t("download_template")}
            </CustomLink>
          </Block>
        </Popover.Content>
      </Popover>
    );
  };

  const [message, setMessage] = useState({});
  const [loadDebounce, setLoadDebounce] = useState(true);

  let tempArr = jobs;
  let jobsSum = {};

  const debouncedSearchTerm = useDebounce(temp_jobs, debonceTime);
  const debouncedValidate = useDebounce(temp_jobs, 300);

  const numberMask = createNumberMask({
    prefix: "",
    suffix: "",
    thousandsSeparatorSymbol: "",
    allowDecimal: true,
    decimalSymbol: ".",
    decimalLimit: 2,
  });

  const lastAdded = useRef(null);

  useEffect(() => {
    if (validation(jobs, jobs_struct)) {
      setJobsNumNotSaved(jobs.length);
      setValideState({ ...valide_state, job: true });
    } else setValideState({ ...valide_state, job: false });

    // if (changedStringId !== false)
    //   setChangedIds(
    //     [...changedIds, changedStringId].filter((value, index, self) => {
    //       return self.indexOf(value) === index;
    //     })
    //   );
  }, [debouncedValidate]);

  useEffect(() => {
    if (lastAdded.current && addNewStringFlag == 1) {
      lastAdded.current.focus();
      // setValideState({ ...valide_state, job: false });
      setAddNewStringFlag(0);
    }
  }, [jobs]);

  useEffect(() => {
    // console.log(save_date, valide_state);
    if (SESSIONID && router && router.query && router.query.id) {
      if (save_state.job) {
        if (jobs[changedStringId]) {
          // console.log(changedStringId);
          let savedIdsTemp = savedIds;
          changedIds.map((changedId) => {
            savedIdsTemp = { ...savedIdsTemp, [changedId]: true };
          });
          setSavedIds(savedIdsTemp);

          changedIds.map((changedId) => {
            let changedJobs = jobs[changedId];
            Object.keys(changedJobs).map((e) => {
              if (
                !changedJobs[e] &&
                (e == "JOB_NORM_HOUR" || e == "JOB_AMOUNT" || e == "JOB_PRICE")
              ) {
                changedJobs[e] = "0.00";
              }
            });

            set_job(
              setJobs,
              router.query.id,
              SESSIONID,
              changedJobs,
              setMessage,
              jobs,
              setLoadDebounce,
              setJobsNum,
              () => {
                setSavedIds({ ...savedIds, [changedId]: false });
              }
            );
          });
          setSaveState({
            ...save_state,
            job: false,
          });
        }
        setChangedIds([]);
        setChangedStringId(false);
      }
    }
  }, [debouncedSearchTerm, save_date]);

  useEffect(() => {
    if (SESSIONID && router && router.query && router.query.id)
      get_jobs(
        setJobs,
        router.query.id,
        SESSIONID,
        setMessage,
        setJobsNumNotSaved
      );
  }, [router, refresh]);

  // console.log(lastAdded);

  return (
    <>
      {message.show ? <MessageToast {...message} /> : <></>}
      <Section className="text-center mb-1 relative">
        <FlexBlock justify="flex-end" className="mb-1">
          <FlexBlock>
            {errorText ? (
              <Alert variant="danger " className="p-1 mb-2 mr-1">
                {errorText}
              </Alert>
            ) : (
              <></>
            )}

            {status != 2 ? (
              <>
                <input className="hide" ref={popoverRef} />
                <label
                  className="btn btn-secondary mr-1"
                  style={{ width: 215, height: 38 }}
                >
                  {t("load_from_file")}
                  <input
                    id="xmlFile"
                    type="file"
                    class="form-control-file"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      xmlLoad(
                        e,
                        setErrorText,
                        setMessage,
                        router.query.id,
                        SESSIONID,
                        errorText,
                        refreshPage
                      );
                      e.target.value = null;
                    }}
                  ></input>
                </label>

                <OverlayTrigger
                  trigger="click"
                  placement="left"
                  overlay={(e) => popover(e)}
                  rootClose={true}
                >
                  <Button
                    variant="secondary"
                    style={{
                      height: 38,
                    }}
                  >
                    ?
                  </Button>
                </OverlayTrigger>
              </>
            ) : (
              <></>
            )}
          </FlexBlock>
        </FlexBlock>

        <FlexBlock
          className="text-left w500 headerTableList"
          justify="space-between"
        >
          {t("jobs")}
          {status != 2 ? (
            <Block
              className="text-left btn btn-link delAllLink"
              onClick={() => {
                if (confirm(t("delete_all_confirm"))) {
                  // setJobsNumNotSaved(0);
                  delete_jobs(
                    setJobs,
                    router.query.id,
                    SESSIONID,
                    setMessage,
                    setJobsNum
                  );

                  setChangedIds([]);
                }
              }}
            >
              {t("delete_all")}
            </Block>
          ) : (
            <></>
          )}
        </FlexBlock>
        <Table>
          <thead>
            <tr>
              {jobs_struct.map((struct) =>
                struct.type != "hidden" ? (
                  <th
                    scope="col"
                    style={struct.width ? { width: struct.width } : {}}
                  >
                    {t(struct.t)}
                  </th>
                ) : (
                  <></>
                )
              )}
              <th scope="col">{t("sum")}</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, key) => {
              if (!jobsSum["sum"]) jobsSum["sum"] = 0;
              jobsSum["sum"] =
                jobsSum["sum"] +
                Number(job["JOB_AMOUNT"] || 0) * Number(job["JOB_PRICE"] || 0);

              setTotal(jobsSum["sum"]);
              return (
                <>
                  <tr key={key}>
                    {jobs_struct.map((struct, k) => {
                      // const value =
                      //   struct.type == "number"
                      //     ? Number(job[struct.slug]).toFixed(2)
                      //     : job[struct.slug];
                      const value = job[struct.slug];

                      if (struct.type == "number") {
                        if (!jobsSum[struct.slug]) jobsSum[struct.slug] = 0;

                        jobsSum[struct.slug] =
                          Number(jobsSum[struct.slug]) +
                          (job[struct.slug] ? Number(job[struct.slug]) : 0);
                      }

                      // if (jobsSum && struct.slug == "JOB_AMOUNT")

                      if (struct.type != "hidden")
                        return (
                          <td scope="col" key={k}>
                            <FlexBlock>
                              {status != 2 ? (
                                struct.type == "number" ? (
                                  <MaskedInput
                                    mask={numberMask}
                                    value={value}
                                    className={
                                      "form-control " +
                                      (struct.required && value === ""
                                        ? "required"
                                        : "")
                                    }
                                    placehorder="repair order"
                                    style={struct.style}
                                    readOnly={
                                      !loadDebounce && savedIds[key]
                                        ? true
                                        : false
                                    }
                                    // onBlur={(e) => {
                                    //   console.log(changedStringId, key);
                                    //   if (changedStringId != key) saveData();
                                    // }}
                                    onChange={(e) => {
                                      // if (changedStringId != key) {
                                      //   saveData();
                                      // }
                                      if (!savedIds[key]) {
                                        tempArr[key][struct.slug] =
                                          e.target.value;
                                        setChangedStringId(key);
                                        setJobs([...tempArr]);
                                        setTempJobs([...tempArr]);

                                        setSaveState({
                                          ...save_state,
                                          job: true,
                                        });
                                        setChangedIds(
                                          [...changedIds, key].filter(
                                            (value, index, self) => {
                                              return (
                                                self.indexOf(value) === index
                                              );
                                            }
                                          )
                                        );
                                      }
                                    }}
                                    ref={
                                      k == 0 && key == jobs.length - 1
                                        ? lastAdded
                                        : null
                                    }
                                  />
                                ) : (
                                  <input
                                    value={value}
                                    className={
                                      "form-control " +
                                      (struct.required && value === ""
                                        ? "required"
                                        : "")
                                    }
                                    placehorder="repair order"
                                    style={struct.style}
                                    readOnly={
                                      !loadDebounce && savedIds[key]
                                        ? true
                                        : false
                                    }
                                    onBlur={(e) => {
                                      if (validation(jobs, jobs_struct)) {
                                        setJobsNumNotSaved(jobs.length);
                                        setValideState({
                                          ...valide_state,
                                          job: true,
                                        });
                                      } else
                                        setValideState({
                                          ...valide_state,
                                          job: false,
                                        });
                                    }}
                                    onChange={(e) => {
                                      // console.log(savedIds, key);
                                      // if (changedStringId != key) saveData();
                                      // if (changedStringId != key) {
                                      //
                                      // }
                                      if (!savedIds[key]) {
                                        tempArr[key][struct.slug] =
                                          e.target.value;
                                        setChangedStringId(key);
                                        setJobs([...tempArr]);
                                        setTempJobs([...tempArr]);

                                        setSaveState({
                                          ...save_state,
                                          job: true,
                                        });

                                        setChangedIds(
                                          [...changedIds, key].filter(
                                            (value, index, self) => {
                                              return (
                                                self.indexOf(value) === index
                                              );
                                            }
                                          )
                                        );
                                      }
                                    }}
                                    ref={
                                      k == 0 && key == jobs.length - 1
                                        ? lastAdded
                                        : null
                                    }
                                  />
                                )
                              ) : (
                                <FlexBlock
                                  style={{
                                    ...struct.style,
                                  }}
                                >
                                  {struct.type == "number"
                                    ? job[struct.slug]
                                      ? Number(job[struct.slug]).toFixed(2)
                                      : "0.00"
                                    : job[struct.slug]}
                                </FlexBlock>
                              )}
                              {struct.required ? (
                                <Block className="requiredBlock"></Block>
                              ) : (
                                ""
                              )}
                            </FlexBlock>
                          </td>
                        );
                    })}
                    <td scope="col">
                      <FlexBlock style={{ paddingTop: status != 2 ? 7 : 0 }}>
                        {Number(
                          (job["JOB_AMOUNT"] || 0) * (job["JOB_PRICE"] || 0)
                        ).toFixed(2)}
                      </FlexBlock>
                    </td>
                  </tr>
                  {status != 2 ? (
                    <tr>
                      <td className="strTr">
                        <Button
                          size="sm"
                          variant="danger"
                          title={"Delete " + job["JOB_NAME"]}
                          className={
                            "deleteNewString " +
                            (!loadDebounce ? "loadDebounce" : "")
                          }
                          onClick={() => {
                            if (confirm(t("sure_delete_record"))) {
                              if (loadDebounce) {
                                if (job["JOB_ID"])
                                  delete_job(
                                    setJobs,
                                    router.query.id,
                                    SESSIONID,
                                    job["JOB_ID"],
                                    jobs,
                                    setJobsNum
                                  );

                                setJobsNumNotSaved(
                                  jobs.filter((f, k) => k != key).length
                                );

                                setJobs(jobs.filter((f, k) => k != key));
                                setTempJobs(jobs.filter((f, k) => k != key));

                                // setChangedIds([
                                //   ...changedIds.filter((id) => id != key),
                                // ]);
                              }
                            }
                          }}
                        >
                          ✕
                        </Button>
                      </td>
                    </tr>
                  ) : (
                    <></>
                  )}
                </>
              );
            })}
            <tr>
              {jobs_struct.map((struct, k) => {
                const num = Number(jobsSum[struct.slug]);
                if (struct.type != "hidden")
                  return (
                    <td scope="col" key={k}>
                      <Block
                        className={struct.hide ? "d-none" : "show"}
                        style={{}}
                      >
                        {!num ? "0.00" : num.toFixed(2)}
                      </Block>
                    </td>
                  );
              })}
              <td>
                <Block style={{}}>
                  {jobsSum["sum"] ? Number(jobsSum["sum"]).toFixed(2) : "0.00"}
                </Block>
              </td>
            </tr>
          </tbody>
        </Table>

        {status != 2 && (valide_state.job || jobs.length == 0) ? (
          <Button
            size="sm"
            variant="success"
            title="Add new"
            className={"addNewString " + (!loadDebounce ? "loadDebounce" : "")}
            onClick={() => {
              if (loadDebounce && validation(jobs, jobs_struct)) {
                saveData();
                setAddNewStringFlag(1);
                addNew(jobs, setJobs, jobs_struct);
                setValideState({ ...valide_state, job: false });
              }
            }}
          >
            +
          </Button>
        ) : (
          <></>
        )}
      </Section>
    </>
  );
};

export default JobsSection;
