import React, { useState, useEffect } from 'react'
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination, CircularProgress, Grid, ButtonGroup, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { doGetReservation, doUpdateReservation } from "../redux/reducers/reservationReducer";
import Moment from "react-moment";
import "moment-timezone";
import { Delete as DeleteIcon, Create as EditIcon, Clear as RejectedIcon, Check as AcceptedIcon } from "@material-ui/icons";

const usesStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  progress: {
    margin: theme.spacing(2),
    // display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  editIcon: {
    marginRight: theme.spacing(1)
  }
}))

export const Reservation = (props) => {
  const classes = usesStyles();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [reservations, setReservations] = useState([]);
  const [total, setTotalRow] = useState(0);

  useEffect(() => {
    getReservations(1, limit);
  }, []);

  const getReservations = (currentPage, currentLimit) => {
    console.log('the page', page);
    let userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null;
    let restaurant = userData.role === 'owner' ? userData.restaurant : userData._id;

    props.dispatch(doGetReservation({ page: currentPage, limit: currentLimit, id: restaurant._id }, response => {
      console.log('response', response);
      setReservations(response.reservations);
      setTotalRow(response.total);
    }, err => {
      console.log('err', err);
    }))
  }

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
    getReservations(newPage + 1, limit);
  }

  const handleChangeRowsPerPage = e => {
    setLimit(parseInt(e.target.value, 10));
    setPage(0);
    getReservations(1, parseInt(e.target.value, 10));
  }

  const showStatus = status => {
    return status === 'confirmed' ? <AcceptedIcon style={{ color: 'green' }} /> : <RejectedIcon style={{ color: 'red' }} />;
  }

  const onUpdateStatus = (id, status) => {
    let userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null;
    if (!userData) return;
    let email = userData.email;

    if (window.confirm(`Apakah kamu yaking ingin ${status === 'rejected' ? 'MENOLAK' : 'MENERIMA'} Reservasi ini ?`)) {
      props.dispatch(doUpdateReservation(id, { email: email, status: status }, response => {
        console.log('response', response);
        setPage(0);
        setLimit(5);
        getReservations(1, 5);
      }, err => {
        console.log('err', err);
        alert('An Error Occured to update Reservation Status');
      }))
    }
  }

  return (
    <Paper className={classes.paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Guest Name</TableCell>
            <TableCell>Session</TableCell>
            <TableCell>Booking Date</TableCell>
            <TableCell>Number of Guest</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            reservations.map(reserve => (
              <TableRow key={reserve._id}>
                <TableCell>{reserve.guest.firstName}</TableCell>
                <TableCell>{reserve.session.toUpperCase()}</TableCell>
                <TableCell>
                  <Moment date={reserve.bookDate} format={"DD/MM/YYYY HH:mm"} />
                </TableCell>
                <TableCell>{reserve.numberGuest}</TableCell>
                <TableCell>{reserve.status}</TableCell>
                <TableCell>
                  <Grid item>
                    {
                      reserve.status === 'new' ? (
                        <ButtonGroup size="small" aria-label="small outlined button group">
                          <Button color="secondary" onClick={() => onUpdateStatus(reserve._id, 'rejected')}>
                            <DeleteIcon />
                            TOLAK
                          </Button>
                          <Button color="primary" onClick={() => onUpdateStatus(reserve._id, 'confirmed')}>
                            <EditIcon className={classes.editIcon} />
                            TERIMA
                          </Button>
                        </ButtonGroup>
                      ) : showStatus(reserve.status)
                    }
                  </Grid>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              colSpan={3}
              count={total}
              rowsPerPage={limit}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            // ActionsComponent={TablePaginationActions}
            />
            {props.onLoading ? <TableCell><CircularProgress color="secondary" style={{ marginLeft: 40, marginTop: 20 }} /></TableCell> : null}
          </TableRow>
        </TableFooter>
      </Table>
    </Paper>
  );
}

const mapStateToProps = ({ reservationReducer }) => {
  return {
    reservationList: reservationReducer.reservations,
    onLoading: reservationReducer.onLoading
  }
}

export default connect(mapStateToProps)(Reservation);