import React from 'react'
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { font } from './UtilComponents/sharedStyles';
import { Title, Main } from './UtilComponents';


const ContentWrapper = styled.div`
  ${font}
  margin: 0 auto;
  max-width: 980px;
  min-width: 769px;
`;


const MyDashboard = observer(props => {

  const { appStore } = props;

  return (
    <Main>
      <Title>{`${appStore.firstName}'s Dashboard`}</Title>
      <ContentWrapper style={{ margin: "0 auto", maxWidth: "980px", minWidth: "769px" }}>
        
        {
          appStore.authData && (
            <h4>
              Welcome, {appStore.firstName}!
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
    </Main>
  );

});

export default MyDashboard;