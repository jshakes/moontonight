# The Moon Tonight 🌓

An interactive lunar phase viewer that shows you the current moon phase and lets you explore how it changes over time.

## 🔗 [View Live Site](https://jshakes.github.io/moontonight/)

## Overview

The Moon Tonight renders moon phases entirely with CSS and calculates lunar cycles using pure mathematics—no external APIs required. Navigate through different dates using the arrow buttons, keyboard arrows, or touch gestures to see how the moon appears on any given day.

## Features

- **Accurate lunar calculations** using the synodic month (29.53-day cycle)
- **Pure CSS moon rendering** with realistic shadow and illumination
- **Touch and keyboard navigation** for exploring different dates
- **Responsive design** that works on all devices
- **No external dependencies** or API calls

## How It Works

Moon phases are calculated using a known new moon date (January 6, 2000) and the synodic month period. The app calculates the number of days since that reference point, finds the current position in the 29.53-day cycle, and converts this to a percentage that drives the CSS-based visual representation.

## Running Locally

### Requirements
- Ruby 2.7+
- Bundler

### Setup
```bash
git clone https://github.com/jshakes/moontonight.git
cd moontonight
bundle install
```

### Development
```bash
npm run dev
# Opens at http://localhost:4000
```

### Building
```bash
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. ✨

## Project History

Originally created in 2016, this project initially relied on the Dark Sky API for moon phase data. When Apple shut down Dark Sky in 2023, it was rebuilt to calculate moon phases mathematically—proving that sometimes the simplest solution is the best one.

## License

MIT