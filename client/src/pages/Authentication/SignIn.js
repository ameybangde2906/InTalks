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
import { openForgotPassword } from '../../redux/slices/setForgotPasswordSlice';
import ForgotPassword from './ForgetPassword';


// Styled Components
const ButtonText = styled.p`
color: ${({ theme }) => theme.bg};
background: ${({ theme }) => theme.button_text};
/* background: color-mix(in HSL, color percentage, color percentage);
-webkit-background-clip: text;
color: transparent; */
border-radius: 10px;
width: 100%;
font-weight: 700;
padding: 4px 10px;
`

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 27px;
  color: ${({ theme }) => theme.primary};
  margin: 0 25px 10px 25px;
`;

const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.card};
  min-height: 380px;
  border-radius: 16px;
  padding: 25px;
`;

const GoogleSignIn = styled.div`
  width: 100%;
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
  width: 100%;
  padding: 5px;
  margin-top: 8px;
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
  width: 85%;
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
  margin-top: 10px;
  &:hover {
    color: ${({ theme }) => theme.primary};
    font-weight:700 ;
  }
`;

const SubmitButton = styled.button`
  width: 350px;
  border-radius: 12px;
  height: 35px;
  background: ${({ theme }) => theme.button_text};
  color: ${({ theme }) => theme.bg};
  font-weight: 700;
  margin-top: 15px;
`;

const CreateAccount = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  text-align: center;
  margin: 20px;
  font-size: 15px;
`;
const DemoAccount = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  text-align: center;
  font-size: 12px;
`;

const Span = styled.span`
  color: ${({ theme }) => theme.text_secondary};
  cursor: pointer;
  &:hover{
    color: ${({ theme }) => theme.primary};
    font-weight:700 ;
  }
`;

const Validations = styled.span`
font-size: 10px;
color: red;
margin: 0;
`

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

    const [errors, setErrors] = useState({
        fullname: '',
        username: '',
        email: '',
        password: '',
    });

    const { mutate: signIn, isPending: isLoginPending, isError: isSigninError, error: signInError, reset: resetSignInError } = useMutation({
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
            handleClose()
        }
    });

    const { mutate: signUp, isPending: isRegisterPending, isError: isSignupError, error: signUpError, reset: resetSignUpError } = useMutation({
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
            handleClose()
        }
    });

    const validateField = (name, value) => {
        let error = '';
        if (name === 'username' && !value) {
            error = 'Username is required';
        } else if (name === 'email') {
            if (!value) {
                error = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                error = 'Email is invalid';
            }
        } else if (name === 'password' && value.length < 6) {
            error = 'Password must be at least 6 characters';
        } else if (name === 'fullname' && !value) {
            error = "Fullname is required"
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        Object.keys(formData).forEach((key) => {
            validateField(key, formData[key]);
        });

        const hasErrors = Object.values(errors).some(error => error !== '');

        if (!login && !hasErrors) {
            const { email, password } = formData;
            signIn({ email, password });
        } else if (login && !hasErrors) {
            signUp(formData);
        }

    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleClickOpen = () => {
        dispatch(openSignin())
    };

    const handleClose = () => {
        dispatch(closeSignin());
        resetSignInError();
        resetSignUpError();
        setFormData((prevErrors) => ({
            ...prevErrors,
            fullname: '',
            username: '',
            email: '',
            password: '',

        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            fullname: '',
            username: '',
            email: '',
            password: '',

        }));
    };

    const handleLogin = () => {
        setLogin(!login);
        resetSignInError()
        resetSignUpError()
        setErrors((prevErrors) => ({
            ...prevErrors,
            fullname: '',
            username: '',
            email: '',
            password: '',

        }));
    };

    const loginWithGoogle = () => {
        window.open("https://intalks.onrender.com/api/auth/google/callback", "_self")
    }

    const handleForgetPassword=()=>{
        dispatch(closeSignin())
        dispatch(openForgotPassword())
    }

    useEffect(() => {
        setOpen(value);
    }, [value]);

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
                <ButtonText>
                    Sign In
                </ButtonText>
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
                        <GoogleSignIn style={{ cursor: 'pointer' }} onClick={loginWithGoogle}>
                            <Logo src={googleLogo} />
                            <div>Sign in with Google</div>
                        </GoogleSignIn>
                        <Divider>or</Divider>
                        {login &&
                            <div>
                                <InputContainer>
                                    <Keyboard />
                                    <Input
                                        placeholder='Full Name'
                                        type='text'
                                        name='fullname'
                                        onChange={handleInputChange}
                                        value={formData.fullname}
                                        onBlur={handleBlur}
                                    />
                                </InputContainer>
                                {errors.fullname && <Validations className="error">{errors.fullname}</Validations>}
                            </div>
                        }

                        <div>
                            <InputContainer>
                                <Email />
                                <Input
                                    placeholder='Email'
                                    type='email'
                                    name='email'
                                    onChange={handleInputChange}
                                    value={formData.email}
                                    onBlur={handleBlur}
                                />
                            </InputContainer>
                            {errors.email && <Validations className="error">{errors.email}</Validations>}
                        </div>


                        {login && (
                            <div>
                                <InputContainer>
                                    <Person />
                                    <Input
                                        placeholder='Username'
                                        type='text'
                                        name='username'
                                        onChange={handleInputChange}
                                        value={formData.username}
                                        onBlur={handleBlur}
                                    />
                                </InputContainer>
                                {errors.username && <Validations className="error">{errors.username}</Validations>}
                            </div>
                        )}
                        <div>
                            <InputContainer>
                                <Password />
                                <Input
                                    placeholder='Password'
                                    type='password'
                                    name='password'
                                    onChange={handleInputChange}
                                    value={formData.password}
                                    onBlur={handleBlur}
                                />
                            </InputContainer>
                            {errors.password && <Validations className="error">{errors.password}</Validations>}
                        </div>
{/* 
                        {!login && (
                            <div className='flex justify-end mr-[20px] mb-[10px]'>
                                <ForgetPassword><ForgotPassword/></ForgetPassword>
                            </div>
                        )} */}
                        <div className='flex justify-center'>
                            <SubmitButton onClick={handleSubmit}>
                                {isLoginPending || isRegisterPending ? "Loading..." : !login ? 'Sign In' : "Sign Up"}
                            </SubmitButton>
                        </div>
                        {(isSigninError || isSignupError) && <p className='text-red-500' fontSize='small' >{signInError?.message || signUpError?.message}</p>}
                    </DialogContent>
                    <DemoAccount>
                        <span> Demo -</span>
                        <span>Email : jethalal@gmail.com | Pass : 123456</span>
                    </DemoAccount>
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
