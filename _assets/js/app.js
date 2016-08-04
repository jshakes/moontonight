import Promise from 'bluebird';
import reqwest from 'reqwest';

const darkskyKey = '83d3e85b9c73240c30a19c7421f3e752';
const darkskyApiServer = 'https://api.forecast.io';
const darkskyApiRoute = 'forecast';
 
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(function(position) {
    const latlong = [position.coords.latitude, position.coords.longitude].join();
    getMoonPhase(latlong).then(function(data) {
      const phase = data.daily.data[0].moonPhase * 100;
      const hemisphere = position.coords.latitude > 0 ? 'north' : 'south';
      setMoonClass(phase, hemisphere);
      document.getElementById('phase-name').innerHTML = getPhaseName(phase);
    });
  });
}

function setMoonClass(phase, hemisphere) {
  let moonEl = document.getElementById('moon');
  moonEl.setAttribute('class', `phase-${phase} ${hemisphere}ern-hemisphere`);
}

function getPhaseName(phase) {
  switch(true) {
    case (phase < 12.5):
      return 'New moon';
    case (phase < 25):
      return 'Waxing crescent';
    case (phase < 37.5):
      return 'First quarter';
    case (phase < 50):
      return 'Waxing gibbous';
    case (phase < 62.5):
      return 'Full moon';
    case (phase < 75):
      return 'Waning gibbous';
    case (phase < 87.5):
      return 'Last quarter';
    case (phase < 100):
      return 'Waning crescent';
  }
}

function getMoonPhase(latlong) {
  
  const url = [darkskyApiServer, darkskyApiRoute, darkskyKey, latlong].join('/');
  
  return reqwest({
    url: url,
    type: 'jsonp'
  });
}
