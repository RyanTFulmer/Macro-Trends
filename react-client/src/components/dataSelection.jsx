import React from 'react';

const DataSelection = (props) => {
  return (
    <div>
      <h2 class="subtitle is-4" style={{ textAlign: 'center' }}>
        Choose an existing dataset
      </h2>
      <div class="select is-medium">
        <select onChange={props.handleDataChange}>
          <option value="none" selected disabled hidden>
            Select an option
          </option>
          {props.state.indexes.map((databaseOption) => {
            return (
              <option value={databaseOption.dataName}>
                {databaseOption.dataName}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};
export default DataSelection;
