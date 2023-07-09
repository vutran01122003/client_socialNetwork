import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { activePageSelector } from '../redux/selector';
import { activePageAction } from '../redux/actions/activePageAction';

export default function NotFound() {
    const dispatch = useDispatch();

    const handleActivePage = () => {
        dispatch(activePageAction('Home'));
    };
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Container maxWidth='md' sx={{ marginTop: '200px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant='h1'>404</Typography>
                        <Typography
                            variant='h6'
                            style={{ marginBottom: '10px' }}
                        >
                            The page you’re looking for doesn’t exist.
                        </Typography>
                        <Button variant='contained'>
                            <Link
                                to='/'
                                color='inherit'
                                style={{ textDecoration: 'none' }}
                                onClick={handleActivePage}
                            >
                                Back home
                            </Link>
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <img
                            src='https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg'
                            alt=''
                            width={500}
                            height={250}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
