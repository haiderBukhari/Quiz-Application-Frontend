import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Fragment } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Paper, { PaperProps } from '@mui/material/Paper';

interface TransparentPaperProps extends PaperProps {
    children: React.ReactNode;
}

const TransparentPaper: React.FC<TransparentPaperProps> = ({ children, ...rest }) => {
    return (
        <Paper {...rest} style={{ backgroundColor: 'transparent', border: 'transparent', borderRadius: 0, boxShadow: 'none' }}>
            {children}
        </Paper>
    );
};

const LoaderModal: React.FC = () => {
    return (
        <Fragment>
            <Dialog
                open={true}
                PaperComponent={TransparentPaper}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <CircularProgress style={{color: '#002351'}}/>
                </DialogTitle>
            </Dialog>
        </Fragment>
    );
};

export default LoaderModal;
