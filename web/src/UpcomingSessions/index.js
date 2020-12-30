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
      // TODO: lift into composite root.
      const result = await this.props.cieApi.getUpcomingSessions();
      scheduledSessions = result.data;
      if (scheduledSessions === null | scheduledSessions === undefined) {
        scheduledSessions = [];
      }
    } catch (ex) {
      console.log("Failed to retrieve scheduledSessions.");
      console.log(ex.stack);
      scheduledSessions = [];
    }
    this.setState({ scheduledSessions });
  }

  render() {
    let { scheduledSessions } = this.state;
    const { ModuleCard } = this.props;
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