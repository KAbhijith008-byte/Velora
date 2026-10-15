# Velora

> Weather, with a feeling.

A cinematic weather dashboard that adapts to the sky — animated backgrounds, ambient sound, dynamic color, and real-time updates.

![Velora](docs/screenshots/hero.png)

## Live

- **App:** https://velora.vercel.app _(update after deploy)_
- **API:** https://velora-api.onrender.com _(update after deploy)_

## Features

- 🔍 Search any city worldwide (Open-Meteo, no API key)
- 📍 Auto-detect location via GPS
- 🌡️ Unit toggle (°C / °F) with persistence
- 📊 7-day forecast + 24-hour hourly chart
- 🎨 Dynamic accent color that shifts with temperature
- 🌧️ Animated canvas backgrounds (rain, snow, clouds)
- 🔊 Ambient soundscapes (rain, thunder, birds, wind)
- ⌘K Command palette for keyboard-driven navigation
- 📤 Share weather as a beautiful PNG card
- 📱 Offline-ready PWA with service worker
- ⚡ Real-time updates via Server-Sent Events
- ♿ Reduced motion, focus rings, ARIA labels

## Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS v4
- Framer Motion
- TanStack Query
- Recharts
- cmdk
- html-to-image

**Backend**
- Node.js + Express
- Open-Meteo API (free, no key)
- node-cache (10-min TTL)
- express-rate-limit
- Server-Sent Events

## Architecture
