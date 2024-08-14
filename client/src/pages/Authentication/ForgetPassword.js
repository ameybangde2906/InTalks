import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { closeForgotPassword, openForgotPassword } from '../../redux/slices/setForgotPasswordSlice';
import styled from 'styled-components';

const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.card};
  min-height: 380px;
  border-radius: 16px;
  padding: 25px;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 27px;
  color: ${({ theme }) => theme.primary};
  margin: 0 25px 10px 25px;
`;


function ForgotPassword() {
    const dispatch = useDispatch()
    const value = useSelector(store => store.forgotPassword.openfp)
    const [open, setOpen] = useState(value)

    useEffect(() => {
        setOpen(value)
    }, [value])

    const handleClose = () => {
        dispatch(closeForgotPassword())
    }

    const handleClickOpen = () => {
        dispatch(openForgotPassword())
    }

    return (
        <React.Fragment>
            <Button
                variant="outlined"
                sx={{
                    fontSize: '12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    margin: '0',
                    padding: '0',
                    height: '23px',
                    width: '70px',
                    ":hover": { border: 'none', backgroundColor: 'transparent' }
                }}
                onClick={handleClickOpen}
            >
                <div>
                    Forgot password
                </div>
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                }}
                sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    '& .MuiPaper-root': {
                        borderRadius: '16px',
                        backgroundColor: 'transparent',
                    },
                }}
            >
                <FormContainer>
                    <DialogContent>
                        <Title>Forget password</Title>
                    </DialogContent>
                </FormContainer>

            </Dialog>
        </React.Fragment>
    )
}

export default ForgotPassword