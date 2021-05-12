export const formatDate = (e) => {
  //   if (e) {
  //     const date = new Date(e);
  //     console.log(new Intl.DateTimeFormat("en-US").format(date));
  //   }
  if (e) {
    let month, day, year;
    const d = new Date(e);
    (month = "" + (d.getMonth() + 1)),
      (day = "" + d.getDate()),
      (year = d.getFullYear());

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
};
export const formatShortDate = (e) => {
  if (e) {
    let month, day, year;
    const d = new Date(e);
    (month = "" + (d.getMonth() + 1)),
      (day = "" + d.getDate()),
      (year = d.getFullYear());

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month].join("/");
  }
};
export const formatDateForView = (e, symb = "-") => {
  if (e) {
    let month, day, year;
    const d = new Date(e);
    (month = "" + (d.getMonth() + 1)),
      (day = "" + d.getDate()),
      (year = d.getFullYear());

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join(symb);
  }
};

export const formatDateForPost = (e = false, type = false) => {
  let month, day, year;
  const d = e ? new Date(e) : new Date();
  (month = "" + (d.getMonth() + 1)),
    (day = "" + d.getDate()),
    (year = d.getFullYear());

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-") + (!type ? " 00:00:00.000" : "");
};

export const formatDateTimeForPost = (e = false) => {
  let month, day, year, hours, minutes, seconds;
  const d = e ? new Date(e) : new Date();
  (month = "" + (d.getMonth() + 1)),
    (day = "" + d.getDate()),
    (year = d.getFullYear()),
    (hours = d.getHours()),
    (minutes = d.getMinutes()),
    (seconds = d.getSeconds());

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  if (hours.length < 2) hours = "0" + hours;
  if (minutes.length < 2) minutes = "0" + minutes;
  if (seconds.length < 2) seconds = "0" + seconds;

  return (
    [year, month, day].join("-") +
    " " +
    [hours, minutes, seconds].join(":") +
    ".000"
  );
};
