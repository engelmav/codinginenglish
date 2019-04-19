import React, { Component } from 'react';
import { TiDelete } from 'react-icons/ti';
import './annotate.css';


/* global console */

class FakeEmbed extends Component {

  constructor(props) {
    super(props);
    this.state = {
      annotationData: null
    };
  }

  storeAnnotation = (annotationData) => {
    this.setState({ annotationData: annotationData });
  }

  render() {
    let entities = [
      { 'end': 14, 'entity': 'GPE', 'start': 10, 'value': 'test' },
      { 'end': 31, 'entity': 'to_unit', 'start': 22, 'value': 'emergency' }
    ];
    let entityTypes = [
      { name: "GPE" },
      { name: "to_unit" },
      { name: "from_unit"},
      { name: "business_name"}
    ];

    let spacyTokens = [
      { "end": 14, "start": 10, "token": "test" },
      { "end": 31, "start": 22, "token": "emergency" },
      { "end": 40, "start": 32, "token": "broadcast" },
      { "end": 4, "start": 0, "token": "This " },
      { "end": 7, "start": 5, "token": "is " },
      { "end": 16, "start": 15, "token": "of" },
      { "end": 20, "start": 18, "token": "the" },
      { "end": 47, "start": 42, "token": "system" }
    ];
    return (
      <div>
        <p>This is a demo! Try kicking it around a bit and report any issues/feature suggestsions.</p>
        <Query
          query={"This is a test of the emergency broadcast system"}
          entities={entities}
          entityTypes={entityTypes}
          spacyTokens={spacyTokens}
          storeAnnotation={this.storeAnnotation}
        />
        <br></br>
        {this.state.annotationData && JSON.stringify(this.state.annotationData)}
      </div>
    );
  }
}


class Query extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charArray: [],
      startIndex: null,
      endIndex: null,
      highlights: [],
      charSizes: [],
      labels: [],
      annotationErrors: []
    };
  }

  componentDidMount() {
    this.setState(
      { charArray: this.createQueryChars() },
      () => {
        this.setState(
          {
            highlights: this.getExistingTokens(),
            labels: this.getExistingLabels()
          }
        );
      }
    );
  }

  makeEntityMap = () => {
    let entityMap = this.state.highlights.map((highlight, index) => {
      return {
        end: highlight.end,
        entity: this.labelForHighlightIndex(index),
        start: highlight.start,
        value: highlight.value
      };
    });
    let errors = [];
    entityMap.forEach(entity => {
      if (entity.entity === null) {
        errors.push(`Cannot save. You must label or remove the highlighted token ${entity.value}`);
      }
    });
    this.setState({ annotationErrors: errors });
    this.props.storeAnnotation(entityMap);
  }

  labelForHighlightIndex = (index) => {
    if (index in this.state.labels) {
      let label = this.state.labels[index].value;
      return label;
    } else {
      return null;
    }
  }

  getExistingTokens = () => {
    const existingHighlights = this.props.entities.map((entity, index) => {
      return {
        start: entity.start,
        end: entity.end,
        value: entity.value,
      };
    });
    return existingHighlights;
  }

  getExistingLabels = () => this.props.entities.map(entity => entity.entity)

  createQueryChars = () => {
    let charArray = [];
    for (var i = 0; i < this.props.query.length; i++) {
      charArray.push({
        char: this.props.query.charAt(i),
      });
    }
    return charArray;
  }

  setStartIndex = (i) => {
    this.setState({
      startIndex: i
    });
  }

  setEndIndex = (i) => {
    this.setState(
      { endIndex: i },
      // this is onMouseUp, so the user has finished selecting text.
      // now that they're finished, we can capture the token (the piece of the query)
      // that they selected.
      () => { this.addHighlight(); }
    );
  }

  spanValue = (start, end) => {
    let tokenVal = "";
    for (var i = start; i <= end; i++) {
      tokenVal = tokenVal.concat(this.props.query.charAt(i));
    }
    return tokenVal;
  }

  spacyAdjustment = () => {

    let { startIndex, endIndex } = this.state;

    let tokenListLength = this.props.spacyTokens.length;

    let possibleStarts = [];
    for (var i = 0; i < tokenListLength; i++) {
      let spToken = this.props.spacyTokens[i];
      if (startIndex >= spToken.start && startIndex <= spToken.end) {
        possibleStarts.push(spToken.start);
      }
    }
    let newStart = possibleStarts.reduce((a, b) => Math.max(a, b));


    let possibleEnds = [];
    for (var j = 0; j < tokenListLength; j++) {
      let spToken = this.props.spacyTokens[j];
      if (endIndex >= spToken.start && endIndex <= spToken.end) {
        possibleEnds.push(spToken.end);
      }
    }
    let newEnd = possibleEnds.reduce((a, b) => Math.min(a, b));

    if (newStart !== null) {
      startIndex = newStart;
    }
    if (newEnd !== null) {
      endIndex = newEnd;
    }

    let newSpan = { startIndex: startIndex, endIndex: endIndex };
    return newSpan;
  }

  addHighlight = () => {
    let { startIndex, endIndex } = this.spacyAdjustment();
    let val = this.spanValue(startIndex, endIndex);
    this.setState(
      {
        highlights: this.state.highlights.concat({
          start: startIndex,
          end: endIndex,
          value: val
        })
      },
      this.clearIndices
    );
  }

  deleteToken = (index) => {
    let highlights = this.state.highlights.slice();
    if (highlights.length === 1) {
      this.setState({ highlights: [] });
    } else {
      highlights.splice(index, 1);
      this.setState({ highlights: highlights });
    }

    let labels = this.state.labels.slice();

    if (labels.length === 1) {
      this.setState({ labels: [] });
    } else {
      labels.splice(index, 1);
      this.setState({ labels: labels });
    }
  }

  clearIndices = () => this.setState({ startIndex: null, endIndex: null })

  setTokenLabel = (index, labelText) => {
    let newLabels = this.state.labels.slice();
    if (index in newLabels) {
      newLabels[index] = labelText;
    } else {
      newLabels.push(labelText);
    }
    this.setState({ labels: newLabels });
  }

  render() {
    return (
      <div>
        <div id="query">
          {
            this.state.charArray.map((character, index) => {
              return (
                <Character
                  setStartIndex={this.setStartIndex}
                  setEndIndex={this.setEndIndex}
                  showTokenOfChar={this.showTokenOfChar}
                  storeCharElemSize={
                    (height, width) => {
                      // this concat does not work. we will need it to work
                      // if we want to use variable-width font on the query.
                      // note: need to use
                      /*
                      this.setState({
                        data: this.state.data.map(el => (el.id === id ? {...el, text} : el))
                      });
                      */
                      let oldCharSizes = this.state.charSizes;
                      let newCharSizes = oldCharSizes.concat({ height: height, width: width });
                      this.setState(
                        {
                          charSizes: newCharSizes
                        }
                      );
                    }
                  }
                  key={index} charIndex={index} character={character}
                />
              );
            })
          }

          {
            this.state.highlights.map(
              (token, index) => {
                let xoffset = token.start * this.state.charSizes[0].width;
                let yoffset = this.state.charSizes[0].height;
                let label = null;
                if (index in this.state.labels) {
                  label = this.state.labels[index];
                }
                return (
                  <Highlight
                    index={index}
                    key={index}
                    startIndex={token.start}
                    token={token}
                    xoffset={xoffset}
                    yoffset={yoffset}
                    label={label}
                    setTokenLabel={this.setTokenLabel}
                    deleteToken={this.deleteToken}
                    entityTypes={this.props.entityTypes}
                  />
                );
              }
            )
          }
        </div>
        <button
          className="bg-blue hover:bg-blue-dark tracking-wide font-semibold text-white px-1 ml-2 rounded"
          onClick={this.makeEntityMap}
        >
          Show Entity Spans
        </button>
        <br></br>
        {this.state.annotationErrors.map((err, index) => <p>{err}</p>)}
      </div>
    );
  }
}

