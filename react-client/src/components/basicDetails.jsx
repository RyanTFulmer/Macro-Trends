import React from 'react';

const BasicDetails = (props) => {
  let year = <div></div>;
  if (props.year !== '') {
    year = (
      <div style={{ float: 'left', margin: '5px' }}>
        <h2 class="subtitle is-4">Year: {props.year}</h2>
      </div>
    );
  }

  return <div>{year}</div>;
};
export default BasicDetails;
