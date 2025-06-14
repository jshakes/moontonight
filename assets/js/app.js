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

function getMoonPhasePercentage(date) {
  // Known new moon: January 6, 2000, 18:14 UTC
  const knownNewMoon = new Date(2000, 0, 6, 18, 14, 0);
  
  // Calculate days since known new moon
  const daysSinceNewMoon = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  
  // Calculate current position in lunar cycle
  const cyclePosition = daysSinceNewMoon % SYNODIC_MONTH;
  
  // Convert to percentage (0-100)
  const phasePercentage = (cyclePosition / SYNODIC_MONTH) * 100;
  
  return Math.round(phasePercentage);
}

render(dayPointer);
initTouchEvents();
initKeyDetection();
initArrowButtons();

function render(pointer) {
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + pointer);
  let phasePerc = getMoonPhasePercentage(currentDate);
  
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
    dateEl.setAttribute('datetime', date.toISOString().split('T')[0]);
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

function initTouchEvents() {
  let moonEl = document.getElementById('js-moon');
  let startX = 0;
  let startY = 0;
  
  moonEl.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    e.preventDefault(); // Prevent page scrolling during touch
  });
  
  moonEl.addEventListener('touchmove', function(e) {
    // Prevent scrolling while touching the moon
    e.preventDefault();
  });
  
  moonEl.addEventListener('touchend', function(e) {
    if (!startX || !startY) return;
    
    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;
    
    let diffX = startX - endX;
    let diffY = startY - endY;
    
    // Only trigger if horizontal swipe is greater than vertical
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > 50) { // Minimum swipe distance
        if (diffX > 0) {
          nextDay(); // Swipe left = next day
        } else {
          prevDay(); // Swipe right = previous day
        }
      }
    }
    
    startX = 0;
    startY = 0;
  });
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
