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

const get_jobs = (callback, id, SESSIONID) => {
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
    })
    .catch(function (error) {
      console.log(error);
    });
};

const delete_jobs = (callback, id, SESSIONID, setMessage) => {
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
  setLoadDebounce
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

const delete_job = (callback, id, SESSIONID, JOB_ID, jobs) => {
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

      if (Message == "Ok") callback(jobs.filter((f) => f.JOB_ID != JOB_ID));
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

const JobsSection = (props) => {
  const {
    SESSIONID,
    refresh,
    refreshPage,
    status,
    setTotal,
    debonceTime,
  } = props;
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [temp_jobs, setTempJobs] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [addNewStringFlag, setAddNewStringFlag] = useState(1);
  const [changedStringId, setChangedStringId] = useState(0);

  const popoverRef = useRef(null);
  const popover = (e) => {
    return (
      <Popover id="popover-basic" {...e}>
        <Popover.Title as="h3">Load from file</Popover.Title>
        <Popover.Content>
          You can load{" "}
          <CustomLink
            href="/data.xml"
            target="_blank"
            download="template.xml"
            onClick={() => {
              console.log(popoverRef);
              popoverRef.current.click();
            }}
          >
            template
          </CustomLink>
        </Popover.Content>
      </Popover>
    );
  };

  const [message, setMessage] = useState({});
  const [loadDebounce, setLoadDebounce] = useState(true);

  let tempArr = jobs;
  let jobsSum = {};

  const debouncedSearchTerm = useDebounce(temp_jobs, debonceTime);

  const numberMask = createNumberMask({
    prefix: "",
    suffix: "",
    thousandsSeparatorSymbol: "",
    allowDecimal: true,
    decimalSymbol: ".",
    decimalLimit: 2,
  });

  useEffect(() => {
    if (SESSIONID && router && router.query && router.query.id) {
      // if (addNewStringFlag) {
      //   setAddNewStringFlag(0);
      //   return;
      // }

      if (jobs[changedStringId]) {
        let changedJobs = jobs[changedStringId];
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
          setLoadDebounce
        );
      }
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (SESSIONID && router && router.query && router.query.id)
      get_jobs(setJobs, router.query.id, SESSIONID, setMessage);
  }, [router, refresh]);

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
                  Load from file
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
                if (confirm("Are you sure want to delete all records?")) {
                  delete_jobs(setJobs, router.query.id, SESSIONID, setMessage);
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
                Number(job["JOB_AMOUNT"]) * Number(job["JOB_PRICE"]);

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
                          Number(job[struct.slug]);
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
                                    className={"form-control"}
                                    placehorder="repair order"
                                    style={struct.style}
                                    readOnly={!loadDebounce ? true : false}
                                    onChange={(e) => {
                                      if (loadDebounce) {
                                        tempArr[key][struct.slug] =
                                          e.target.value;
                                        setJobs([...tempArr]);
                                        setTempJobs([...tempArr]);
                                        setChangedStringId(key);
                                      }
                                    }}
                                  />
                                ) : (
                                  <input
                                    value={value}
                                    className={"form-control"}
                                    placehorder="repair order"
                                    style={struct.style}
                                    readOnly={!loadDebounce ? true : false}
                                    onChange={(e) => {
                                      if (loadDebounce) {
                                        tempArr[key][struct.slug] =
                                          e.target.value;
                                        setJobs([...tempArr]);
                                        setTempJobs([...tempArr]);
                                        setChangedStringId(key);
                                      }
                                    }}
                                  />
                                )
                              ) : (
                                <FlexBlock
                                  style={{
                                    ...struct.style,
                                  }}
                                >
                                  {struct.type == "number"
                                    ? Number(job[struct.slug]).toFixed(2)
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
                        {Number(job["JOB_AMOUNT"] * job["JOB_PRICE"]).toFixed(
                          2
                        )}
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
                            if (
                              confirm(" Are you sure want to delete record?")
                            ) {
                              if (loadDebounce) {
                                if (job["JOB_ID"])
                                  delete_job(
                                    setJobs,
                                    router.query.id,
                                    SESSIONID,
                                    job["JOB_ID"],
                                    jobs
                                  );
                                else {
                                  setJobs(jobs.filter((f, k) => k != key));
                                }
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

        {status != 2 ? (
          <Button
            size="sm"
            variant="success"
            title="Add new"
            className={"addNewString " + (!loadDebounce ? "loadDebounce" : "")}
            onClick={() => {
              if (loadDebounce) {
                setAddNewStringFlag(1);
                addNew(jobs, setJobs, jobs_struct);
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
