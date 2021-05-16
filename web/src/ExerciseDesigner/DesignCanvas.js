import React from "react";
import PropTypes from "prop-types";
import fabric from "fabric";
import Dialog from "@material-ui/core/Dialog";
import { v4 as uuidv4 } from "uuid";

class DesignCanvas extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  };

  static defaultProps = {
    width: 600,
    height: 400,
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
      onSelect: (e) => {
        this.setSelectedObject(uuid);
      },
    });
    return obj;
  }

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
        <canvas ref={(c) => (this.c = c)} width={width} height={height} />
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
      </>
    );
  }
}

export default DesignCanvas;
