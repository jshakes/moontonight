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
    });
  });
}

function setMoonClass(phase, hemisphere) {
  let moonEl = document.getElementById('moon');
  moonEl.setAttribute('class', `phase-${phase} ${hemisphere}ern-hemisphere`);
}

function getMoonPhase(latlong) {
  
  const url = [darkskyApiServer, darkskyApiRoute, darkskyKey, latlong].join('/');
  
  return reqwest({
    url: url,
    type: 'jsonp'
  });
}
