import $ from 'jquery';
import Promise from 'bluebird';
import reqwest from 'reqwest';
import Hammer from 'hammerjs';

const darkskyKey = '83d3e85b9c73240c30a19c7421f3e752';
const darkskyApiServer = 'https://api.darksky.net';
const darkskyApiRoute = 'forecast';
let forecast = [];
let dayPointer = 0;
let hemisphere;
 
// try to get user's location automatically, otherwise have them type it in
if ('geolocation' in navigator) {
  $('body').addClass('loading');
  navigator.geolocation.getCurrentPosition(function(position) {
    fetchAndRender(position.coords.latitude, position.coords.longitude);
  }, initAutocomplete);
}
else {
  initAutocomplete();
}

function initAutocomplete() {
  $('body').addClass('show-location-finder');
  let input = document.getElementById('js-location-finder-input');
  let options = {
    types: ['(cities)']
  };
  let autocomplete = new google.maps.places.Autocomplete(input, options);
  autocomplete.addListener('place_changed', function() {
    let place = autocomplete.getPlace();
    $('body').addClass('loading');
    $('body').removeClass('show-location-finder');
    fetchAndRender(place.geometry.location.lat(), place.geometry.location.lng());
  });
}

function fetchAndRender(latitude, longitude) {
  const latlong = [latitude, longitude].join();
  fetchForecast(latlong).then(function(data) {
    forecast = data.daily.data;
    hemisphere = latitude > 0 ? 'north' : 'south';
    render(dayPointer);
    initHammerTime();
    initKeyDetection();
    initArrowButtons();
    $('body').removeClass('loading');
  });
}

function render(pointer) {

  let phasePerc = Math.round(forecast[pointer].moonPhase * 100);
  setMoonClass();
  setDateEl();
  setPhaseName();
  setButtonDisability();
  toggleCloudCoverWarning();

  function setMoonClass() {
    let moonEl = document.getElementById('js-moon');
    moonEl.setAttribute('class', `phase-${phasePerc} ${hemisphere}ern-hemisphere`);
  }
  
  function setDateEl() {
    let date = new Date();
    let dateEl = document.getElementById('js-date');
    date.setDate(date.getDate() + pointer);
    dateEl.innerHTML = date.toDateString();
  }
  
  function setPhaseName() {
    let phaseNameEl = document.getElementById('js-phase-name');
    phaseNameEl.innerHTML = getPhaseName(phasePerc);
  }
  
  function setButtonDisability() {
    if(pointer === 0) {
      document.getElementById('js-prev-day').setAttribute('disabled', true);
    }
    else {
      document.getElementById('js-prev-day').removeAttribute('disabled');
    }
    if(pointer + 1 === forecast.length) {
      document.getElementById('js-next-day').setAttribute('disabled', true);
    }
    else {
      document.getElementById('js-next-day').removeAttribute('disabled');
    }
  }
  
  function toggleCloudCoverWarning() {
    $('#js-cloud-warning').toggle(forecast[pointer].cloudCover > 0.75);
  }

  function getPhaseName(phase) {
    switch(true) {
      case (phase < 12.5):
        return 'New moon';
      case (phase < 25):
        return 'Waxing crescent';
      case (phase < 37.5):
        return 'First quarter';
      case (phase < 49):
        return 'Waxing gibbous';
      case (phase < 52):
        return 'Full moon';
      case (phase < 75):
        return 'Waning gibbous';
      case (phase < 87.5):
        return 'Last quarter';
      case (phase < 100):
        return 'Waning crescent';
    }
  }
}

function fetchForecast(latlong) {

  const params = {
    exclude: 'currently,minutely,hourly,alerts,flags'    
  };
  const query = objectToQuerystring(params);
  const url = [darkskyApiServer, darkskyApiRoute, darkskyKey, latlong].join('/');
    
  return reqwest({
    url: url + query,
    type: 'jsonp'
  });
}

function objectToQuerystring (obj) {
  return Object.keys(obj).reduce(function (str, key, i) {
    var delimiter, val;
    delimiter = (i === 0) ? '?' : '&';
    key = key;
    val = obj[key];
    return [str, delimiter, key, '=', val].join('');
  }, '');
}

function nextDay() {
  dayPointer = dayPointer < forecast.length - 1 ? dayPointer + 1 : dayPointer;
  render(dayPointer);
}

function prevDay() {
  dayPointer = dayPointer > 0 ? dayPointer - 1 : 0;
  render(dayPointer);
}

function initArrowButtons() {
  document.getElementById('js-next-day').addEventListener('click', function() {
    nextDay();
  });

  document.getElementById('js-prev-day').addEventListener('click', function() {
    prevDay();
  });
}

function initHammerTime() {
  let moonEl = document.getElementById('js-moon');
  let hammertime = new Hammer(moonEl);
  hammertime.on('swiperight', prevDay);
  hammertime.on('swipeleft', nextDay);
}

function initKeyDetection() {
    document.addEventListener('keydown', function(event) {
    if(event.target === document.getElementById('js-location-finder-input')) {
      return;
    }
    if(event.keyCode === 39) {
      nextDay();
    }
    else if(event.keyCode === 37) {
      prevDay();
    }
  });
}