class Highlight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLabelMenu: (this.props.label) ? false : true,
      showCloseWidget: false,
      label: null
    };
  }

  handleDelete = (e) => {
    this.setState({ showLabelMenu: false });
    this.props.deleteToken(this.props.index);
    e.stopPropagation();
  }

  openLabelMenu = (e) => {
    this.setState({ showLabelMenu: true });
  }

  closeLabelMenu = (e) => {
    this.setState(
      { showLabelMenu: false },
      () => {
        if ((this.props.label || this.state.label) === null) {
          this.props.deleteToken(this.props.index);
        }
      }
    );
  }

  handleSelectedLabel = (label) => {
    this.setState({ label: label });
    this.props.setTokenLabel(this.props.index, label);
    this.closeLabelMenu();
  }

  render() {
    return (
      <div
        id="highlight"
        onClick={this.openLabelMenu}
        onMouseOver={_ => this.setState({ showCloseWidget: true })}
        onMouseLeave={_ => this.setState({ showCloseWidget: false })}
        style={
          {
            left: this.props.xoffset,
            cursor: "default"
          }
        }>
        {(this.state.showLabelMenu === true) &&
          <LabelMenu
            xoffset={this.props.xoffset}
            yoffset={this.props.yoffset}
            entityTypes={this.props.entityTypes}
            handleSelectedLabel={this.handleSelectedLabel}
            closeLabelMenu={this.closeLabelMenu}
          />
        }
        {this.state.showCloseWidget && <TiDelete className="closeWidget" onClick={this.handleDelete} />}
        {this.props.token.value}
        {(this.state.label || this.props.label) && <Label yoffset={this.props.yoffset} xoffset={this.props.xoffset} label={this.props.label || this.state.label} />}
      </div>
    );
  }
}

class LabelMenu extends Component {

  handleSelectedLabel = (e, name) => {
    this.props.handleSelectedLabel(name);
    e.stopPropagation();
  }

  closeLabelMenu = (e) => {
    this.props.closeLabelMenu();
    e.stopPropagation();
  }

  render() {
    return (
      <ul style={{ top: this.props.yoffset }} className="entityTypeMenu">
        {
          this.props.entityTypes.map(
            (entityType, index) =>
              <li
                key={index}
                onClick={(e) => this.handleSelectedLabel(e, entityType.name)}
              >
                {entityType.name}
              </li>
          )
        }
        <li onClick={this.closeLabelMenu}>
          Cancel
        </li>
      </ul>
    );
  }
}


class Character extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {}
    };
  }

  refCallback = (element) => {
    if (element) {
      let { height, width } = element.getBoundingClientRect();
      this.props.storeCharElemSize(height, width);
    }
  };

  setStartIndexOnQuery = (e) => {
    this.props.setStartIndex(this.props.charIndex);
  }

  setEndIndexOnQuery = (e) => {
    this.props.setEndIndex(this.props.charIndex);
  }


  render() {
    return (
      <span
        ref={this.refCallback}
        className="queryChar"
        onMouseOver={this.highlightChar}
        onMouseDown={this.setStartIndexOnQuery}
        onMouseUp={this.setEndIndexOnQuery}
      >
        {this.props.character.char}
      </span>
    );
  }
}

class Label extends Component {
  render() {
    return (
      <div className="entityLabel" style={{ offset: this.props.xoffset, top: this.props.yoffset }}>{this.props.label}</div>
    );
  }
}


export { FakeEmbed, Query };
