import React from "react";
import { Main } from "../UtilComponents/Main";
import { Title } from "../UtilComponents/Typography/Typography";
import styled from "styled-components";

const StyledBlockQuote = styled.blockquote`
  margin-left: 1rem;
`;

export const Technique = () => {
  return (
    <Main p={20}>
      <Title>Technique</Title>
      <p>
        Our teaching technique is immersive. This means we teach English
        language topics first, and immediately after we teach a programming
        topic that <i>uses</i> the English topic.
      </p>
      <p>
        The English topics are taught using a blend of Cambridge English Language
        Teaching for Adults (CELTA) and Content and Language Integrated Learning (CLIL).
      </p>
      <p>
        Here is an example. This is taken from the 11th session of the Basic
        Course.
      </p>
      <StyledBlockQuote>
        <h1>Sesión 11</h1>

        <p>
          <b>Objetivo:</b> Hablar con el project manager. Implementar una nueva
          tabla SQL en tu base de datos.
        </p>

        <p>
          Aquí empezamos el proyecto de implementar una sola funcionalidad para
          todo el "stack": el procesamiento de una orden de comida en toda la
          aplicación web.
        </p>

        <p>
          Una parte esencial del WebApp de órdenes en línea es la habilidad de
          captar los detalles de los pedidos. Aquí conversaras con el project
          manager para entender los requisitos.
        </p>

        <p>
          <b>Descripción</b>
        </p>

        <ul>
          <li>Vocabulario esencial de proyectos</li>
          <li>
            Conversación con tu project manager sobre los requisitos de grabar
            los detalles de los pedidos de los clientes.
          </li>
          <li>
            Diseñar juntos una tabla que representa un pedido de comida en una
            base de datos
          </li>
          <li>
            Hacer una práctica de crear nuevas tablas en una base de datos.
          </li>
        </ul>
      </StyledBlockQuote>
    </Main>
  );
};
