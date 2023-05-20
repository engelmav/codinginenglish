import NewsHeader from "../components/news";
import styled from "@emotion/styled";

import { H1 as H1Base, H2 } from "../components/typography";

const H3 = styled.h3`
  text-transform: uppercase;
  color: grey;
  font-family: "Courier New", Courier, monospace;
  margin-top: 1rem;
  margin-bottom: 2rem;
`;

const H1 = styled(H1Base)`
    font-size: 1.4em;
  font-family: "Courier New", Courier, monospace;
  background-color: yellow;
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;
const Header = styled.div`
    display: flex;
    flex-direction: column;

    `

export default function NewsPage() {
  return (
    <div>
      <Header>
        <H1>Coding in English Start Date 15 June 2023</H1>
        <H3>2023-05-19 | Vincent Engelmann</H3>
      </Header>
      <p>
        ¡Ya se abrió el curso de verano! Estudiantes comienzan el 15 de junio y
        terminan en octubre. El curso actual tiene dos puestos garantizados en
        una empresa de software en los Estados Unidos.
      </p>
    </div>
  );
}
