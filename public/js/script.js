let allMovies = [];
let favMovies = [];

function addnewmovie(isFav) {
  return function (movie) { 
  let movieWrapper = `	
    <li  id="${movie.id}">
      <div class="container">
       <div class ="imgfit">
         <div class = "card">
           <div ><img class="img1" src="${movie.posterPath}"></div>
           <div ><h3>${movie.title}<h3></div>
           <div><h6>${movie.overview}</h6></div>`;  
               if (isFav) {
                     movieWrapper = movieWrapper + `</div></div></div></li>`;
               } else {   
                     movieWrapper = movieWrapper + `<button class="btn btn-primary" 
                     onclick="addFavourite(${movie.id})">
                     Add to favourites</button></div>
                     </div></div></li>`;                               
             
  }  
   return movieWrapper;
 };
 }

function getMovies() {
  let promise = new Promise((resolve, reject) => { 
    fetch('http://localhost:3000/movies')
      .then(res => res.json())
      .then((data) => { 
        allMovies = data;
        let movieList1 = data.map(addnewmovie());       
        document.getElementById('moviesList').innerHTML = movieList1.join('');
        resolve(data);
      })
    .catch((err) => {  
       reject(err);
    });
  });
 return promise;
}


function getFavourites() { 
  let promise = new Promise((resolve, reject) => {
   fetch('http://localhost:3000/favourites')
     .then(res => res.json())
     .then(data => {
       favMovies = data;
       document.getElementById('favouritesList').innerHTML = ''; 
       let favlist1 = data.map(addnewmovie(true));
       document.getElementById('favouritesList').innerHTML = favlist1.join('');
       resolve(data);
     })
   .catch((err) => { 
      reject(err);
    });
  });
 return promise;
}


function addFavourite(id) {   
  let movie = allMovies.filter(item => item.id === id); 
  let favMovie = favMovies.filter(item => item.id === id);
 
  if (favMovie.length > 0) {  
  //  alert("i guess you like this movie alot, its already your favourite") 
     //alert gives lint error
    throw new Error('Movie is already added to favourites'); }
  if (movie.length === 0) { throw new Error('Dummy error from server');}

  let promise = new Promise((resolve, reject) => {
  fetch('http://localhost:3000/favourites', {
    method: 'POST',
    body: JSON.stringify(movie[0]),
    headers: { 'content-type': 'application/json' }
  
  })
  .then(res => res.json())  
  .then((data) => {
    favMovies.push(data);
    let favMovieWrapperList = favMovies.map(addnewmovie(true));
    document.getElementById('favouritesList').innerHTML = favMovieWrapperList.join('');
    resolve(favMovies);
  })
  .catch((err) => {    
    reject(new Error(err));
  })
});
 return promise;
}


module.exports = {
    getMovies,
    getFavourites,
    addFavourite
};



// You will get error - Uncaught ReferenceError: module is not defined
// while running this script on browser which you shall ignore
// as this is required for testing purposes and shall not hinder
// it's normal execution