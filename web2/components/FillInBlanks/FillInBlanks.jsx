function FillInBlanks({ questionAnswer }) {
  const answerKey = questionAnswer
    .map((qa) => qa.answer)
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  return (
    <div style={{ background: "white", color: "black", padding: "30px" }}>
      <h1 style={{ fontSize: "1.5em" }}>Fill in the blanks...</h1>
      <div style={{ display: "flex", marginBottom: "30px" }}>
        {answerKey.map((a) => (
          <div
            style={{
              border: "1px solid black",
              borderRadius: "4px",
              padding: "4px",
              margin: "4px",
            }}
          >
            {a}
          </div>
        ))}
      </div>
      <ol style={{ color: "black" }}>
        {questionAnswer.map((qa) => (
          <li style={{ marginBottom: "30px" }}>
            <span>{qa.question}</span>
            {qa.answer && (
              <input
                style={{
                  paddingLeft: "4px",
                  border: "2px solid gray",
                  borderRadius: "4",
                  width: "100px",
                }}
                type="text"
              ></input>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export { FillInBlanks };
