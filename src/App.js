import React from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';
import { useState, useEffect, useCallback } from 'react';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch movies
   */

  const fetchMoviesHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'https://reactjs-http-eb2df-default-rtdb.firebaseio.com/movies.json'
      );

      // handle the error part before parsing the data
      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const data = await response.json();
      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          releaseDate: data[key].release_date,
          openingText: data[key].opening_crawl,
        });
      }

      setMovies(loadedMovies);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }, []);

  // IF WE ADD fetchMoviesHandler AS A DEPENDENCY,
  // THEN WE NEED USECALLBACK HOOK TO CREATE A POINTER IN THE MEMORY
  // OTHERWISE, WE WILL HAVE INFINITY LOOP

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  /**
   * Add Movie
   */

  async function addMovieHandler(movie) {
    const response = await fetch(
      'https://reactjs-http-eb2df-default-rtdb.firebaseio.com/movies.json',
      {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!loading && movies.length > 0 && <MoviesList movies={movies} />}{' '}
        {!loading && movies.length === 0 && !error && <p>Found no movies.</p>}
        {!loading && error && <p>{error}</p>}
        {loading && <p>Loading ...</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
