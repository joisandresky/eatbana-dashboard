import React, { useCallback, useState, Fragment } from 'react';
import { connect } from "react-redux";
import { setRestaurantInfo, doImageUpload } from '../../redux/reducers/userReducer';
import { MuiPickersUtilsProvider, KeyboardTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { TextField, Grid, FormControl, InputLabel, Select, MenuItem, Input, Button, Table, TableHead, TableBody, TableRow, TableCell, FormLabel, FormGroup, FormControlLabel, Checkbox } from "@material-ui/core";
import { Save as SaveIcon, HighlightOff as DeleteIcon, Delete, CloudUpload as CloudUploadIcon } from "@material-ui/icons";
import { format as FormatDate } from "date-fns";
import Facilities from "../../dummies/Facilities";
import { useDropzone } from "react-dropzone";


function RestaurantDetail(props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCloseDate, setSelectedCloseDate] = useState(new Date());
  const [detail, setDetail] = useState({});
  const [openings, setOpenings] = useState([]);
  const [day, setDay] = useState('');
  const [facilities, setFacilities] = useState([...Facilities]);
  const [bookAvailable, setBookAvailable] = useState(false);
  const [capacity, setCapacity] = useState(0);
  const [lowCost, setLowestCost] = useState(0);
  const [highCost, setHighestCost] = useState(0);
  const [avgCost, setAvgCost] = useState(0);
  const [imageMenu, setImageMenu] = useState(null);

  // For dropzone library
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    console.log('file', acceptedFiles);
    let fd = new FormData();
    fd.append('file', acceptedFiles[0]);
    fd.append('upload_preset', 'nxbnxyqk');
    props.dispatch(doImageUpload(fd, response => {
      console.log('response image', response);
      let currentRestauran = { ...props.restaurant };
      console.log('prev', currentRestauran);
      currentRestauran['menuImage'] = [response.url];
      console.log('next', currentRestauran);
      props.dispatch(setRestaurantInfo(currentRestauran));
      setImageMenu(response.url);
    }, err => {
      console.log('err', err);
    }))
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleChange = e => {
    let event = e;
    let currentRestaurant = { ...props.restaurant };
    currentRestaurant[event.target.name] = event.target.value;
    props.dispatch(setRestaurantInfo(currentRestaurant));
    setDetail(currentRestaurant);
  }

  const handleCapacityChange = e => {
    let currentRestauran = { ...props.restaurant };
    currentRestauran[e.target.name] = e.target.value;
    props.dispatch(setRestaurantInfo(currentRestauran));
    setCapacity(e.target.value);
  }

  const handleDateChange = (type, date) => {
    if (type === 'opening') {
      setSelectedDate(date)
    } else {
      setSelectedCloseDate(date);
    }
  }

  const addToDetailOpening = () => {
    let newOpening = {
      day: day,
      startHours: selectedDate,
      endHours: selectedCloseDate
    };
    let index = openings.findIndex(open => open.day === day);

    if (index < 0) {
      let currentRestaurant = { ...props.restaurant };
      currentRestaurant['openingHours'] = [...openings, newOpening];
      props.dispatch(setRestaurantInfo(currentRestaurant));
      setOpenings([...openings, newOpening]);
    }
  }

  const removeItem = index => {
    let currentItems = [...openings];
    let currentRestaurant = { ...props.restaurant };
    currentItems.splice(index, 1);
    currentRestaurant['openingHours'] = currentItems;
    props.dispatch(setRestaurantInfo(currentRestaurant));
    setOpenings(currentItems);
  }

  const handleChangeCheck = name => event => {
    let index = facilities.findIndex(fac => fac.value === name);
    if (index > -1) {
      let currentFacilities = [...facilities];
      currentFacilities[index].selected = event.target.checked;

      let currentRestaurant = { ...props.restaurant };
      currentRestaurant['facilities'] = currentFacilities;
      props.dispatch(setRestaurantInfo(currentRestaurant));
      setFacilities(currentFacilities);
    }
  }

  const handleCheckBookAvailable = () => event => {
    let newStatus = event.target.checked;
    let currentRestaurant = { ...props.restaurant };
    currentRestaurant['bookAvailable'] = newStatus;
    props.dispatch(setRestaurantInfo(currentRestaurant));
    setBookAvailable(newStatus);
  }

  const handleCost = (type, event) => {
    if (type === 'low') {
      let currentRestauran = { ...props.restaurant };
      currentRestauran['lowCost'] = event.target.value;
      props.dispatch(setRestaurantInfo(currentRestauran));
      setLowestCost(event.target.value);
    } else if (type === 'high') {
      let currentRestauran = { ...props.restaurant };
      currentRestauran['highestCost'] = event.target.value;
      props.dispatch(setRestaurantInfo(currentRestauran));
      setHighestCost(event.target.value);
    } else {
      let currentRestauran = { ...props.restaurant };
      currentRestauran['avgCost'] = event.target.value;
      props.dispatch(setRestaurantInfo(currentRestauran));
      setAvgCost(event.target.value);
    }
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div style={{ marginBottom: 10 }}>
        <Grid>
          {
            imageMenu ? (
              <div>
                <p>Menu Image</p>
                <img src={imageMenu} alt="ini gambar menu" style={{ width: '100%' }} />
              </div>
            ) : (
                <Fragment>
                  <p>Upload Foto Menu</p>
                  <div {...getRootProps()} style={{ width: '100%', minHeight: 150, border: '1px solid black' }}>
                    <input {...getInputProps()} />
                    {
                      isDragActive ?
                        (
                          <React.Fragment>
                            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}><CloudUploadIcon fontSize="large" /></div>
                            <p style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>Drop the files here ...</p>
                          </React.Fragment>
                        ) :
                        (
                          <React.Fragment>
                            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}><CloudUploadIcon fontSize="large" /></div>
                            <p style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>Drag 'n' drop some files here, or click to select files</p>
                          </React.Fragment>
                        )
                    }
                  </div>
                </Fragment>
              )
          }
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs>
            <FormControl style={{ width: '100%' }} variant="outlined" margin="normal">
              <InputLabel htmlFor="age-helper">Opening Day</InputLabel>
              <Select
                value={day ? day : ''}
                onChange={(e) => setDay(e.target.value)}
                name="day"
                input={<Input name="day" id="age-helper" />}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"Senin"}>Senin</MenuItem>
                <MenuItem value={"Selasa"}>Selasa</MenuItem>
                <MenuItem value={"Rabu"}>Rabu</MenuItem>
                <MenuItem value={"Kamis"}>Kamis</MenuItem>
                <MenuItem value={"Jumat"}>Jumat</MenuItem>
                <MenuItem value={"Sabtu"}>Sabtu</MenuItem>
                <MenuItem value={"Minggu"}>Minggu</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs>
            <KeyboardTimePicker
              margin="normal"
              id="mui-pickers-time"
              label="Opening Hours"
              fullWidth
              value={selectedDate}
              onChange={(date) => handleDateChange('opening', date)}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
          </Grid>
          <Grid item xs>
            <KeyboardTimePicker
              margin="normal"
              id="mui-pickers-time"
              label="Closing Hours"
              fullWidth
              value={selectedCloseDate}
              onChange={(date) => handleDateChange('close', date)}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs>
            <Button onClick={addToDetailOpening} color="secondary" variant="contained" fullWidth>
              <SaveIcon style={{ marginRight: 5 }} />
              Add to List
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          {openings.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Day</TableCell>
                  <TableCell>Opening Hour</TableCell>
                  <TableCell>Closing Hour</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {openings.map((open, index) => (
                  <TableRow key={open.day}>
                    <TableCell>{open.day}</TableCell>
                    <TableCell>{FormatDate(open.startHours, 'HH:mm')}</TableCell>
                    <TableCell>{FormatDate(open.endHours, 'HH:mm')}</TableCell>
                    <TableCell>
                      <Button color="primary" onClick={() => removeItem(index)}>
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </Grid>
        <hr />
        <Grid container spacing={1} style={{ marginTop: 20 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Facilities</FormLabel>
            <FormGroup>
              {
                facilities.map(fac => (
                  <React.Fragment key={fac.value}>
                    <FormControlLabel label={fac.name} control={<Checkbox checked={fac.selected} onChange={handleChangeCheck(fac.value)} value={fac.value} />} />
                  </React.Fragment>
                ))
              }
            </FormGroup>
          </FormControl>
        </Grid>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="capacity"
          label="Restaurant Capacity"
          name="capacity"
          autoComplete="capacity"
          autoFocus
          onChange={handleCapacityChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="lowCost"
          label="Lowest Price"
          name="lowCost"
          autoComplete="lowCost"
          autoFocus
          onChange={e => handleCost('low', e)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="highCost"
          label="Highest Price"
          name="highCost"
          autoComplete="highCost"
          autoFocus
          onChange={e => handleCost('high', e)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="avgCost"
          label="Average Price"
          name="avgCost"
          autoComplete="avgCost"
          autoFocus
          onChange={e => handleCost('avg', e)}
        />
        <Grid container spacing={1} style={{ marginTop: 20 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Available for Booking ?</FormLabel>
            <FormGroup>
              <FormControlLabel label="Yes, It`s Available" control={<Checkbox checked={bookAvailable} onChange={handleCheckBookAvailable()} />} />
            </FormGroup>
          </FormControl>
        </Grid>
      </div>
    </MuiPickersUtilsProvider >
  )
}

const mapStateToProps = ({ userReducer }) => {
  return {
    restaurant: userReducer.restaurant
  }
};

export default connect(mapStateToProps)(RestaurantDetail);