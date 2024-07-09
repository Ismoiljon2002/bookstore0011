import { useState} from 'react';
import axios from 'axios';

import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, TextField, Button } from '@mui/material';
import { AlertComponent } from '../components/AlertComponent';

import { BASE_URL } from '../assets/BASE_URL';
import './styles/pages.css'
import useSignature from '../utils/useSignature';


function SignInPage() {

    const navigate = useNavigate();
    const [errMessage, setErrMessage] = useState();
    const [username, setUsername] = useState(false);
    const [password, setPassword] = useState(false);
    
    const sign = useSignature({ url: '/myself', userSecret: password })
    const [alert, setAlert] = useState({
        alertType: "",
        alertMessage: '',
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

        return isValid;

    }

    const submitForm = (e) => {
        e.preventDefault()

        if (validate()) {
            axios.get(`${BASE_URL}/myself`,
                {
                    headers: {
                        key: username,
                        sign,
                    }
                }
            ).then(res => {
                if (res.status === 200) {
                    sessionStorage.setItem('user', JSON.stringify(res.data.data))
                    navigate("/");
                };

            }).catch(err => {
                setAlert({
                    alertMessage: err.response.data.message ? err.response.data.message : err.message,
                    alertType: "danger",
                    show: true,
                });
                setTimeout(() => { setAlert({ show: false}) }, 3000);
            })


        } else console.log('no validation')
    }

    return (
        <section id='signInPage' className='signIn page d-flex justify-content-center align-items-center'>
            <Card>
                <CardContent>
                    <h2>Sign in</h2>

                    <hr />

                    <form onSubmit={submitForm}>

                        <p className="text-danger text-bold" style={{ display: errMessage ? 'block' : 'none' }} > *{errMessage}</p>

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
                            placeholder="Enter Your username"
                            fullWidth
                            onChange={e => setPassword(e.target.value)}
                            required
                        />

                        <Button variant='contained' fullWidth type='submit'>Submit</Button>

                        <p>Don't have an account? <Link to="/signup"> Sign up here </Link> </p>
                    </form>

                    <AlertComponent style={{ position: "fixed" }} message={alert.alertMessage} variant={alert.alertType} show={alert.show} />

                </CardContent>
            </Card>



        </section>
    );
}

export default SignInPage;