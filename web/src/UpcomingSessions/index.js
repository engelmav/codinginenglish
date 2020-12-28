import React, { Component } from 'react'
import { Main, Title } from '../UtilComponents';
import { observer } from 'mobx-react';
import './styles.css';

@observer
class UpcomingSessions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduledSessions: []
    };
  }

  async componentDidMount() {
    let scheduledSessions;
    try {
      const result = await this.props.cieApi.getUpcomingSessions();
      scheduledSessions = result.data;
      console.log("scheduledSessions returned", scheduledSessions);
      if (scheduledSessions === null | scheduledSessions === undefined) {
        console.log("No scheduledSessions returned.");
        scheduledSessions = [];
      }
    } catch (ex) {
      console.log("Failed to assign scheduledSessions.");
      console.log(ex.stack);
      scheduledSessions = [];
    }
    this.setState({ scheduledSessions });
  }

  render() {
    let { scheduledSessions } = this.state;
    console.log("scheduledSessions in render", scheduledSessions)
    const sessionsLoaded = scheduledSessions.length > 0;
    const { appStore, ModuleCard } = this.props;
    return (
      <Main>
        <Title textAlign="center">upcoming classes</Title>
        {

        }
        <div>
          {
            scheduledSessions.map((sessionData, i) =>
              <ModuleCard key={i} sessionData={sessionData} />)
          }
        </div>
      </Main>
    );
  }
}


export { UpcomingSessions };