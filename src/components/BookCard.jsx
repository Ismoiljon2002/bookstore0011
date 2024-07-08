import { useContext, useState } from 'react';
import { Box, Card, Tooltip, CardContent, Toolbar, Typography, Button } from '@mui/material';
import useSignature from '../utils/useSignature';
import axios from 'axios';
import { BASE_URL } from '../assets/BASE_URL'
import { AlertComponent } from './AlertComponent';
import { BookContext } from '../context/BookContext';

function BookCard({ book }) {
    const { fetchBooks } = useContext(BookContext);

    const user = JSON.parse(sessionStorage.getItem('user'));

    const { id, title, isbn, author, published, pages, cover } = book?.book;

    const [bookStatus, setBookStatus] = useState(book.status === 0 ? 'New' : book.status === 1 ? 'Reading' : "Finished")

    const [editing, setEditing] = useState(false);

    const [alert, setAlert] = useState({
        alertType: "",
        alertMessage: '',
    })
    
    const changeStatus = (status) => {
        const sign = useSignature({ method: 'PATCH', url: `/books/${id}`, body: JSON.stringify({status: status}) })

        axios.patch(`${BASE_URL}/books/${id}`,
            { status },
            {
                headers: {
                    'Key': user.key,
                    'Sign': sign
                }
            }
        ).then(res => {
            fetchBooks()
            setAlert({ alertMessage: "Edited Successfully", show: true, alertType: 'success' })
        })
            .catch(err => {
                console.log('err CHANGE', err)
                setAlert({ alertType: 'danger', alertMessage: err.message, show: true })
            })
            .finally(() => {
                setTimeout(() => { setAlert({ show: false }) }, 3000)
            })
    }

    const deleteBook = () => {
        const sign = useSignature({ method: 'DELETE', url: `/books/${id}` })
        axios.delete(`${BASE_URL}/books/${id}`, {
            headers: {
                'Key': user?.key,
                'Sign': sign
            }
        }).then(res => {
            fetchBooks()
            setAlert({ alertMessage: "Deleted Successfully", show: true, alertType: 'success' })
        })
            .catch(err => {
                console.log('err DELETE', err)
                setAlert({ alertType: 'danger', alertMessage: err.message, show: true })
            })
            .finally(() => {
                setTimeout(() => { setAlert({ show: false }) }, 3000)
            })
    }


    return (<>
        <Card>
            <CardContent>
                <AlertComponent style={{ position: "fixed" }} message={alert.alertMessage} variant={alert.alertType} show={alert.show} />

                <h3>{title}</h3>
                <Typography>
                    Cover: {cover && <a href={cover} target="_blank" rel="noopener noreferrer">url to cover</a>}
                </Typography>

                <Typography>Pages: {pages}</Typography>
                <Typography>Published: {published}</Typography>
                <Typography>ISBN: {isbn}</Typography>

                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography>{author} / {published}</Typography>
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Typography className={'status ' + bookStatus}>{bookStatus}</Typography>
                    </Box>
                </Toolbar>

                <div className="buttons">
                    <Button className='delete'
                        onClick={deleteBook}
                    >
                        <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.3334 3.99998V3.46665C10.3334 2.71991 10.3334 2.34654 10.1881 2.06133C10.0603 1.81044 9.85629 1.60647 9.6054 1.47864C9.32019 1.33331 8.94682 1.33331 8.20008 1.33331H7.13341C6.38668 1.33331 6.01331 1.33331 5.72809 1.47864C5.47721 1.60647 5.27324 1.81044 5.14541 2.06133C5.00008 2.34654 5.00008 2.71991 5.00008 3.46665V3.99998M6.33341 7.66665V11M9.00008 7.66665V11M1.66675 3.99998H13.6667M12.3334 3.99998V11.4666C12.3334 12.5868 12.3334 13.1468 12.1154 13.5746C11.9237 13.951 11.6177 14.2569 11.2414 14.4487C10.8136 14.6666 10.2535 14.6666 9.13341 14.6666H6.20008C5.07998 14.6666 4.51992 14.6666 4.0921 14.4487C3.71578 14.2569 3.40982 13.951 3.21807 13.5746C3.00008 13.1468 3.00008 12.5868 3.00008 11.4666V3.99998" stroke="#FEFEFE" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </Button>
                    <Button className='edit' onClick={() => setEditing(!editing)}>
                        <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.6667 11L13 11.7294C12.6464 12.1161 12.1668 12.3333 11.6668 12.3333C11.1668 12.3333 10.6873 12.1161 10.3337 11.7294C9.97956 11.3434 9.50007 11.1267 9.0002 11.1267C8.50033 11.1267 8.02084 11.3434 7.66673 11.7294M1.66675 12.3333H2.78311C3.10923 12.3333 3.27229 12.3333 3.42574 12.2965C3.56179 12.2638 3.69185 12.21 3.81115 12.1369C3.9457 12.0544 4.061 11.9391 4.2916 11.7085L12.6668 3.33334C13.219 2.78106 13.219 1.88563 12.6668 1.33334C12.1145 0.781057 11.219 0.781058 10.6668 1.33334L2.29159 9.7085C2.06099 9.9391 1.94568 10.0544 1.86323 10.189C1.79012 10.3083 1.73625 10.4383 1.70359 10.5744C1.66675 10.7278 1.66675 10.8909 1.66675 11.217V12.3333Z" stroke="#FEFEFE" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </Button>

                    {
                        editing && <>
                            <Button onClick={() => changeStatus(0)} className="New" >N</Button>
                            <Button onClick={() => changeStatus(1) } className='Reading'>R</Button>
                            <Button onClick={() => changeStatus(2) } className='Finished'>F</Button>
                        </>
                    }
                </div>
            </CardContent>
        </Card>
    </>);
}

export default BookCard;