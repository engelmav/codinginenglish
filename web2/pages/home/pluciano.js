import { H1, H2 } from "../../components/typography";
import styled from "@emotion/styled";
import { Box as MuiBox, Divider, Typography } from "@mui/material";
import { PortableText } from "@portabletext/react";

const Box = styled(MuiBox)`
  border: 1px red dotted;
`;

// const Box = styled.div`
//   border: 1px red dotted;
// `;
const Label = styled.p`
  font-weight: 800;
`;

// export default function StudentDashboard() {
//   return (
//     <Box style={{ width: "800px" }}>
//       <H1>Student Dashboard</H1>
//       <H2>Welcome, Luciano!</H2>
//       <Box
//         style={{
//           display: "flex",
//           flexDirection: "row",
//           gap: "10px",
//           paddingTop: "10px",
//         }}
//       >
//         <Box
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             width: "30%",
//             gap: "10px",
//           }}
//         >
//           <Box>
//             <Profile />
//           </Box>
//           <Box>bottom-left box</Box>
//         </Box>
//         <Box style={{ width: "80%" }}>right side content</Box>
//       </Box>
//     </Box>
//   );
// }
export default function StudentDashboard() {
  return (
    <Box>
      <H1>Student Dashboard</H1>
      <H2>Welcome, Luciano!</H2>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
        <Box>
          <Box>
            <Profile />
          </Box>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            bottom-left box
          </Box>
        </Box>
        <Box>
          <StudentFeed />
        </Box>
      </Box>
    </Box>
  );
}

function Profile() {
  return (
    <div>
      <Label>Course:</Label>
      <p>Winter 2024</p>
      <Label>Payment Status:</Label>
      <p>Pending</p>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Label>Start Date:</Label>
        <p>January 15, 2024</p>
      </Box>
    </div>
  );
}
const fakeBlockText = [
  {
    _type: "block",
    _key: "da5f884c9804",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "da5f884c98040",
        text: "Virtual machine assigned to  ",
        marks: [],
      },
      {
        _type: "span",
        _key: "da5f884c98041",
        text: "15.228.8.17 (São Paulo)",
        marks: ["strong", "<markDefId>"],
      },
      {
        _type: "span",
        _key: "da5f884c98042",
        text: ".",
        marks: [],
      },
    ],
    markDefs: [
      {
        _type: "link",
        _key: "<markDefId>",
        href: "https://codinginenglish.atlassian.net/wiki/spaces/NS/pages/589828/Acceder+a+tu+m+quina+virtual+remota",
      },
    ],
  },
];
const fakeBlockText2 = [
  {
    _type: "block",
    _key: "da5f884c9804",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "da5f884c98040",
        text: "Confirmation received for January 2024",
        marks: [],
      },
      {
        _type: "span",
        _key: "da5f884c98041",
        text: "15.228.8.17 (São Paulo)",
        marks: ["strong", "<markDefId>"],
      },
      {
        _type: "span",
        _key: "da5f884c98042",
        text: ".",
        marks: [],
      },
    ],
    markDefs: [
      {
        _type: "link",
        _key: "<markDefId>",
        href: "https://codinginenglish.atlassian.net/wiki/spaces/NS/pages/589828/Acceder+a+tu+m+quina+virtual+remota",
      },
    ],
  },
];
const feedEvents = [
  {
    eventType: "communication",
    dateTime: new Date(2023, 6, 20, 22, 10).toLocaleString(),
    content: fakeBlockText,
    //"Virtual machine assigned to pluciano. Connect via Remote Connect to 15.228.8.17 (São Paulo)",
  },
  {
    eventType: "communication",
    dateTime: new Date(2023, 6, 15, 20, 17).toLocaleString(),
    content: fakeBlockText2,
    //"Virtual machine assigned to pluciano. Connect via Remote Connect to 15.228.8.17 (São Paulo)",
  },
];

function FeedEvent() {}

function StudentFeed() {
  return (
    <Box>
      {feedEvents.map((feedEvent, idx) => {
        return (
          <Box>
            <Typography>{feedEvent.dateTime}</Typography>
            <PortableText value={feedEvent.content} />
          </Box>
        );
      })}
      <Divider />
    </Box>
  );
}
