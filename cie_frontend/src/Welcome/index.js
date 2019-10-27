import React, { Component } from 'react'
import axios from 'axios';
import { DateTime } from 'luxon';
import './styles.css';

class CieApi {
  startSignup(name) {
    // TODO: add logged out flow
    // TODO: credit card.
    console.log("Signing up to class", name);
    // Assume logged in.
  }
  async scheduledSessions() {
    let scheduledSessions = [];
    try {
      const res = await axios.get('/api/module-sessions');
      scheduledSessions = res.data;
    } catch {
      console.log("Failed to get classes.");
    }
    return scheduledSessions;
  }
}

var cieApi = new CieApi();

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classList: []
    };
  }

  async componentDidMount() {
    let classList;
    try {
      classList = await cieApi.scheduledSessions();
    } catch {
      console.log("Failed to assign class list.");
      classList = [];
    }
    this.setState({ classList });
  }

  render() {
    let { classList } = this.state;
    console.log("classList in render function:");
    console.log(classList);
    return (
      <main>
        <div className="modules-grid">
          {
            classList.map((sessionData, i) =>
              <ModuleCard key={i} sessionData={sessionData} />)
          }
        </div>
      </main>
    );
  }
}


class ModuleCard extends Component {
  onClick = () => cieApi.startSignup(this.props.sessionData.id, 1);
  render() {
    let { cie_module, session_datetime } = this.props.sessionData;
    console.log("UTC from server:", session_datetime);
    var local = DateTime.fromISO(session_datetime);
    const localDateTime = local.toLocaleString(DateTime.DATETIME_FULL);
    return (
      <div className="module-card">
        <img src={cie_module.image_path} />
        <h1>{cie_module.name}</h1>
        <p className="datetime">{localDateTime}</p>
        <button onClick={this.onClick}>SIGN UP</button>
      </div>
    );
  }
}
