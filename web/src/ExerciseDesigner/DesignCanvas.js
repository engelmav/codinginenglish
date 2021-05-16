import React from "react";
import PropTypes from "prop-types";
import fabric from "fabric";
import Dialog from "@material-ui/core/Dialog";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import { SketchPicker } from "react-color";

const Toolbar = styled.div`
  flex-direction: row;
`;
const CanvasContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

class DesignCanvas extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  };

  static defaultProps = {
    width: 800,
    height: 600,
  };

  state = {
    canvas: null,
    dialogOpen: false,
    temp: "",
    selectable: true,
    selectedObj: null,
    objects: [],
  };

  componentDidMount() {
    const canvas = new fabric.fabric.Canvas(this.c);
    this.setState({ canvas });
  }

  setSelectedObject = (uuid) => {
    this.setState({ selectedObj: uuid });
  };

  findObject = (uuid) => {
    let foundObj;
    this.state.canvas.getObjects().forEach(function (o) {
      if (o.id == uuid) {
        foundObj = o;
      }
    });
    return foundObj;
  };

  applyGenericAttrs = (obj, uuid) => {
    obj.set({
      onDeselect: () => this.setState({ selectedObj: null }),
      onSelect: () => {
        this.setSelectedObject(uuid);
      },
    });
    return obj;
  };

  handleColorChange = (color, event) => {
    const obj = this.state.canvas.getActiveObject();
    obj.set({ fill: color.hex });
    this.state.canvas.renderAll();
  };

  setCanvasJson = (event) => {
    const json = event.target.value;
    console.log("event received in setCanvas:", event.target.value)
    const loadAndRender = () => {
      this.state.canvas.loadFromJSON(
        json,
        () => {
          console.log("re-rendering canvas")
          this.state.canvas.renderAll();
        },
        function (o, object) {
          console.log(o, object);
        }
      );
    };
    this.setState({ canvasJson: json }, loadAndRender);
  };

  render() {
    const { width, height } = this.props;
    const selectedObj = this.state.selectedObj
      ? this.state.objects.find((obj) => (obj.uuid = this.state.selectedObj))
      : null;
    const isMovable = this.state.selectedObj
      ? selectedObj.lockMovementX
      : false;
    return (
      <>
        <CanvasContainer>
          <canvas
            style={{ border: "1px solid black", display: "flex" }}
            ref={(c) => (this.c = c)}
            width={width}
            height={height}
          />
          <Toolbar>
            <SketchPicker onChange={this.handleColorChange} />
            <button
              onClick={(e) => {
                e.preventDefault();
                console.log(JSON.stringify(this.state.canvas.toJSON()));
              }}
            >
              To JSON
            </button>
            <button
              onClick={() => {
                const uuid = uuidv4();
                const text = new fabric.fabric.IText("Click to edit", {
                  id: uuid,
                  fontFamily: "arial black",
                  fontSize: 16,
                  left: 100,
                  top: 100,
                });
                const textNormal = this.applyGenericAttrs(text, uuid);
                const obj = {
                  uuid: uuid,
                  lockMovementX: true,
                  lockMovementY: true,
                };
                this.setState({ objects: this.state.objects.concat(obj) });
                this.state.canvas.add(textNormal);
                this.state.canvas.setActiveObject(textNormal);
              }}
            >
              Text
            </button>
            <button
              onClick={() => {
                this.setState({ dialogOpen: true, temp: "" });
              }}
            >
              Image
            </button>
            <button
              onClick={() => {
                const uuid = uuidv4();
                const rect = new fabric.fabric.Rect({
                  id: uuid,
                  left: 100,
                  top: 100,
                  width: 50,
                  height: 50,
                });
                const rectNormal = this.applyGenericAttrs(rect, uuid);
                const obj = {
                  uuid: uuid,
                  lockMovementX: true,
                  lockMovementY: true,
                };
                this.setState({ objects: this.state.objects.concat(obj) });
                this.state.canvas.add(rectNormal);
                this.state.canvas.setActiveObject(rectNormal);
              }}
            >
              Rectangle
            </button>
            <button
              onClick={() => {
                const uuid = uuidv4();
                const rect = new fabric.fabric.Circle({
                  id: uuid,
                  left: 100,
                  top: 100,
                  radius: 1,
                  fill: "black",
                });
                const rectNormal = this.applyGenericAttrs(rect, uuid);
                const obj = {
                  uuid: uuid,
                  lockMovementX: true,
                  lockMovementY: true,
                };
                this.setState({ objects: this.state.objects.concat(obj) });
                this.state.canvas.add(rectNormal);
                this.state.canvas.setActiveObject(rectNormal);
              }}
            >
              Circle
            </button>
            <button
              onClick={() => {
                const obj = this.state.canvas.getActiveObject();
                const newObjList = this.state.objects.filter(
                  (fobj) => fobj.uuid !== obj.id
                );
                this.setState({ objects: newObjList });
                this.state.canvas.remove(obj);
                this.state.canvas.renderAll(); //Re-render the drawing in Fabric
              }}
            >
              Delete
            </button>

            <label>student can:</label>
            {this.state.selectedObj && (
              <label>
                {this.state.canvas && (
                  <input
                    key={this.state.selectedObj}
                    name="selectable"
                    type="checkbox"
                    checked={isMovable}
                    onChange={(e) => {
                      const obj = this.state.canvas.getActiveObject();
                      console.log("got selected object", obj);
                      // obj.hasControls = false;
                      // obj.hasBorders = false;
                      // obj.editable = false;
                      // this.state.canvas.selection = selectable;
                      this.setState({
                        objects: this.state.objects.map((obj) => {
                          if (selectedObj.uuid === obj.uuid) {
                            return {
                              ...obj,
                              lockMovementX: !obj.lockMovementX,
                              lockMovementY: !obj.lockMovementY,
                            };
                          }
                          return obj;
                        }),
                      });

                      this.state.canvas.renderAll();
                    }}
                  />
                )}
                Move
              </label>
            )}
          </Toolbar>
          <Dialog open={this.state.dialogOpen}>
            <input
              type="text"
              placeholder="image url"
              onChange={(e) => this.setState({ temp: e.target.value })}
            ></input>
            <button
              onClick={() => {
                const uuid = uuidv4();
                const image = fabric.fabric.Image.fromURL(
                  this.state.temp,
                  (img) => {
                    //i create an extra var for to change some image properties
                    var img1 = img.set({
                      id: uuid,
                      left: 0,
                      top: 0,
                      // width: 150,
                      // height: 150,
                    });
                    const imgNormal = this.applyGenericAttrs(img1, uuid);
                    const obj = {
                      uuid,
                      lockMovementX: false,
                      lockMovementY: false,
                    };
                    this.setState({ objects: this.state.objects.concat(obj) });
                    this.state.canvas.add(imgNormal);
                  }
                );

                this.setState({ dialogOpen: false, temp: "" });
              }}
            >
              Add
            </button>
          </Dialog>
          <textarea onChange={this.setCanvasJson} value={this.state.canvasJson}>

          </textarea>
        </CanvasContainer>
      </>
    );
  }
}

export default DesignCanvas;
