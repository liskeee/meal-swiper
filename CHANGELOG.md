# Changelog

All notable changes to Meal Swiper will be documented in this file.

This project uses [Semantic Release](https://github.com/semantic-release/semantic-release) for automated versioning.

## [2.0.0] - 2026-03-10

### 🚀 Features

- Migration from Notion + KV to Cloudflare D1 (SQLite)
- Recipe enrichment with inline scaled amounts and AmountBadge components
- Polish stemming for ingredient matching
- Dynamic scaling of kcal/protein/shopping list by person count
- Person names in settings
- Desktop sidebar navigation with full-width items
- DaySelector reusable component
- Swipe state persistence across tab switches

### 🐛 Bug Fixes

- Background swipe cards now show full info (opis, kcal, counter)
- Swipe cards no longer reshuffle after meal selection
- LoadingSpinner fix
- Swipe animation fix
- Duplicate meal prevention in swipe deck

### 🏗️ Refactoring

- Split oversized components (SwipeCard, SwipeStack, SwipeActions, DayCard)
- Settings moved from 5th tab to header gear icon (4 tabs + ⚙️)
- Removed unused files and Notion dependency
