export const parseXml = (xmlStr) => {
  let parseXml = false;
  if (typeof window.DOMParser != "undefined") {
    return new window.DOMParser().parseFromString(xmlStr, "text/xml");
  } else if (
    typeof window.ActiveXObject != "undefined" &&
    new window.ActiveXObject("Microsoft.XMLDOM")
  ) {
    parseXml = function (xmlStr) {
      let xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = "false";
      xmlDoc.loadXML(xmlStr);
      return xmlDoc;
    };
  } else {
    throw new Error("No XML parser found");
  }
};
