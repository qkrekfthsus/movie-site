import React, { useEffect, useState, useRef } from 'react'
import { Card, Avatar, Col, Typography, Row } from 'antd';
import { API_URL, API_KEY, IMAGE_BASE_URL } from '../../Config';
import MainImage from '../commons/MainImage';
import GridCards from '../commons/GridCards';

function LandingPage() {

    const buttonRef = useRef(null);

    const [Movies, setMovies] = useState([]);
    const [MainMovieImage, setMainMovieImage] = useState(null);
    const [CurrentPage, setCurrentPage] = useState(0);
    const [Loading, setLoading] = useState(true)

    useEffect(() => {
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`;

        fetchMovies(endpoint);

    }, [])
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
    }, [])

    const fetchMovies = (endpoint) => {
        fetch(endpoint)
            .then(response => response.json())
            .then(response => {
                setMovies([...Movies, ...response.results]);
                setMainMovieImage(MainMovieImage || response.results[0]);
                setCurrentPage(response.page);
            }, setLoading(false))
            .catch(error => console.error('Error', error));
    }

    const loadMoreItems = () => {
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=ko-KR&page=${CurrentPage + 1}`;

        fetchMovies(endpoint)
    }

    const handleScroll = () => {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;

        if (windowBottom >= docHeight - 1) {
            // loadMoreItems()
            console.log('clicked')
            buttonRef.current.click();
        }

    }
    return (
        <div style={{ width: '100%', margin: '0' }}>
            {/* Main Image */}
            {MainMovieImage &&
                <MainImage image={`${IMAGE_BASE_URL}w1280${MainMovieImage.backdrop_path}`}
                    title={MainMovieImage.original_title}
                    text={MainMovieImage.overview}
                />
            }

            <div style={{ width: '85%', margin: '1rem auto' }}>
                <h2>Moives by latest</h2>
                <hr />
                {/* Movie Grid Cards */}

                <Row gutter={[16, 16]}>
                    {Movies && Movies.map((movie, index) => {
                        console.log(movie.poster_path ?
                            `${IMAGE_BASE_URL}w500${movie.poster_path}` : null
                        );
                        return <React.Fragment key={index}>
                            <GridCards
                                landingPage
                                image={movie.poster_path ?
                                    `${IMAGE_BASE_URL}w500${movie.poster_path}` : null
                                }
                                movieId={movie.id}
                                movieName={movie.original_title}
                            />
                        </React.Fragment>
                    })}
                </Row>
                {Loading && <div>Loading...</div>}
                <br />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button className="loadMore" ref={buttonRef} onClick={loadMoreItems}> Load More</button>
                </div>

            </div>

        </div>
    )
}

export default LandingPage
