const jsx = (
  <>
    {popupActivityWindow && (
      <Bounce left>
        <Rnd
          default={{
            x: 605,
            y: 0,
            width: 800,
          }}
          cancel="#thing1"
          style={{ zIndex: 300 }}
          onMouseDown={() => this.setState({ onTop: popupActivityWindow })}
        >
          <Window
            className="rnd-header"
            title="Activity"
            onClose={togglePopupActivity}
          />
          {isWindowDragging && <CoverWindowOnDrag />}
          <PopupActivity
            activities={activityData}
            onClose={togglePopupActivity}
          />
        </Rnd>
      </Bounce>
    )}
  </>
);
