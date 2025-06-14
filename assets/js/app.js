import $ from 'jquery';
import Hammer from 'hammerjs';

let dayPointer = 0;

const SYNODIC_MONTH = 29.53058770576;

function getHemisphere() {
  const now = new Date();
  const y = now.getFullYear();

  const jan = new Date(y, 0, 1, 0, 0, 0, 0).getTimezoneOffset();
  const jul = new Date(y, 6, 1, 0, 0, 0, 0).getTimezoneOffset();
  const diff = jan - jul;

  if (diff > 0) {
    return 'north';
  }

  if (diff < 0) {
    return'south';
  }

  return null;
}

render(dayPointer);
initHammerTime();
initKeyDetection();
initArrowButtons();

function render(pointer) {
  let phasePerc = 44;
  setMoonClass();
  setDateEl();
  setPhaseName();
  setButtonDisability();

  function setMoonClass() {
    let moonEl = document.getElementById('js-moon');
    moonEl.setAttribute('class', `phase-${phasePerc} ${getHemisphere()}ern-hemisphere`);
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


function nextDay() {
  dayPointer = dayPointer + 1;
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
