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
