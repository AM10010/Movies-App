const MovieCard =({movie: 
    {title , vote_average, poster_path, original_language, release_date}
})=>{
    return (
        <div className="movie-card">
            <img src={poster_path? `https://image.tmdb.org/t/p/w500/${poster_path}`: 'no-movie-png'} alt="" />
            <div className="mt-4">
                <h3>{title}</h3>
            </div>
            <div className="content">
                <div className="rating">
                    <img src="star.svg" alt="star" />
                    <p>{vote_average? vote_average.toFixed(1):'N/A'}</p>
                </div>
                <span>.</span>
                <div className="lang">
                    <p>{original_language.toUpperCase()}</p>
                </div>
                <span>.</span>
                <div className="year">
                    <p>{release_date? release_date.split("-")[0]: 'N/A'}</p>
                </div>
            </div>
        </div>
    );
}
export default MovieCard;