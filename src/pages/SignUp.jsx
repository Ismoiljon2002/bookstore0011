import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, TextField, Button } from '@mui/material';
import { BASE_URL } from '../assets/BASE_URL';
import axios from 'axios';
import './styles/pages.css'

import { AlertComponent } from '../components/AlertComponent';

function SignUpPage() {
    const navigate = useNavigate();
    const [errMessage, setErrMessage] = useState();
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [alert, setAlert] = useState({
        alertType: "",
        alertMessage: '',
        show: false
    })

    const validate = () => {
        let isValid = true;

        // validate username (key)
        if (username.trim() === '') {
            setErrMessage('Username is required!');
            isValid = false;
            if (username.split(' ').length > 1) {
                setErrMessage("Username must be one word only!");
                isValid = false;
            }
        } else setErrMessage('');


        // validate password
        if (password.length < 8) {
            setErrMessage('Password must be at least 8 characters long');
            isValid = false;
        }
        if (password !== confirmPassword) {
            setErrMessage('Password does not match');
            isValid = false;
        }

        return isValid;

    }

    const submitForm = (e) => {
        e.preventDefault();

        if (validate()) {
            axios.post(`${BASE_URL}/signup`,
                {
                    key: username,
                    secret: password
                }
            ).then(res => {
                if (res.status === 200) {
                    sessionStorage.setItem('user', JSON.stringify(res.data.data))

                    setAlert({ 
                        alertMessage: "Successfully created an account!",
                        alertType: "success",
                        show: true
                    });
                    

                    setTimeout(() => {
                        setAlert({show: false});
                        navigate("/");
                    }, 1000);
                };

            }).catch(err => {
                console.log('err from signUP ', err)
                setAlert({ 
                    alertMessage: err.response.data.message ? err.response.data.message : err.message,
                    alertType: "danger" ,
                    show: true
                });

                setTimeout(() => { setAlert({show: false}); }, 3000);
            })


        } else console.log('no validation')
    }

    return (
        <section id='signUpPage' className='signUp page d-flex justify-content-center align-items-center'>
            <Card>
                <CardContent>
                    <h2>Sign up</h2>

                    <hr />

                    <form onSubmit={submitForm}>
                        <p className="text-danger text-bold" style={{ display: errMessage ? "block" : 'none' }} > *{errMessage}</p>
  
                        <label>Username</label>
                        <TextField
                            id="outlined-basic"
                            variant="outlined"
                            placeholder="Enter Your Username"
                            fullWidth
                            onChange={e => setUsername(e.target.value)}
                            required
                        />

                        <label>Password</label>
                        <TextField
                            id="outlined-basic"
                            variant="outlined"
                            type='password'
                            placeholder="Enter your password"
                            fullWidth
                            onChange={e => setPassword(e.target.value)}
                            required
                        />

                        <label>Confirm password</label>
                        <TextField
                            id="outlined-basic"
                            variant="outlined"
                            type='password'
                            placeholder="Enter your confirm password"
                            fullWidth
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />

                        <Button variant='contained' fullWidth type='submit' >Submit</Button>

                        <p>Already signed up? <Link to="/signin">Sign in here </Link> </p>
                    </form>
                </CardContent>

                <AlertComponent style={{ position: "fixed" }} message={alert.alertMessage} variant={alert.alertType} show={alert.show} />

            </Card>


        </section>
    );
}

export default SignUpPage;