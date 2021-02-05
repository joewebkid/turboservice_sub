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

  return [year, month, day].join("-") + (!type ? " 00:00:00" : "");
};
