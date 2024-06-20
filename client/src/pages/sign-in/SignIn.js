import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import styled from 'styled-components';
import { Close, Email, Keyboard, Password, Person } from '@mui/icons-material';
import googleLogo from '../../images/google.png';
import { useState } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endPoint } from '../../utils/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { closeSignin, openSignin } from '../../redux/slices/setSignInSlice';


// Styled Components
const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 27px;
  color: ${({ theme }) => theme.text_primary};
  margin: 0 25px 10px 25px;
`;

const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.card};
  max-height: 580px;
  border-radius: 16px;
  padding: 25px;
`;

const LogoContainer = styled.div`
  width: 350px;
  padding: 5px;
  margin: 10px 0;
  height: 45px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text_secondary};
`;

const Logo = styled.img`
  width: 25px;
  margin-right: 10px;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  color: #ccc; 

  :before,
  :after {
    content: '';
    margin: 20px;
    flex: 1;
    border-bottom: 1px solid #ccc;
  }
`;

const InputContainer = styled.div`
  width: 350px;
  padding: 5px;
  margin: 10px 0;
  height: 45px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: ${({ theme }) => theme.text_secondary};
`;

const Input = styled.input`
  color: ${({ theme }) => theme.text_secondary};
  background-color: transparent;
  width: 270px;
  outline: none;

  &:active {
    border-color: transparent;
  }
`;

const ForgetPassword = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  width: fit-content;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const SubmitButton = styled.button`
  width: 350px;
  border-radius: 12px;
  height: 35px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  background-color: ${({ theme }) => theme.text_secondary};
  color: ${({ theme }) => theme.bg};
  font-weight: 700;
`;

const CreateAccount = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  text-align: center;
  margin: 20px;
  font-size: 15px;
`;

const Span = styled.span`
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
`;

const SignIn = () => {
    const dispatch = useDispatch()
    const queryClient = useQueryClient();
    const [login, setLogin] = useState(false);
    const value = useSelector(store => store.signIn.opensi);
    const [open, setOpen] = useState(value);
    const [formData, setFormData] = useState({
        email: '',
        fullname: '',
        username: '',
        password: ''
    });



    const { mutate: signIn, isPending: isLoginPending } = useMutation({
        mutationFn: async ({ email, password }) => {
            try {
                const res = await fetch(`${endPoint}/api/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authUser'] })
        }
    });

    const { mutate: signUp, isPending: isRegisterPending } = useMutation({
        mutationFn: async ({ fullname, email, username, password }) => {
            try {
                const res = await fetch(`${endPoint}/api/auth/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ fullname, email, username, password })
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            console.log('sign in');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!login) {
            const { email, password } = formData;
            signIn({ email, password });
        } else {
            signUp(formData);
        }
        handleClose()
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleClickOpen = () => {
        dispatch(openSignin())
    };

    const handleClose = () => {
        dispatch(closeSignin())
    };

    const handleLogin = () => {
        setLogin(!login);
    };

    useEffect(() => {
        setOpen(value);
    }, [value]);

    return (
        <React.Fragment>
            <Button
                variant="outlined"
                sx={{
                    backgroundColor: 'transparent',
                    color: '#be1adb',
                    border: 'none',
                    ":hover": { border: 'none', backgroundColor: 'transparent' }
                }}
                onClick={handleClickOpen}
            >
                Sign In
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
                    <Title>
                        <div>{!login ? 'Sign In' : 'Sign Up'}</div>
                        <Close onClick={handleClose} sx={{ cursor: 'pointer' }} />
                    </Title>
                    <DialogContent>
                        <LogoContainer style={{ cursor: 'pointer' }}>
                            <Logo src={googleLogo} />
                            <div>Sign in with Google</div>
                        </LogoContainer>
                        <Divider>or</Divider>
                        {login && (
                            <InputContainer>
                                <Keyboard />
                                <Input
                                    placeholder='Full Name'
                                    type='text'
                                    name='fullname'
                                    onChange={handleInputChange}
                                    value={formData.fullname}
                                />
                            </InputContainer>
                        )}
                        <InputContainer>
                            <Email />
                            <Input
                                placeholder='Email'
                                type='email'
                                name='email'
                                onChange={handleInputChange}
                                value={formData.email}
                            />
                        </InputContainer>
                        {login && (
                            <InputContainer>
                                <Person />
                                <Input
                                    placeholder='Username'
                                    type='text'
                                    name='username'
                                    onChange={handleInputChange}
                                    value={formData.username}
                                />
                            </InputContainer>
                        )}
                        <InputContainer>
                            <Password />
                            <Input
                                placeholder='Password'
                                type='password'
                                name='password'
                                onChange={handleInputChange}
                                value={formData.password}
                            />
                        </InputContainer>
                        {!login && (
                            <div className='flex justify-end mr-[20px] mb-[10px]'>
                                <ForgetPassword>Forgot password ?</ForgetPassword>
                            </div>
                        )}
                        <div className='flex justify-center'>
                            <SubmitButton onClick={handleSubmit}>
                                {isLoginPending || isRegisterPending ? "Loading..." : !login ? 'Sign In' : "Sign Up"}
                            </SubmitButton>
                        </div>
                    </DialogContent>
                    <CreateAccount>
                        {!login ? "Don't have an account ?" : "Already have an account ?"}
                        <Span onClick={handleLogin}>{!login ? ' Sign Up' : ' Sign In'}</Span>
                    </CreateAccount>
                </FormContainer>
            </Dialog>
        </React.Fragment>
    );
};

export default SignIn;
