const global={
  path : window.location.pathname,

  search :{

    type:'',
    term:'',
    page:1,
    totalPages:1

  },
  api:{

    key:'2c438f798956350d8d576b07587d52f7',

    url:'https://api.themoviedb.org/3/'
  }
}

console.log(global.path);

async function displaypopular_showDetails(){
  const id=window.location.search.split('=')[0];

  var chr=id.slice(1);

  const shows=await getApiData(`tv/${chr}`);

    console.log(shows);

    display_bakground_img('shows',shows.backdrop_path);

    const div=document.createElement('div');

    div.innerHTML=`
    <div class="details-top">
          <div>
            ${
              shows.poster_path ? `<img

            src="https://image.tmdb.org/t/p/w500${shows.poster_path}"
            class="card-img-top"
            alt="Movie-title"/>`
            :
            `<img
            src="/no-image.jpg "
            class="card-img-top"
            alt="NO-movie"
            />`
            }
          </div>
          <div>
            <h2>${shows.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${shows.vote_average.toFixed(1)}/10
            </p>
            <p class="text-muted">Release Date:${shows.release_date}</p>
            <p>
             ${shows.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${shows.genres.map((genre)=>`<li>${genre.name}</li>`).join('')}
            </ul>
   
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${shows.episode_run_time[0]}</li>
            <li>
              <span class="text-secondary">Number of seasons:</span> ${shows.seasons.length}
            </li>
            <li><span class="text-secondary">Status:</span> ${shows.status}</li>
          </ul>
          <h4>Production countries</h4>
          ${shows.production_countries.map((prod)=>`<span>${prod.name}</span>`).join(" ")}
        </div>    
    `;

    const out=document.querySelector('#show-details');

    out.appendChild(div);
}


async function displaypopular_movieDetails(){

    const id=window.location.search.split('=')[0];

    var chr=id.slice(1);


    const movie=await getApiData(`movie/${chr}`);

    display_bakground_img("movie",movie.backdrop_path);
        
  const div=document.createElement('div');

        div.innerHTML=`<div class="details-top">
          <div>
          ${
            movie.poster_path ? `<img

            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="Movie-title"/>`
            :
            `<img
            src="/no-image.jpg "
            class="card-img-top"
            alt="NO-movie"
            />`
          }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)}/10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
            ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre)=>`<li>${genre.name}</li>`).join('')}
            </ul>
          
          </div>
        </div>
        <div class="details-bottom">
          <h2>${movie.tagline}</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> ${movie.budget}</li>
            <li><span class="text-secondary">Revenue:</span> ${movie.revenue}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime}</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          ${movie.production_companies.map((prod)=>`<span>${prod.name}</span>`).join(" ")}
          </div>
        </div>
        `;

        const parent=document.querySelector('#movie-details');

        parent.appendChild(div);

}


