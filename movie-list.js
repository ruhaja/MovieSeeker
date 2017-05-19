function _(id) {
	return document.getElementById(id);
}

function fetchOMDbData(url, callback) {
	_('loading-bar').style.opacity = '1';
	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function() {
		if (httpRequest.readyState === 4 && httpRequest.status === 200) {
			_('loading-bar').style.opacity = '0';
			response = JSON.parse(httpRequest.responseText);
			callback(response);
		}
	};
	httpRequest.open('GET', url);
	httpRequest.send();
}

_('search').addEventListener('submit', function(e) {
	e.preventDefault();

	var searchType = _('search-type');
	var selectedSearchType = searchType.options[searchType.selectedIndex].value;

	var searchWord = _('movie-input').value.trim();
	var omdbBaseUrlList = 'http://www.omdbapi.com/?s=';
	var urlForList = omdbBaseUrlList + searchWord + '&type=' + selectedSearchType;

    if (searchWord) {
        fetchOMDbData(urlForList, logMovies);
    }

    function logMovies(movieList) {
		_('movie-listing').innerHTML = '';

		if (!movieList.Search) {
			_('listing-header').innerHTML = 'No movies found with "' + searchWord + '"';
			return;
		}
		_('listing-header').innerHTML = 'Your search with "' + searchWord + '"';

		movieList.Search.forEach(function(movie) {
			var title = document.createTextNode(movie.Title);
			var movieListElement = document.createElement('a');
			movieListElement.href = '#';
			movieListElement.appendChild(title);

			movieListElement.setAttribute('class', 'list-group-item');

			var year = document.createTextNode(movie.Year);
			var badge = document.createElement('span');
			badge.appendChild(year);
			badge.setAttribute('class', 'badge');

			_('movie-listing').appendChild(movieListElement);
			movieListElement.appendChild(badge);

			movieListElement.addEventListener('click', function(e) {
				e.preventDefault();

				showMovieDetails(movie.imdbID);
				highlightCurrent();
			}, false);

			function highlightCurrent() {
				var movieListElements = document.getElementsByClassName('list-group-item');
				for (var i = 0; i < movieListElements.length; i++) {
					movieListElements[i].setAttribute('class', 'list-group-item');
				}

				movieListElement.setAttribute('class', 'list-group-item active');
			}

			function showMovieDetails(movieID) {
				var omdbBaseUrlSingle = 'http://www.omdbapi.com/?plot=full&i=';
				var urlForSingle = omdbBaseUrlSingle + movieID;

				fetchOMDbData(urlForSingle, showMovieData);

				function showMovieData(movie) {
					_('oscars-of-movie').innerHTML = '';
					_('title-of-movie').innerHTML = movie.Title;
					_('year-of-movie').innerHTML = movie.Year;
					_('rate-of-movie').innerHTML = movie.Rated;
					if (movie.Rated == 'N/A' || movie.Rated == 'NOT RATED') {
						_('rate-of-movie').innerHTML = '';
					}
					_('director-of-movie').innerHTML = 'Director: ' + movie.Director;
					_('actors-of-movie').innerHTML = 'Leading Roles: ' + movie.Actors;
					_('plot-of-movie').innerHTML = movie.Plot;
					_('imdb-rate-of-movie').innerHTML = movie.imdbRating;

					if (movie.imdbRating >= 7.0) {
						_('imdb-rate-of-movie').setAttribute('class', 'label label-success');
					}
					else if (movie.imdbRating >= 5.5) {
						_('imdb-rate-of-movie').setAttribute('class', 'label label-warning');
					}
					else {
						_('imdb-rate-of-movie').setAttribute('class', 'label label-danger');
					}

					_('votes-of-movie').innerHTML = 'Votes: ' + movie.imdbVotes;

					if (movie.Awards.indexOf('Oscar') >= 0) {
						if (movie.Awards.indexOf('Nominated') >= 0) {
							var awardArray =  movie.Awards.split(' ', 4);
							var awardText = awardArray.join(' ');
							_('oscars-of-movie').innerHTML = awardText;
						}
						else {
							var awardArray =  movie.Awards.split(' ', 3);
							var awardText = awardArray.join(' ');
							_('oscars-of-movie').innerHTML = awardText;
						}
					}

					_('movie-image').innerHTML = '';
					var img = document.createElement('img');
					img.src = movie.Poster;
					_('movie-image').appendChild(img);
				}
			}
		});
    }
});


















/*
_('tvshow').addEventListener('submit', function(e) {
	e.preventDefault();

	var searchWord = _('tvshow-input').value.trim();
	var omdbBaseUrlList = 'http://www.omdbapi.com/?s=';
	var urlForList = omdbBaseUrlList + searchWord + '&type=series';

    if (searchWord) {
		fetchOMDbData(urlForList, LogTVShows);
    }

    function LogTVShows(tvshowList) {
		//console.log(tvshowList);
		console.log("LogTVShows");
		_('tvshow-listing').innerHTML = '';

		if (!tvshowList.Search) {
			return;
		}
		_('listing-header').innerHTML = 'Your search revealed following results..';

		tvshowList.Search.forEach(function(tvshow) {
			var tvshowElement = document.createElement('li');
			var title = document.createTextNode(tvshow.Title);
			tvshowElement.appendChild(title);
			tvshowElement.addEventListener('click', function() {
				showTVShowDetails(tvshow.imdbID);
			}, false);
			_('tvshow-listing').appendChild(tvshowElement);

			function showTVShowDetails(tvshowID) {
			console.log("showTVShowDetails");
				var omdbBaseUrlSingle = 'http://www.omdbapi.com/?plot=full&i=';
				var urlForSingle = omdbBaseUrlSingle + tvshowID;

				fetchOMDbData(urlForSingle, showTVShowData);

				function showTVShowData(tvshow) {
				console.log("showTVShowData");
					_('title-of-tvshow').innerHTML = tvshow.Title;
					_('genre-of-tvshow').innerHTML = tvshow.Genre;
					_('year-of-tvshow').innerHTML = tvshow.Year;
					_('plot-of-tvshow').innerHTML = tvshow.Plot;
					//eka kausi
				var omdbBaseUrlSingle2 = 'http://www.omdbapi.com/?i=';
				var urlForSingle2 = omdbBaseUrlSingle2 + tvshowID + '&Season=1';
					fetchOMDbData(urlForSingle2, showTVShowFirstSeason);
				}

				function showTVShowFirstSeason(tvshow) {
				console.log("showTVShowFirstSeason");
					console.log(tvshow);
					var tvshow = JSON.parse(httpRequest.responseText);
					var table = document.getElementById("S1episodes");
					console.log("TAULUN POISTOA");
					while(table.rows.length > 0) {
						table.deleteRow(0);
					}
					var riviapu = 0;
					tvshow.Episodes.forEach(taulunTaytto);
					
					function taulunTaytto(element, index, array) {
						console.log("tvshow: " + tvshow);
					
					var row = table.insertRow(riviapu);
					var cell1 = row.insertCell(0);
					var cell2 = row.insertCell(1);
					var cell3 = row.insertCell(2);
				
					var number = JSON.parse(JSON.stringify(tvshow.Episodes[riviapu].Episode));
					var name = JSON.parse(JSON.stringify(tvshow.Episodes[riviapu].Title));
					var rating = JSON.parse(JSON.stringify(tvshow.Episodes[riviapu].imdbRating));
				
					name = name.replace(/\,/g,"");
					cell1.innerHTML = number;
					cell2.innerHTML = name;
					cell3.innerHTML = rating
				
					riviapu++;
				}
				}

			}
		});
    }

});
	*/