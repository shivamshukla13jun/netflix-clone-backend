const { default: axios } = require("axios");
const API_KEY = "efdd474fc85772c8ecc497550ca8a0ac";
const imagePath = "https://image.tmdb.org/t/p/original";
const TrendingPage = `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US`;
const Movie=require('./models/Movie')
const GeTrandingData = async () => {
  const response = await axios.get(TrendingPage);
      const data = response.data.results;
      const dataarr = [];
      for (var i = 0, len = data.length; i < len; i++) {
        data.map((value) => {
          let type =value.genre_ids.toString();
          let media_type = value.media_type
          let series=media_type.replaceAll("tv","series")  
          const genre = type
          .replaceAll(28, "Action")
          .replaceAll(12, "Adventure")
          .replaceAll(16, "Animation")
          .replaceAll(35, "Comedy")
          .replaceAll(80, "Crime")
          .replaceAll(99, "Documentary")
          .replaceAll(18, "Drama")
          .replaceAll(10751, "Family")
          .replaceAll(14, "Fantasy")
          .replaceAll(36, "History")
          .replaceAll(27, "Horror")
          .replaceAll(10402, "Music")
          .replaceAll(9648, "Mystery")
          .replaceAll(10749, "Romance")
          .replaceAll(878, "Science Fiction")
          .replaceAll(10770, "TV Movie")
          .replaceAll(53, "Thriller")
          .replaceAll(10752, "War")
          .replaceAll(37, "Western");
          // console.log(genre)
          let obj = {
            title: value.original_title || value.title ,
            img: imagePath + value.backdrop_path,
            imgSm: imagePath + value.poster_path,
            desc: value.overview,
            year: value.first_air_date || value.realease_date,
            popularity: value.popularity,
            vote_average: value.vote_average,
            vote_count: value.vote_count,
            genre: genre.split(","),
            type: series,
            originallanguage:value.original_language,
          };
          dataarr.push(obj);
        });
      }
      const rawData = await dataarr;
  // console.log(dataarr) // 
};
GeTrandingData();
