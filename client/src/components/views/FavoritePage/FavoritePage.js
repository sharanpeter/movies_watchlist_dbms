import React, { useEffect, useState } from 'react'
import { Typography, Popover, Button,Row } from 'antd';
import { API_URL, API_KEY} from '../../Config'
import axios from 'axios';
import './favorite.css';
import { useSelector } from 'react-redux';

import { IMAGE_BASE_URL, POSTER_SIZE } from '../../Config'
import GridCard from '../../commons/GridCards'
import { Link } from 'react-router-dom';
let responseFav=0
const { Title } = Typography;

function FavoritePage(props) {
    const movieId = props.match.params.movieId
    const genreId=[]
    const user = useSelector(state => state.user)
    const [Movie, setMovie] = useState([])
    const [Movies, setMovies] = useState([])
    const [Casts, setCasts] = useState([])
 
    const [Favorites, setFavorites] = useState([])
    const [movieRemoved, setMovieremoved] = useState(false)
    const [LoadingForMovie, setLoadingForMovie] = useState(true)
    const [LoadingForCasts, setLoadingForCasts] = useState(true)
    const [Loading, setLoading] = useState(true)
    let variable = { userFrom: localStorage.getItem('userId') }

    useEffect(() => {
        fetchFavoredMovie()
      
    }, [])
    useEffect(() => {
        fetchFavoredMovie()
      
    }, [movieRemoved])

    const fetchFavoredMovie = () => {
        axios.post('/api/favorite/getFavoredMovie', variable)
            .then(response => {

                responseFav=response.data.favorites.length
                
                if(response.data.favorites.length>0){
                response.data.favorites.forEach(fav=>{
                    genreId.push(fav.genreId[0].id)
                })

       
                    console.log("hi"+genreId)
                    let genreMovies = `${API_URL}discover/movie?api_key=${API_KEY}&language=en-US&sort_by=vote_count.desc&with_genres=${genreId[0]},${genreId[1]},${genreId[2]},${genreId[3]},${genreId[4]},${genreId[5]},${genreId[6]},${genreId[7]},${genreId[8]},${genreId[9]},${genreId[10]},${genreId[11]},${genreId[12]}`
                fetchMovies(genreMovies)
                
                
            }
                
                if (response.data.success) {
                    console.log(response.data.favorites)
                    setFavorites(response.data.favorites)
                    setLoading(false)
                } else {
                    alert('Failed to get favoured movies')
                }
            })
    }

    const fetchMovies = (endpoint) => {

        fetch(endpoint)
            .then(result => result.json())
            .then(result => {
               
                setMovies([...result.results])
                
            }, setLoading(false))
            .catch(error => console.error('Error:', error)
            )
    }
    const onClickDelete = (movieId, userFrom) => {

        const variables = {
            movieId: movieId,
            userFrom: userFrom,
        }

        axios.post('/api/favorite/removeFromFavorite', variables)
            .then(response => {
                if (response.data.success) {
                    fetchFavoredMovie()
                    setMovieremoved(true)
                } else {
                    alert('Failed to Remove From Favorite')
                }
            })
    }


    const renderCards = Favorites.map((favorite, index) => {


        const content = (
            <div>
                {favorite.moviePost ?
                    <img src={`${IMAGE_BASE_URL}${POSTER_SIZE}${favorite.moviePost}`} />
                    : "no image"}
            </div>
        );

        return <tr key={index}>

            <Popover content={content} title={`${favorite.movieTitle}`}>
                <td>{favorite.movieTitle}</td>
            </Popover>

            <td>{favorite.movieRunTime} mins</td>
            <td><button onClick={() => onClickDelete(favorite.movieId, favorite.userFrom)}> Remove </button></td>
        </tr>
    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2} > My Favorites Watchlist </Title>
            <hr />
            {user.userData && !user.userData.isAuth ?
                <div style={{ width: '100%', fontSize: '2rem', height: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <p>Please Log in first...</p>
                    <a href="/login">Go to Login page</a>
                </div>
                :
                !Loading &&
                <table>
                    <thead>
                        <tr>
                            <th>Movie Title</th>
                            <th>Movie RunTime</th>
                            <td>Remove from favorites</td>
                        </tr>
                    </thead>
                    <tbody>
                        {renderCards}
                    </tbody>
                </table>
            }


           

        
       { user.userData && !user.userData.isAuth ?
                <></>
                :
            responseFav>0 ?
         <div style={{ width: '85%', margin: '1rem auto' }}>

            <Title level={2} > Recommended movies based on your watchlist</Title>
            <hr />
            <Row gutter={[16, 16]}>
                {Movies && Movies.map((movie, index) => (
                    <React.Fragment key={index}>
                        <GridCard
                            image={movie.poster_path ?
                                `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
                                : null}
                            movieId={movie.id}
                            movieName={movie.original_title}
                        />
                    </React.Fragment>
                ))}
            </Row>

            {Loading &&
                <div>Loading...</div>}

            <br />
           
        </div> 

        :
        <div className='empty'>
        <h2>Your Watchlist is Empty</h2>
         <Button><Link to={"/"}>Add movies</Link></Button>
         </div>
       }
    
        </div>

       

    )
       
}


export default FavoritePage
