import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect } from "react";
// import QRious from "qrious";
import { useState } from "react";
import { TypewriterText } from "../components/TypewriterText";
import { P, Li } from "../components/Typography";

const inter = Inter({ subsets: ["latin"] });

const colorScheme = {
  Glaucous: "#5A779E",
  Charcoal: "#3A444D",
  Khaki: "#BDAC9C",
  Onyx: "#373A3D",
  "Eerie black": "#1E1E1B",
};

function Card({
  onTap,
  selectedTile,
  tileNumber,
  children,
  backgroundColor,
  textColor,
  selectedTextColor,
}: {
  children: string | JSX.Element | JSX.Element[];
  onTap: any;
  selectedTile: number;
  tileNumber: number;
  backgroundColor?: string;
  textColor: string;
  selectedTextColor?: string;
}) {
  useEffect(() => {}, [selectedTile]);
  const isSelectedCard = selectedTile === tileNumber;
  const style = {
    color: selectedTile === tileNumber ? selectedTextColor || "black" : "black",
    flexGrow: 1,
    margin: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.4em",
    borderRadius: "10px",
    fontFamily: "sans-serif",
    opacity: "85%",
    transition: "background-color 500ms linear",
    backgroundColor: "white",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.8)",
  };
  const finalStyle = Object.assign(
    {},
    style,
    isSelectedCard && { backgroundColor: "black", color: "white" }
  );
  return (
    <div
      onClick={() => {
        onTap(tileNumber);
      }}
      style={finalStyle}
    >
      {children}
    </div>
  );
}

const titleToContent = [
  {
    title: "Aprende a programar",
    content: (
      <>
        <P>
          La programación es una de las carreras de crecimiento más alto en el
          mundo. Y hay una escacez de programadores.
        </P>
        <P>
          Por lo tanto, los salarios de los trabajos de programación suelen ser
          altos.
        </P>
        <P>
          Pero para poder captar los trabajos que pagan mejor, también es
          necesario tener un buen nivel de inglés.
        </P>
      </>
    ),
  },
  {
    title: "Mejora tu inglés",
    content: (
      <>
        <P>
          No existe mejor manera de aprender un idioma que <i>usarlo</i>. Y no
          existe mejor motivación que tener una razón{" "}
          <i>concreta y lucrativa</i>.
        </P>
        <ul>
          <Li>Crea programas utilizando inglés como medio de comunicación</Li>
          <Li>Trabaja junto con colegas usando inglés</Li>
          <Li>Habla con clientes y negocia trabajo y dinero en inglés</Li>
        </ul>
        <P>
          Usando un trabajo junto con ayuda experta en inglés{" "}
          <i>asegura que irás mejorando en el idioma</i>
        </P>
      </>
    ),
  },
  {
    title: "Consigue trabajo",
    content: (
      <>
        <P>
          Nosotros tenemos un enfoque de dos frentes cuando se trata de los
          trabajos para nuestros graduados.
        </P>
        <P>
          Por un lado, te preparamos con la experiencia necesaria y una cartera
          de trabajos para poder presentar a empleadores potenciales.
        </P>
        <P>
          Por otro lado, nos mantenemos en contacto con una red de empleadores
          que están constantemente buscando programadores.
        </P>
      </>
    ),
  },
  {
    title: "¿Para quién es el curso?",
    content: (
      <P>
        Este curso es para adultos que hablan un nivel intermedio de inglés.
        Debido a la combinación de entrenamiento de programación e inglés,
        todavía no enseñamos inglés desde cero.
      </P>
    ),
  },
  {
    title: "¿Quiénes somos?",
    content: (
      <>
        <P>
          Coding in English es instituto de programación e inglés. El instructor
          es Vincent Engelmann, que nació aquí en New Jersey y enseñó inglés
          como segundo idioma antes de empezar una carrera en la programación.
        </P>
        <P>
          Vincent actualmente es gerente de un equpo de ingenieros de software,
          y también está en contacto constante con una red de empleadores de
          programadores constantemente en busca de nuevos talentos.
        </P>
      </>
    ),
  },
];

