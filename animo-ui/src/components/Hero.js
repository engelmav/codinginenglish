import { TitleH1 } from "../UtilComponents/Typography/Typography";
import React, { useState, useEffect } from "react";
import { Box, boxy } from "../UtilComponents";
import styled from "styled-components";
import { darkGray } from "../UtilComponents/sharedStyles";
// import Image from 'next/image'

const Image = styled.img`
  ${boxy}
`;

export const Hero = ({ imageSrc, imageSrcSet, heroText, heroHeight }) => {
  const [currentSrc, setCurrentSrc] = useState(null);
  useEffect(() => {
    console.log("image source:", currentSrc);
  }, [currentSrc]);
  return (
    <Box
      backgroundColor={darkGray}
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={heroHeight}
    >
      {/* <Image
        alt="hero image"
        width="100%"
        height="100%"
        srcSet={imageSrcSet}
        src={imageSrc}
        sizes="(min-width: 420px) 960px,
        360px"
        style={{
          objectFit: "cover",
        }}
        loading="lazy"
        onLoad={(event) => setCurrentSrc(event.target.currentSrc)}
      /> */}
      <TitleH1
        style={{
          position: "absolute",
        }}
        textShadow="0.8px 0.5px 0.5px black, 0 0 1em black"
        color="white"
        textAlign="center"
        mx="2"
        my="4"
        fontSize={[4, 6, 7]}
      >
        {heroText}
      </TitleH1>
      <p></p>
    </Box>
  );
};
