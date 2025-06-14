# The Moon Tonight 🌒🌓🌔🌕🌖🌗🌘

The Moon Tonight renders moon phases entirely with simple maths and CSS. Navigate through different dates using the arrow buttons, keyboard arrows, or touch gestures to see how the moon appears on any given day.

## How It Works

Moon phases are calculated using a known new moon date (January 6, 2000) and the synodic month period. We then calculate the number of days since that reference point, find the current position in the 29.53-day cycle, and convert this to a percentage that maps to a pre-built CSS class.

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
bundle exec jekyll serve --livereload
# Opens at http://localhost:4000
```

### Building
```bash
bundle exec jekyll build
```

## Contributing

Contributions are welcome! Please feel free to submit a PR.
