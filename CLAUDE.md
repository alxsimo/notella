# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Notella is a macOS desktop application that facilitates AI-powered note-taking from audio-captured conversations. It records system audio from meetings, transcribes the audio to text using OpenAI Whisper, generates summaries and action items using GPT-4, and syncs everything to Google Drive.

## Commands

### Development
```bash
# Install dependencies
npm install

# Start development server (Vite renderer + Electron)
npm run dev

# Build the project
npm run build

# Run linter
npm run lint

# Format code
npm run format
```

### Testing
```bash
# Run all tests
npm test

# Run a single test file
npm test -- path/to/test.test.ts

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Architecture

### High-Level Structure

This is an Electron + React + TypeScript application following **Domain-Driven Design (DDD)**, **Clean Architecture**, and **SCREAMING Architecture** principles. The codebase is organized by features/use cases rather than technical layers.

**Main Layers:**
1. **Domain Layer** (`src/domain/*`): Core business entities, value objects, and repository interfaces (ports). Pure business logic with no external dependencies.
2. **Application Layer** (`src/application/*`): Use cases that orchestrate domain objects and coordinate infrastructure services. Contains business workflows.
3. **Infrastructure Layer** (`src/infrastructure/*`): Concrete implementations of repository interfaces and external service adapters (OpenAI, Google Drive, SQLite, Audio Capture).
4. **Presentation Layer** (`src/renderer/*`): React UI components, Zustand stores, and user interaction logic.
5. **Main Process** (`src/main/*`): Electron main process that initializes services and handles IPC communication.

### Key Components

- **Recording**: Manages audio recording lifecycle (start, stop, metadata). Domain entity with status transitions.
- **Transcription**: Handles audio-to-text conversion with provider abstraction (currently OpenAI Whisper, extensible to Deepgram/AssemblyAI).
- **Summarization**: Generates meeting summaries and action items from transcripts using LLMs (currently GPT-4, extensible to Claude/Gemini).
- **Storage**: SQLite database for local persistence of recordings, transcripts, and summaries.
- **Sync**: Google Drive integration for uploading audio files and transcripts to cloud storage.

### Data Flow

1. User starts recording → `StartRecordingUseCase` → `AudioCaptureService` begins capturing system audio → `RecordingEntity` created and saved to SQLite
2. User stops recording → `StopRecordingUseCase` → Audio file finalized → Recording marked as completed
3. Transcription triggered → `TranscribeRecordingUseCase` → `TranscriptionService` (OpenAI Whisper) → `TranscriptEntity` created → Linked to Recording
4. Summarization triggered → `SummarizeTranscriptUseCase` → `SummarizationService` (GPT-4) → `SummaryEntity` with action items → Linked to Recording
5. Sync (if configured) → `GoogleDriveSyncService` uploads files to Google Drive

### Important Patterns & Conventions

- **SOLID Principles**: Every service has a single responsibility, depends on abstractions (interfaces), and is open for extension
- **Repository Pattern**: Domain entities are persisted via repository interfaces implemented in infrastructure layer
- **Factory Pattern**: Services are created via factories (e.g., `TranscriptionServiceFactory`, `SummarizationServiceFactory`) to support multiple providers
- **Use Case Pattern**: Each business operation is encapsulated in a dedicated use case class
- **SCREAMING Architecture**: Folder structure reflects business capabilities (recording, transcription, summarization) not technical concerns
- **Testing Pyramid**: Favor unit tests for domain entities and use cases; integration tests for infrastructure adapters

### File Organization

```
src/
├── domain/              # Business entities and interfaces (ports)
│   ├── recording/       # Recording aggregate
│   ├── transcription/   # Transcription aggregate
│   ├── summarization/   # Summary aggregate
│   └── storage/         # Storage interfaces
├── application/         # Use cases (business workflows)
│   ├── recording/       # Recording use cases
│   ├── transcription/   # Transcription use cases
│   └── summarization/   # Summarization use cases
├── infrastructure/      # External service implementations (adapters)
│   ├── recording/       # Audio capture implementation
│   ├── transcription/   # Transcription provider implementations
│   ├── summarization/   # LLM provider implementations
│   ├── storage/         # SQLite repository implementations
│   └── sync/            # Google Drive sync implementation
├── main/                # Electron main process
├── renderer/            # React UI (Vite)
│   ├── components/      # UI components
│   └── store/           # Zustand state management
└── shared/              # Shared types and utilities
```

## Development Notes

### Configuration

- **tsconfig.json**: TypeScript config for renderer (React)
- **tsconfig.main.json**: TypeScript config for main process (Electron/Node)
- **vite.config.ts**: Vite bundler configuration for renderer
- **jest.config.js**: Jest test runner configuration
- **tailwind.config.js**: Tailwind CSS configuration
- **.eslintrc.json**: ESLint rules
- **.prettierrc**: Code formatting rules

### Environment Setup

**Prerequisites:**
- Node.js 20+
- BlackHole virtual audio driver (for system audio capture on macOS)
- OpenAI API key (for transcription and summarization)
- Google Drive API credentials (optional, for sync)

**Environment Variables:**
Create a `.env` file in the root directory:
```
OPENAI_API_KEY=your_openai_api_key
GOOGLE_DRIVE_CLIENT_ID=your_client_id
GOOGLE_DRIVE_CLIENT_SECRET=your_client_secret
GOOGLE_DRIVE_REFRESH_TOKEN=your_refresh_token
```

### Dependencies

- **Electron**: Desktop application framework
- **React + Zustand**: UI framework and state management
- **Vite**: Fast build tool for renderer process
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **better-sqlite3**: Synchronous SQLite database
- **OpenAI SDK**: API client for Whisper and GPT-4
- **googleapis**: Google Drive API client
- **Jest + ts-jest**: Testing framework

### Adding New Features

When adding a new feature, follow this pattern:

1. **Domain Layer**: Create entity and repository interface in `src/domain/[feature]/`
2. **Infrastructure Layer**: Implement repository and external services in `src/infrastructure/[feature]/`
3. **Application Layer**: Create use cases in `src/application/[feature]/`
4. **Presentation Layer**: Add UI components and state management in `src/renderer/`
5. **Tests**: Add unit tests alongside each module in `__tests__/` directories

Always maintain the dependency rule: Domain ← Application ← Infrastructure/Presentation. Dependencies point inward.
