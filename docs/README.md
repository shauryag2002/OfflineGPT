# OfflineGPT Documentation

Welcome to the documentation for **OfflineGPT** — an offline-first mobile application bringing open-source Large Language Models (LLMs) directly to mobile devices using Expo and [`llama.rn`](https://github.com/my289/llama.rn).

---

## 📚 Documentation Index

1. [**Architecture Overview**](./architecture.md)  
   Detailed breakdown of singleton services (`GPTService`, `LlamaRuntimeService`, `StoreModelURI`), file downloads, and UI flow.

2. [**Progress & v1.0.0 MVP Roadmap**](./progress.md)  
   Current implementation status, completed features, pending items, and Google Play Store deployment readiness.

3. [**`llama.rn` Integration & Performance Guide**](./llama_rn_guide.md)  
   Technical guide on GGUF models, context window size, thread allocation, memory management, and recommended learning resources.

---

## 🚀 Key Project Goals (v1.0.0 MVP)

- **Offline LLM Runtime**: Run GGUF models natively on Android/iOS via llama.cpp native bindings.
- **Model Management**: Download and locally store quantized models (e.g. Q4_K_M GGUF).
- **Interactive Chat Interface**: Smooth streaming chat screen with customizable system prompts.
- **Google Play Store Release**: Production Android release bundle (`.aab`) with proper Expo build configuration.
