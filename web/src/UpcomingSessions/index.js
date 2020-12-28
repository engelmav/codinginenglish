import React, { Component } from 'react'
import { Main, Title } from '../UtilComponents';
import { observer } from 'mobx-react';
import './styles.css';

/* global __VERSION__ */

@observer
class UpcomingSessions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduledSessions: []
    };
    console.log(`Version ${__VERSION__}`);
  }

  async componentDidMount() {
    let scheduledSessions;
    try {
      scheduledSessions = await this.props.cieApi.scheduledSessions();
      console.log("scheduledSessions returned", scheduledSessions);
      if (scheduledSessions === null | scheduledSessions === undefined) {
        console.log("No scheduledSessions returned.");
        scheduledSessions = [];
      }
    } catch {
      console.log("Failed to assign scheduledSessions.");
      scheduledSessions = [];
    }
    this.setState({ scheduledSessions });
  }

  render() {
    let { scheduledSessions } = this.state;
    const { appStore, ModuleCard } = this.props;
    return (
      <Main>
        <Title textAlign="center">upcoming classes</Title>
        <div>
          {
            scheduledSessions.map((sessionData, i) =>
              <ModuleCard key={i} sessionData={sessionData} appStore={appStore} />)
          }
        </div>
      </Main>
    );
  }
}


export { UpcomingSessions };