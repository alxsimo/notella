# Notella

AI-powered note-taking from audio-captured conversations for macOS.

## Overview

Notella is a desktop application that records system audio from meetings, transcribes the audio using AI, and generates summaries with action items. All data is stored locally and optionally synced to Google Drive.

## Features

- System audio recording from any meeting application
- AI-powered transcription using OpenAI Whisper
- Automatic summary generation with action items using GPT-4
- Local storage with SQLite
- Optional Google Drive sync
- Clean, modern UI built with React and Tailwind CSS

## Architecture

Built following **Domain-Driven Design (DDD)**, **Clean Architecture**, and **SCREAMING Architecture** principles. See [CLAUDE.md](./CLAUDE.md) for detailed architecture documentation.

## Prerequisites

- Node.js 20+
- macOS (required for system audio capture)
- [BlackHole](https://github.com/ExistentialAudio/BlackHole) virtual audio driver
- OpenAI API key

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install BlackHole audio driver:
```bash
brew install blackhole-2ch
```

3. Configure Audio MIDI Setup to route system audio through BlackHole

4. Create a `.env` file:
```
OPENAI_API_KEY=your_openai_api_key
```

## Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

## Building

```bash
npm run build
```

## Project Structure

```
src/
├── domain/          # Business logic and entities
├── application/     # Use cases
├── infrastructure/  # External services
├── main/           # Electron main process
└── renderer/       # React UI
```

## 🚀 Next Steps

  1. Run npm install to install dependencies
  2. Install BlackHole audio driver: brew install blackhole-2ch
  3. Configure Audio MIDI Setup for system audio routing
  4. Add your OpenAI API key to .env file
  5. Run npm run dev to start development
  6. Implement the TODO in NodeAudioCaptureService.ts:24 to integrate actual audio recording library


## Tech Stack

- **Electron** - Desktop framework
- **React + TypeScript** - UI
- **Zustand** - State management
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **SQLite** - Local database
- **OpenAI API** - Transcription & Summarization
- **Jest** - Testing

## License

MIT
