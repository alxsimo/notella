# Project Notella

This is a project built for MacOS operating systems that using AI facilitates note taking from audio captured conversations.

Requirements:
1. Project needs a way to capture system audio from any meeting
2. The audio is saved and transcribed to text
3. The transcribred text is saved locally and also to an configurable Google Drive
4. The transcription is sent to an AI tool, initially will start with ChatGPT but later can be configured
5. The application will provide a summary of the conversation, highlighting action items


## Application Layers
1. macOS app (UI + settings)
Start/stop recording, show live status, list past meetings, view transcripts/summaries/action items.

2. Audio capture service
Captures system audio from meetings → writes to audio files → streams/chunks to transcriber.

3. Transcription + AI service
Sends audio → gets text → sends text to LLM → receives summary & action items.

4. Storage & sync layer
Persists audio + transcripts locally.
Uploads to Google Drive.

## Core Technologies

Languages and technologies: Electron + Node.js + TypeScript

  1. Desktop Framework
  - Electron - Desktop app with web technologies, good for rapid development


  2. System Audio Capture
  - BlackHole (open-source virtual audio driver for MacOS) + node-audio-recorder or audio-recorder-polyfill  

  3. Speech-to-Text
  - OpenAI Whisper (local model via whisper.cpp Node bindings for privacy)
  - Create an abstraction so later I can easily switch to a different provider

  4. Storage
  - Node.js fs module for local storage
  - Google Drive API v3 with googleapis npm package
  - SQLite (better-sqlite3) for metadata/indexing

  5. AI Integration
  - OpenAI API (GPT-4/GPT-4o) for summaries and action items
  - Abstraction layer pattern to support multiple providers later
  - Langchain.js for AI orchestration (optional but helpful)

  6. UI Framework
  - React + shadcn/ui or Tailwind CSS for modern UI
  - Zustand or Jotai for state management (lightweight)

## Architecture Guidelines
- Use DDD always to design each layers
- The architecture must follow SOLID and Clean Code principles
- The application must follow SCREAMING architecture
- Each business component or class that contains logic, should be tested
- Follow the testing pyramid by favoring unit tests over integration tests
