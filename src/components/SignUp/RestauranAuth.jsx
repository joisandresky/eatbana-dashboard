import React, { useState, useCallback, Fragment } from 'react';
import { TextField, Grid } from '@material-ui/core';
import { connect } from "react-redux";
import { setRestaurantInfo, doImageUpload } from '../../redux/reducers/userReducer';
import { useDropzone } from "react-dropzone";
import { Cloud as CloudUploadIcon } from "@material-ui/icons";


function RestaurantAuth(props) {
  const [auth, setAuth] = useState({
    email: '',
    password: ''
  });
  const [photo, setPhoto] = useState(null);

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
      currentRestauran['photos'] = [response.url];
      props.dispatch(setRestaurantInfo(currentRestauran));
      setPhoto(response.url);
    }, err => {
      console.log('err', err);
    }))
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleChange = (type, e) => {
    console.log('e', e);
    auth[type] = e;
    let currentRestauran = { ...props.restaurant };
    currentRestauran[type] = e;
    props.dispatch(setRestaurantInfo(currentRestauran));
    setAuth(auth);
  }

  return (
    <div>
      <Grid>
        {
          photo ? (
            <div>
              <p>Restauarant Image</p>
              <img src={photo} alt="ini gambar menu" style={{ width: '100%' }} />
            </div>
          ) : (
              <Fragment>
                <p>Upload Foto Restaurant</p>
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
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        onChange={e => handleChange('email', e.target.value)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        onChange={e => handleChange('password', e.target.value)}
      />
    </div>
  )
}

const mapStateToProps = ({ userReducer }) => {
  return {
    restaurant: userReducer.restaurant
  }
}

export default connect(mapStateToProps)(RestaurantAuth);