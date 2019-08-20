import React, { Component } from 'react'
import { TextField, FormControl, InputLabel, Select, MenuItem, Input } from "@material-ui/core";
import LocationPicker from 'react-location-picker';
import { connect } from "react-redux";
import { setRestaurantInfo } from '../../redux/reducers/userReducer';

const defaultPosition = {
  lat: -6.241586,
  lng: 106.992416
}

class RestaurantInfoComponent extends Component {

  state = {
    position: {
      lat: 0,
      lng: 0
    },
    address: null
  }

  componentWillMount() {
    this.getMyLocation();
  }

  getMyLocation = () => {
    const location = window.navigator && window.navigator.geolocation;
    if (location) {
      location.getCurrentPosition((position) => {
        let currentRestaurant = { ...this.props.restaurant };
        currentRestaurant['coordinates'] = [position.coords.latitude, position.coords.longitude];
        this.props.dispatch(setRestaurantInfo(currentRestaurant));
        this.setState({
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
        });
      }, (error) => {
        this.setState({ latitude: 'err-latitude', longitude: 'err-longitude' })
      })
    }
  }

  handleLocationChange = ({ position, address }) => {
    let currentRestaurant = { ...this.props.restaurant };
    currentRestaurant['coordinates'] = [position.lat, position.lng];
    currentRestaurant['address'] = address;
    this.props.dispatch(setRestaurantInfo(currentRestaurant));
    this.setState({ position, address });
  }

  handleChange = e => {
    let event = e;
    let currentRestaurant = { ...this.props.restaurant };
    currentRestaurant[event.target.name] = event.target.value;
    this.props.dispatch(setRestaurantInfo(currentRestaurant));
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <div>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Restaurant Name"
          name="name"
          autoComplete="name"
          autoFocus
          onChange={this.handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="cuisines"
          label="Restaurant Cuisines"
          name="cuisines"
          autoComplete="cuisines"
          autoFocus
          onChange={this.handleChange}
        />
        <FormControl style={{ width: '100%' }} variant="outlined" margin="normal">
          <InputLabel htmlFor="age-helper">Restaurant Establishment</InputLabel>
          <Select
            value={this.state.establishment ? this.state.establishment : ""}
            onChange={this.handleChange}
            name="establishment"
            input={<Input name="estabilshment" id="age-helper" />}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"Cafes"}>Cafes</MenuItem>
            <MenuItem value={"Bars"}>Bars</MenuItem>
            <MenuItem value={"Casual Dining"}>Casual Dining</MenuItem>
            <MenuItem value={"Food Courts"}>Food Courts</MenuItem>
            <MenuItem value={"Beverage"}>Beverage</MenuItem>
            <MenuItem value={"Fine Dining"}>Fine Dining</MenuItem>
            <MenuItem value={"Quick Bites"}>Quick Bites</MenuItem>
            <MenuItem value={"Bakeries"}>Bakeries</MenuItem>
            <MenuItem value={"Street Vendors"}>Street Vendors</MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="phone"
          label="Restaurant Phone Number"
          name="phone"
          autoComplete="phone"
          autoFocus
          onChange={this.handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          multiline
          rowsMax={6}
          id="address"
          label="Restaurant Address"
          name="address"
          autoComplete="address"
          autoFocus
          value={this.state.address ? this.state.address : ''}
          onChange={this.handleChange}
        />
        <div style={{ marginBottom: 20 }}>
          <LocationPicker
            containerElement={<div style={{ height: '100%' }} />}
            mapElement={<div style={{ height: '400px' }} />}
            defaultPosition={this.state.position ? this.state.position : defaultPosition}
            onChange={this.handleLocationChange}
            zoom={18}
            radius={-1}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    restaurant: userReducer.restaurant
  }
}

export default connect(mapStateToProps)(RestaurantInfoComponent);
