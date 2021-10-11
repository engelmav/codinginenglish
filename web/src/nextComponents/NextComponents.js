import Link from "next/link";



const StyledLink = styled.a`
  ${boxy}
  text-align: center;
  color: white;
  ${typography}
  border-radius: 4px;
  background-color: ${cieOrange};
  text-decoration: none;
  box-shadow: 0 5px 15px rgba(145, 92, 182, 0.4);

  &:hover:enabled {
    color: rgba(255, 255, 255, 1);
    box-shadow: 0 5px 15px rgba(145, 92, 182, 0.4);
  }
`;

StyledLink.defaultProps = {
  fontSize: [1, 2, 2, 2],
  padding: [3, 3, 3, 3, 3],
};


export const RegisterLink = (props) => {
  const { children, href, ...otherProps } = props;
  return (
    <Link href={href} passHref>
      <StyledLink {...otherProps}>{children}</StyledLink>
    </Link>
  );
};