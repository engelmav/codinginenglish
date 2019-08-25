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
    let res;
    try {
      res = await axios.get('/module-sessions');
    } catch {
      console.log("Failed to get classes.");
    }
    return res.data;
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
    let classList = await cieApi.scheduledSessions()
    this.setState({ classList });
  }
  render() {
    let { classList } = this.state;
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
        <p>{cie_module.name}</p>
        <p>{localDateTime}</p>
        <button onClick={this.onClick}>SIGN UP</button>
      </div>
    );
  }
}