function CardContent({ text, icon }: { text: string; icon: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img
        style={{
          width: "55px",
          height: "auto",
          marginRight: "30px",
          justifySelf: "flex-start",
        }}
        src={icon}
      ></img>
      {text}
    </div>
  );
}

export default function Home() {
  const [contentTitle, setContentTitle] = useState(titleToContent[0].title);
  const [content, setContent] = useState<string | JSX.Element | JSX.Element[]>(
    titleToContent[0].content
  );
  const [selectedTile, setSelectedTile] = useState(1);
  useEffect(() => {});
  function handleCardClick(idx: number) {
    setSelectedTile(idx);
    setContentTitle(titleToContent[idx].title);
    setContent(titleToContent[idx].content);
  }
  return (
    <>
      <Head>
        <title>cie kiosk</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.vid}>
          <video
            autoPlay
            muted
            loop
            style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
          >
            <source src="/skyscrapers-91744.mp4" type="video/mp4" />
          </video>
        </div>

        <div
          className={styles.contentbar}
          style={{
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.8)",
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              gap: "1rem",
            }}
          >
            <h1 style={{ fontFamily: "Helvetica, sans-serif" }}>
              {contentTitle}
            </h1>
            {content}
          </div>
          <div>
            <div
              style={{
                display: "flex",
                padding: "20px",
                alignItems: "center",
                // border: "10px red dotted",
              }}
            >
              <div
                style={{
                  fontSize: "2em",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <P style={{ fontWeight: "bold" }}>
                  Inscríbete para mantenerte al tanto de los adelantos
                </P>
                <ListItem>
                  <ArrowBullet /> <P>clases de muestra</P>
                </ListItem>
                <ListItem>
                  <ArrowBullet />
                  <P>aperturas de matrícula</P>
                </ListItem>
                <ListItem>
                  <ArrowBullet />
                  <P>ofertas de trabajo</P>
                </ListItem>
              </div>
              <div
                style={{
                  border: "4px solid #005E94",
                  borderRadius: "30px",
                  padding: "20px",
                }}
              >
                <img
                  style={{ width: "140px", height: "auto" }}
                  alt="qr"
                  src="/furiamulti_qr.gif"
                  id="qr"
                ></img>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100%",
            minWidth: "30%",
            maxWidth: "30%",
          }}
        >
          <div
            onClick={() => handleCardClick(4)}
            style={{
              margin: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "white",
              borderRadius: "10px",
              flexGrow: 1,
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Image
                style={{ width: "70%", height: "44%" }}
                src="/cie_horizontal_white.jpg"
                alt="me"
                width="1462"
                height="209"
              />
            </div>
          </div>
          <Card
            tileNumber={0}
            selectedTile={selectedTile}
            onTap={handleCardClick}
            textColor="white"
          >
            <CardContent text="Aprende a programar" icon="/computer.png" />
          </Card>
          <Card
            tileNumber={1}
            selectedTile={selectedTile}
            onTap={handleCardClick}
            textColor="black"
            selectedTextColor="red"
          >
            <CardContent text="Mejora tu inglés" icon="/chat.png" />
          </Card>
          <Card
            tileNumber={2}
            selectedTile={selectedTile}
            onTap={handleCardClick}
            selectedTextColor="yellow"
            textColor="white"
          >
            <CardContent text="Consigue trabajo" icon="/coin.png" />
          </Card>
          <Card
            tileNumber={3}
            selectedTile={selectedTile}
            onTap={handleCardClick}
            textColor="white"
          >
            <CardContent text="¿Para quién es el curso?" icon="/mind.png" />
          </Card>
        </div>
      </main>
    </>
  );
}
function ListItem({ children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
}
function ArrowBullet() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        color: "#EB7847",
        fontWeight: "900",
        // fontSize: "2.5em",
        padding: 0,
        margin: 0,
        paddingBottom: "3px",
        marginRight: "10px",
        marginLeft: "60px",
      }}
    >
      »
    </div>
  );
}
