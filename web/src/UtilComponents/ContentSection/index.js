import styled from "styled-components";

const ContentSection = styled.article`
  display: flex;
  flex-direction: column;
`;
ContentSection.defaultProps = {
  maxWidth: "800px"
};

export { ContentSection };
