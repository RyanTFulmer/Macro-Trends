import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import GOOGLE_API_KEY from '../../../API_KEY';

const dotStyle = {
  position: 'absolute',
  width: 4,
  height: 4,
  left: 4 / 2,
  top: 4 / 2,
  border: '1px solid #000066',
  borderRadius: 2,
  backgroundColor: '#000066',
  color: '#000066',
};

const Point = ({ text }) => <div style={dotStyle}>{text}</div>;

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = { center: { lat: 39.31, lng: -96.45 }, zoom: 3.9 };
  }

  render() {
    console.log('this.props.coordinates in map', this.props.coordinates);
    {
      if (this.props.coordinates !== undefined) {
        var coordinates = this.props.coordinates;
      } else {
        var coordinates = [];
      }
    }

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '400px', width: '666px' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_API_KEY }}
          defaultCenter={this.state.center}
          defaultZoom={this.state.zoom}
        >
          {coordinates.map((eachYear) => {
            return <Point lat={eachYear.north} lng={eachYear.west} text="" />;
          })}
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;
