import React, { createContext, useState } from 'react';
import { BASE_URL } from '../assets/BASE_URL';
import axios from 'axios';
import useSignature from '../utils/useSignature';

export const BookContext = createContext();

export const BookProvider = ({ children }) => {

    const sign = useSignature({})

    const [searching, setSearching] = useState(false)
    const [books, setBooks] = useState([]);
    const [searchBooks, setSearchBooks] = useState([]);
    
    const user = JSON.parse(sessionStorage.getItem('user'))
    
    const fetchBooks = () => {
        axios.get(`${BASE_URL}/books`,
            {
                headers: {
                    Key: user?.key,
                    Sign: sign,
                }
            }
        )
            .then(res => setBooks(res.data.data))
            .catch(err => {
                console.log('ERROR GET BOOKS', err)
            })
    }

    return <BookContext.Provider value={{
        books, setBooks, fetchBooks, searchBooks, setSearchBooks, searching, setSearching
    }}>
        {children}
    </BookContext.Provider>
}