async function displaypopular_shows(){

    const result=await getApiData('tv/popular');

    const movie=result.results;

   movie.forEach(item => {
        
        const div=document.createElement('div');

        div.classList.add('card');

        div.innerHTML=`
        <a href="/tv-details.html?${item.id}=">
            ${
                item.poster_path ? `<img

                src="https://image.tmdb.org/t/p/w500${item.poster_path}"
                class="card-img-top"
                alt="Movie-title"/>`
                :
                `<img
                src="/no-image.jpg "
                class="card-img-top"
                alt="NO-movie"
                />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${item.first_air_date}</small>
            </p>
          </div>
        </div>
        `;

        const parent=document.querySelector('#popular-shows');

        parent.appendChild(div);

    });
}

async function displaypopular_movies(){

    const result=await getApiData('movie/popular');

    const movie=result.results;

   movie.forEach(item => {
        
        const div=document.createElement('div');

        div.classList.add('card');

        div.innerHTML=`
        <a href="/movie-details.html?${item.id}=">
            ${
                item.poster_path ? `<img

                src="https://image.tmdb.org/t/p/w500${item.poster_path}"
                class="card-img-top"
                alt="Movie-title"/>`
                :
                `<img
                src="/no-image.jpg "
                class="card-img-top"
                alt="NO-movie"
                />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${item.release_date}</small>
            </p>
          </div>
        </div>
        `;

        const parent=document.querySelector('#popular-movies');

        parent.appendChild(div);

    });
}

async function search_display(){

  const page=window.location.search;

  const urlParams=new URLSearchParams(page);

  global.search.type=urlParams.get('type');

  global.search.term=urlParams.get('search-term');

  if(global.search.term!=='' && global.search.term!==null){
      
    const res=await searchApiData();

    global.search.page=res.page;

    if(res.total_results===0){
      customAlert('oops! No result found');
    }
    else{

     const div=document.createElement('div');

      div.classList.add('success');

      div.innerHTML=`${res.results.length}/${res.total_results} were found`;

      document.querySelector('#search-results-heading').appendChild(div);

      setTimeout(()=>{ div.remove()},5000)

      display_search_results(res);


    }

  }
  else{
    customAlert('please enter the valid name');
  }
}

function display_search_results(res){

  document.querySelector('#pagination').innerHTML='';
  document.querySelector('#search-results-heading').innerHTML='';
  document.querySelector('#search-results').innerHTML='';
  
  res.results.forEach(item => {
        
    const div=document.createElement('div');

    div.classList.add('card');

        div.innerHTML=`
 
        <a href="/${global.search.type}-details.html?${item.id}=">
        ${
            item.poster_path ? `<img

            src="https://image.tmdb.org/t/p/w500${item.poster_path}"
            class="card-img-top"
            alt="Movie-title"/>`
            :
            `<img
            src="/no-image.jpg "
            class="card-img-top"
            alt="NO-titlr"
            />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${global.search.type==='movie' ? item.title:item.name}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${global.search.type==='movie' ? item.release_date:item.first_air_date}</small>
        </p>
      </div>
    </div>
    `
    document.querySelector('#search-results').appendChild(div);

  });

  display_pagination(res);    

}

function display_pagination(res){

  console.log(res);

  const div=document.createElement('div');

  div.classList.add('pagination');

  div.innerHTML=`<button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">${res.page} of ${res.total_pages}</div>
  `;

  document.querySelector('#pagination').appendChild(div);

  if(global.search.page===1){

    document.querySelector('#prev').disabled=true;
  }
  if(global.search.page===res.total_pages){
    document.querySelector('#next').disabled=true;

  }

  document.querySelector('#next').addEventListener('click',async() =>{
    global.search.page++;
    const res=await searchApiData();

    display_search_results(res);
})

  document.querySelector('#prev').addEventListener('click',async() =>{
      global.search.page--;
      const res=await searchApiData();
    
      display_search_results(res);
  })
 

  
}

function customAlert(msg,className='error'){

  const alert=document.createElement('div');

  alert.classList.add('alert',className);
  
  alert.appendChild(document.createTextNode(msg));

  document.querySelector('#alert').appendChild(alert);

  setTimeout(()=>{
    alert.remove();
  },3000)

}

async function display_swipper(){

  const result=await getApiData('movie/now_playing');

  const movie=result.results;


  movie.forEach((item)=>{
    console.log(item.poster_path);
    const div=document.createElement('div');
    div.classList.add('swiper-slide');

    div.innerHTML=`
        <a href="/movie-details.html?${item.id}=">
          <img src=https://image.tmdb.org/t/p/w500${item.poster_path} />
          </a>
    <h4 class="swiper-rating">
      <i class="fas fa-star text-secondary"></i>${item.vote_average.toFixed(1)}/10
    </h4>
  </div>`;
  document.querySelector('.swiper-wrapper').appendChild(div);
  })

  
  init_swipper();
  /**/
}

function init_swipper(){

  const swipe=new Swiper('.swiper',{
    slidesPerView:1,
    spaceBetween:30,
    freeMode:true,
    loop:false,

    autoplay:{
      delay : 4000,
      disbaleOnInteraction:true
    },
    breakpoints:{

      500:{
        slidesPerView:2
      },
      700:{
        slidesPerView:3
      },
      1200:{
        slidesPerView:4
      }
    }
  });
}

function display_bakground_img(type,endpoint){
  console.log(endpoint);

  const backdrop=document.createElement("div");

  backdrop.style.backgroundImage=`url(https://image.tmdb.org/t/p/original${endpoint})`;

  backdrop.style.backgroundSize='cover';
  backdrop.style.backgroundPosition='center';
  backdrop.style.backgroundRepeat='no-repeat';
  backdrop.style.height='100vh';
  backdrop.style.width='100vw';
  //backdrop.style.position='absolute';
  //backdrop.style.top=0;
  //backdrop.style.left=0;
  backdrop.style.zIndex=-1;
  backdrop.style.opacity=0.5;

  if(type==="movie"){
    document.querySelector('#movie-details').appendChild(backdrop);
  }
  else{
    document.querySelector('#show-details').appendChild(backdrop);
  }
}

function showspinner(){

    const out=document.querySelector(".spinner");

    out.classList.add('show');

}
function hidespinner(){

    const out=document.querySelector(".spinner");

    out.classList.remove('show');
    
}

async function searchApiData(){
  const api_key=global.api.key;

  const api_url=global.api.url;

  showspinner();

  const ser_res=await fetch(`${api_url}search/${global.search.type}?api_key=${api_key}&language=en-US&query=${global.search.term}&page=${global.search.page}`);

  const result=await ser_res.json();

  hidespinner();

  return result;

}

async function getApiData(endpoint){

    const api_key=global.api.key;

    const api_url=global.api.url;

    showspinner();

    const data=await fetch(`${api_url}${endpoint}?api_key=${api_key}&language=en-US`);

    const result=await data.json();

    hidespinner();

    return result;
}


function init(){

    switch(global.path){

        case "/index.html":
            console.log('Home');
            displaypopular_movies();
            display_swipper();
            break;
        case "/shows.html":
            console.log('Shows');
            displaypopular_shows();
            break;

        case "/search.html":
            console.log('Search page');
            search_display();
            break;

        case "/movie-details.html":
            displaypopular_movieDetails();
            break;

        case "/tv-details.html":
            displaypopular_showDetails();
            break;
    }
    

}

document.addEventListener('DOMContentLoaded',init);