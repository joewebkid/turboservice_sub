const Section = (props) => {
  const { children } = props;
  return <section {...props}>{children}</section>;
};
export default Section;
