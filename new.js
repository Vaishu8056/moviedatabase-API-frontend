/*used fetch the popular movies from database */const APILINK='https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=f3f0d01b56936e79e2fa72229b54396d&page=1'
/*used to fetch image poster*/const IMG_PATH='https://image.tmdb.org/t/p/w1280'
/* search movies based on the query*/const SEARCHAPI="https://api.themoviedb.org/3/search/movie?&api_key=f3f0d01b56936e79e2fa72229b54396d&query="
/*in the searchapi the query will be placed
and the query will be collected by apilink and then it give some response*/ 
const main=document.getElementById("section")
const form=document.getElementById("form")
const search=document.getElementById("query")
returnMovies(APILINK)
function returnMovies(url){
    fetch(url).then(res=>res.json())/* json response*/
    .then(function(data){
     console.log(data.results);
    data.results.forEach(element=>{
        const div_card=document.createElement('div');
        div_card.setAttribute('class','card')
        const div_row=document.createElement('div');
        div_row.setAttribute('class','row')
        const div_column=document.createElement('div');
        div_column.setAttribute('class','column')
        const image=document.createElement('img');
        image.setAttribute('class','thumbnail')
        image.setAttribute('id','img')
        const title=document.createElement('h3');
        title.setAttribute('id','title')
        const center=document.createElement('center');
        title.innerHTML=`${element.title}`;/*returns movie name as title */
        image.src=IMG_PATH+element.poster_path;/*return link to the img */
        center.appendChild(image);
        div_card.appendChild(center);
        div_card.appendChild(title);
        div_column.appendChild(div_card);
        div_row.appendChild(div_column);
        main.appendChild(div_row);
    });
    });
}
form.addEventListener("submit", (e)=>{
    e.preventDefault();
    main.innerHTML=''/*removes the old searches */
    const searchItem=search.value;
    if(searchItem){
        returnMovies(SEARCHAPI+searchItem);
        search.value="";/*clears the searches */
    }
})/*creation of api
it is used to create,post,get,delete*/































