import React from 'react'
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import styled from 'styled-components';
import { font } from './UtilComponents/sharedStyles';
import { typography } from 'styled-system';



const ContentWrapper = styled.div`
  ${font}
  margin: 0 auto;
  max-width: 980px;
  min-width: 769px;
`;

const PageTitle = styled.h1`
  ${font}
  ${typography}
`



const MyDashboard = observer(props => {

  const { appStore } = props;

  return (
    <ContentWrapper style={{margin: "0 auto", maxWidth: "980px", minWidth: "769px"}}>
      <PageTitle textAlign="center">CIE Dashboard</PageTitle>
      {
        appStore.authData && (
          <h4>
            Welcome, {appStore.authData.idTokenPayload.given_name}!
          </h4>
        )
      }
      <p>Your class is in session. Go there now!</p>
      <p>Currently registered classes:</p>
      {appStore.userSessions &&
        <ul>
          {appStore.userSessions.map(sess =>
            <li>{sess.module_session_id}</li>
          )}
        </ul>
      }
      <p>Your next classes</p>
      <p>Find More Classes</p>
      <p>Words for me to learn</p>
    </ContentWrapper>
  );

});

export default MyDashboard;