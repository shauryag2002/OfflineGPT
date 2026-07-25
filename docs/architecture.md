# Technical Architecture Overview

OfflineGPT is designed around a decoupled, service-oriented architecture using singleton patterns to manage local LLM lifecycles, model storage, and UI states.

---

## 🏗 High-Level Architecture

```
                                  ┌─────────────────────────────┐
                                  │      React Native / UI      │
                                  │  (Expo Router / Components) │
                                  └──────────────┬──────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │         GPTService          │
                                  │  (App Business Logic & Orchestration)
                                  └──────┬──────────────┬───────┘
                                         │              │
                    ┌────────────────────┘              └────────────────────┐
                    ▼                                                        ▼
    ┌───────────────────────────────┐                        ┌───────────────────────────────┐
    │     LlamaRuntimeService       │                        │         StoreModelURI         │
    │  (llama.rn / C++ Native API)  │                        │ (AsyncStorage Model Metadata) │
    └───────────────────────────────┘                        └───────────────────────────────┘
```

---

## 🛠 Core Services

### 1. `GPTService` (`src/services/GPTService.ts`)
- **Role**: High-level orchestrator singleton.
- **Responsibilities**:
  - Manages active model lifecycle.
  - Triggers model file downloads via `downloadFile` helper.
  - Interfaces between user UI actions and `LlamaRuntimeService`.

### 2. `LlamaRuntimeService` (`src/services/LlamaRuntimeService.ts`)
- **Role**: Low-level engine wrapper for `llama.rn`.
- **Responsibilities**:
  - Initializes `initLlama` context (`n_ctx`, `n_gpu_layers`, `use_mlock`, etc.).
  - Executes streaming chat completion via `context.completion()`.
  - Reads GGUF metadata via `loadLlamaModelInfo()`.

### 3. `StoreModelURI` (`src/services/StoreModelURI.ts`)
- **Role**: Local storage persistence manager.
- **Responsibilities**:
  - Saves downloaded GGUF file paths to `@react-native-async-storage/async-storage`.
  - Tracks active model selection.

---

## 📂 File System Structure

```
src/
├── app/                  # Expo Router file-based screens
│   ├── _layout.tsx       # Root Stack layout (manages (tabs) and standalone chat screen)
│   ├── chat.tsx          # Standalone Chat screen (no bottom tab bar)
│   └── (tabs)/           # Tab navigation group (with bottom tab bar)
│       ├── _layout.tsx   # Tab bar layout
│       ├── index.tsx     # Home screen
│       └── explore.tsx   # Explore screen
├── components/           # UI components (app-tabs.tsx, popup/DownloadModelPopup.tsx)
├── constants/            # Global configs and theme palette (global.tsx, theme.ts)
├── helpers/              # File system helpers (downloadFile.ts using expo-file-system)
├── services/             # Core Singleton Services (GPTService, LlamaRuntimeService, StoreModelURI)
└── types/                # TypeScript interfaces and type definitions
```

