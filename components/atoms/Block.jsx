const Block = (props) => {
  const { children } = props;
  return <div {...props}>{children}</div>;
};
export default Block;
