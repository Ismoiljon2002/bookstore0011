import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Container, Toolbar } from '@mui/material';
import axios from 'axios';

import ResponsiveAppBar from '../components/Navbar';
import BookCard from '../components/BookCard';
import AddBookModalComponent from '../components/AddBookModal';

import { BASE_URL } from '../assets/BASE_URL';

import useSignature from '../utils/useSignature';
import { BookContext } from '../context/BookContext';

function Home() {

    const user = JSON.parse(sessionStorage.getItem('user'))
    const navigate = useNavigate()
    const [addBook, setAddBook] = useState(false);

    const { books, fetchBooks, searchBooks, searching } = useContext(BookContext);

    const addToBooks = (isbn) => {
        const sign = useSignature({
            method: 'POST',
            body: JSON.stringify({ isbn: isbn }),
        })

        axios.post(`${BASE_URL}/books`,
            { isbn },
            {
                headers: {
                    'Key': user?.key,
                    'Sign': sign,
                }
            }
        ).then(res => fetchBooks())
            .catch(err => console.log(err));

    }

    useEffect(() => {

        if (!user?.id) navigate('/signin')

        if (books.length > 0) return
        else fetchBooks()
    }, [])

    return (
        <section id='home' className='home page'>

            <AddBookModalComponent show={addBook} setShow={setAddBook} />

            <ResponsiveAppBar />

            <Container maxWidth="xl">

                {searching && <h3 style={{color: '#fff'}}>Searching...</h3>}

                {
                    searchBooks.length > 0 && <>
                        <h2 style={{ color: '#fff' }}>Search results: </h2>

                        <div className="search-result-container">
                            {
                                searchBooks.map(b => <div className='search-card'>
                                    <h5>{b.title} / <a href={b.cover} target='_blank' >image</a></h5>
                                    <p>By: {b.author}  </p>
                                    <Button onClick={() => addToBooks(b.isbn)}> + Add to books </Button>
                                </div>)
                            }
                        </div>
                    </>
                }

                <Toolbar disableGutters>

                    <Box sx={{ flexGrow: 1 }}>
                        <h2>You've got <span> {books?.length} books </span></h2>
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Button
                            variant='contained'
                            onClick={() => setAddBook(true)}
                        > + Create a book</Button>
                    </Box>
                </Toolbar>

                <Box className="cards">
                    {
                        books.map(book => <BookCard book={book} fetchBooks={fetchBooks} key={book.id} />)
                    }
                </Box>

            </Container>
        </section>
    );
}

export default Home;