import React, { useContext, useState } from 'react';
import axios from 'axios';
import { TextField, Button } from '@mui/material';
import { Modal } from 'react-bootstrap';
import { XCircle } from 'react-bootstrap-icons';
import { BASE_URL } from '../assets/BASE_URL';
import './styles/componentStyles.css';
import useSignature from '../utils/useSignature';
import { BookContext } from '../context/BookContext';

const AddBookModalComponent = ({ show, setShow }) => {
    const [isbn, setIsbn] = useState('')
    const user = JSON.parse(sessionStorage.getItem('user'))

    const { fetchBooks } = useContext(BookContext);

    const [errMessage, setErrMessage] = useState('');

    const sign = useSignature({
        method: 'POST',
        body: JSON.stringify({ isbn: isbn }),
    })

    const addBook = () => {
        axios.post(`${BASE_URL}/books`,
            { isbn },
            {
                headers: {
                    'Key': user.key,
                    'Sign': sign,
                }
            }
        ).then(res => {
            fetchBooks()
            setErrMessage("Done")
        })
        .catch(err => setErrMessage(err.response.data.message ? err.response.data.message : err.message));
    }

    return (
        <Modal
            show={show}
            onHide={() => setShow(false)}
            aria-labelledby="example-custom-modal-styling-title"
        >
            <Modal.Header>
                <Modal.Title>
                    Create a book
                </Modal.Title>
                <Button className='close-btn' onClick={() => setShow(false)}>
                    <XCircle size={20} />
                </Button>
            </Modal.Header>
            <Modal.Body>

                <label>ISBN</label>
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    placeholder="______________"
                    fullWidth
                    onChange={e => setIsbn(e.target.value)}
                />
                <p className='text-danger' style={{ display: errMessage ? 'block' : 'none' }} >* {errMessage}</p>

                <div className="btns">
                    <Button variant='outlined' onClick={() => setShow(false)}>Close</Button>
                    <Button variant='contained' onClick={addBook}>Submit</Button>
                </div>

            </Modal.Body>
        </Modal>
    )
}

export default AddBookModalComponent