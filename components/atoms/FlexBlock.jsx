import Block from "./Block";
const FlexBlock = (props) => {
  const { children, justify, align, wrap } = props;
  return (
    <Block
      {...props}
      style={{
        display: "flex",
        justifyContent: justify,
        alignItems: align,
        flexWrap: wrap,
        ...props.style,
      }}
    >
      {children}
    </Block>
  );
};
export default FlexBlock;
