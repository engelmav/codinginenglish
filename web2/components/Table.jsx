import React from "react";

export function Table({ data }) {
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <table style={{ minWidth: "600px", border: "1px white solid" }}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index} style={{ border: "1px white solid" }}>
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, columnIndex) => (
              <td
                style={{ border: "1px solid white", padding: "10px" }}
                key={columnIndex}
              >
                {row[column]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
