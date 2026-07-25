# Progress & v1.0.0 MVP Roadmap

## 📊 Current Status Summary

| Area | Status | Notes |
|---|---|---|
| **Expo Setup & Navigation** | ✅ Complete | Uses Expo SDK 56, Expo Router, and `@expo/ui` / `unstable-native-tabs` |
| **Model Storage System** | ✅ Complete | `StoreModelURI` service using `AsyncStorage` |
| **File Downloader** | ✅ Complete | `downloadFile` helper using class-based `expo-file-system` |
| **`llama.rn` Bridge** | 🟡 Partial | Basic setup in `LlamaRuntimeService`, needs thread tuning and model release logic |
| **Model Download UI** | 🟡 Partial | `DownloadModelPopup` implemented using Jetpack Compose wrapper (`@expo/ui`) |
| **Chat Interface UI** | ❌ Pending | Basic text view on `index.tsx`, requires interactive chat UI |
| **Google Play Release Prep**| ❌ Pending | Android build configuration, app icon, splash screen, and EAS build setup |

---

## 🎯 Release Plan: Version 1.0.0 MVP

### Phase 1: Core Engine & Infrastructure Refactoring (Current Focus)
- [x] Integrate `llama.rn` native package.
- [x] Implement local GGUF download and file caching.
- [ ] Fix unsafe thread/GPU parameters in `LlamaRuntimeService`.
- [ ] Implement `unloadModel()` for memory cleanup to prevent mobile OOM crashes.
- [ ] Add error boundaries for model initialization failures (low RAM, corrupt file).

### Phase 2: Full Chat Interface
- [ ] Build messaging list (User & Assistant bubbles) with smooth scrolling.
- [ ] Implement token-by-token real-time streaming output UI.
- [ ] Add stop generation / cancel button.
- [ ] Add conversation history clearing / persistence.

### Phase 3: Polish & Play Store Deployment
- [ ] Configure `app.json` for Android permissions (Storage / Network).
- [ ] Generate Android build assets (App icon, adaptive icon, splash screen).
- [ ] Set up EAS Build (`eas.json`) for Android App Bundle (`.aab`).
- [ ] Test on real physical Android hardware (mid-range & flagship devices).
- [ ] Submit to Google Play Console.
