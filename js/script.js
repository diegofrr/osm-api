

// Configuração do Typeahead.js
var searchInput = document.getElementById('search-input');
var suggestionsContainer = document.getElementById('suggestions-container');
var searchUrl = 'https://nominatim.openstreetmap.org/search?format=&addressdetails=1&json&q=';

var xhr;
var lastValue = '';
var debounceTimeout;

function handleInput() {
    var value = searchInput.value.trim();

    if (value === lastValue) {
        return;
    }

    lastValue = value;

    if (xhr) {
        xhr.abort();
    }

    clearTimeout(debounceTimeout);

    if (value.length > 1) {
        debounceTimeout = setTimeout(fetchSuggestions, 300);
    } else {
        clearSuggestions();
    }
}

function fetchSuggestions() {
    var query = encodeURIComponent(searchInput.value.trim());

    if (query.length === 0) {
        clearSuggestions();
        return;
    }

    xhr = new XMLHttpRequest();
    xhr.open('GET', searchUrl + query, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var suggestions = response.map(function (result) {
                return {
                    value: result.display_name,
                    lat: parseFloat(result.lat),
                    lon: parseFloat(result.lon),
                    address: result.address,
                    result
                };
            });
            displaySuggestions(suggestions);
        }
    };
    xhr.send();
}

function displaySuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';
    const list = [];

    if (suggestions.length > 0) {
        document.querySelector('.suggestions-title').style.display = 'block'

        suggestions.forEach(function (suggestion) {
            var suggestionItem = document.createElement('div');

            const item = [
                suggestion.address.village,
                suggestion.address.landuse,
                suggestion.address.leisure,
                suggestion.address.shop,
                suggestion.address.amenity,
                suggestion.address.road,
                suggestion.address.suburb,
                suggestion.address.town,
                suggestion.address.city,
                suggestion.address.state,
                suggestion.address.postcode
            ].filter(i => i).join(', ');

            if (!list.includes(item)) list.push(item)
            else return;

            suggestionItem.textContent = item;
            suggestionItem.classList.add('suggestion-item');
            suggestionItem.addEventListener('click', function () {
                var coordinates = [suggestion.lat, suggestion.lon];
                console.log(suggestion.result)
            });
            suggestionsContainer.appendChild(suggestionItem);
        });
    } else {
        clearSuggestions();
    }
}

function clearSuggestions() {
    suggestionsContainer.innerHTML = '';
    document.querySelector('.suggestions-title').style.display = 'none'
}

searchInput.addEventListener('input', handleInput);
