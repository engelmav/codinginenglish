import './styles.css';
import React from "react";


const Cell = ({children}) => {
  return <div className="content cell">{children}</div>
}
const MenuPage = ({children}) => {
  return <div className="menu-background">{children}</div>
}

const Header = ({children}) => {
  return (<div className="header cell">{children}</div>)
}

export {
  Cell,
  MenuPage,
  Header
}