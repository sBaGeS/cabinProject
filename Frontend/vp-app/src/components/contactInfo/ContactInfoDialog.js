import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),

        color: theme.palette.text.secondary,
    },
    tableHeader: {
        backgroundColor: 'navy',

    },
    tableHeaderCell: {
        color: 'white'
    }
}));

export default function ContactInfoDialog(props) {

    const classes = useStyles();

    const token = props.token;
    const cabin = props.cabinData[0];
    const [dialogOpen, setDialogOpen] = useState(true);

    const handleClose = () => {
        setDialogOpen(false);
        props.contactInfo(false);
    };

    return (
        <div>
            <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Contact info</DialogTitle>
                <DialogContent>
                <TableContainer>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead className={classes.tableHeader}>
                                    <TableRow>
                                        <TableCell className={classes.tableHeaderCell} align="center">Cabin owner</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="center">Phonenumber</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="center">Email</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                   <TableRow >
                                        <TableCell align="center">{cabin.cabinOwner}</TableCell>
                                        <TableCell align="center">{cabin.cabinOwnerPhonenumber}</TableCell>
                                        <TableCell align="center">{cabin.cabinOwnerEmail}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                </DialogContent>
                <DialogActions>
                <Button variant="contained" onClick={() => handleClose()}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}