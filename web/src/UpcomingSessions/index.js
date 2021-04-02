import React, { Component } from "react";
import { Button, Main, Title } from "../UtilComponents";
import { observer } from "mobx-react";
import styled from "styled-components";

const Title2 = styled(Title)`
  text-align: center;
`;

@observer
class UpcomingSessions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cieModules: [],
    };
  }

  async componentDidMount() {
    let cieModules;
    try {
      const result = await this.props.cieApi.getUpcomingModulesAndSessions();
      cieModules = result.data;
      if ((cieModules === null) | (cieModules === undefined)) {
        cieModules = [];
      }
    } catch (ex) {
      console.log("Failed to retrieve scheduledSessions.");
      console.log(ex.stack);
      cieModules = [];
    }
    this.setState({ cieModules });
  }

  render() {
    const { cieModules } = this.state;
    const { ModuleCard } = this.props;
    return (
      <Main>
        <Title2 mb={20}>upcoming classes</Title2>
        {cieModules.map((moduleData, i) => (
          <ModuleCard key={i} moduleData={moduleData} />
        ))}
      </Main>
    );
  }
}

export { UpcomingSessions };
