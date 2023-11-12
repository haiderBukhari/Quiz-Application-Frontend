import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Fragment } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const LoaderModal: React.FC = () => {
    return (
        <Fragment>
            <Dialog
                open={true}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    style: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        borderRadius: '0px',
                        border: 'none'
                    },
                }}
            >
                <DialogTitle id="alert-dialog-title">
                    <CircularProgress style={{ color: '#002351' }} />
                </DialogTitle>
            </Dialog>
        </Fragment>
    );
};

export default LoaderModal;
