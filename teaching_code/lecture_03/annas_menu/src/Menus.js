import { Title } from "./Typography";
import { Cell, MenuPage, Header } from "./Table";

function AnnasMenu() {
  return (
    <>
      <Title>Anna's (Not Rob's) Pizza Shop</Title>
      <MenuPage>
        <Header>Entrée</Header>
        <Header>Price</Header>
        <Header>Tax</Header>
        <Header>Total</Header>
        <Cell>Pizza Slice</Cell>
        <Cell>$3.29</Cell>
        <Cell>5%</Cell>
      </MenuPage>
    </>
  );
}

export { AnnasMenu };
