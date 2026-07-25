# `llama.rn` Knowledge & Optimization Guide

This guide covers technical best practices, model selection, runtime parameter tuning, and resource recommendations for running local LLMs on React Native via [`llama.rn`](https://github.com/my289/llama.rn).

---

## 🔑 Core Concepts & Optimal Configurations

### 1. Optimal Thread Count (`n_threads`)
- **Rule of thumb**: Never exceed the physical core count of the mobile CPU. Standard recommendation for mobile is **4 threads** (`n_threads: 4`).
- **Why**: Setting `n_threads: 100` causes thread contention, severe CPU throttling, battery drain, and app freezes.

```typescript
// Recommended thread setting
n_threads: Math.min(4, require('os').cpus().length || 4)
```

### 2. GPU Layer Offloading (`n_gpu_layers`)
- **Android**: Uses OpenCL / Vulkan / ARM Mali bindings.
- **iOS**: Uses Metal acceleration.
- **Recommendation**: Test with `n_gpu_layers: 0` first for maximum compatibility on Android, or standard `99` on Metal for iOS.

### 3. Memory Locking (`use_mlock`)
- `use_mlock: true` prevents RAM from swapping to disk, keeping execution fast.
- **Caution**: If available RAM is lower than model size, `use_mlock` will throw an OOM error.

### 4. Recommended GGUF Models for Mobile MVP

| Model Name | Quantization | Size | RAM Required | Best Use Case |
|---|---|---|---|---|
| **Llama-3.2-1B-Instruct** | Q4_K_M | ~800 MB | ~1.5 GB | Ultra-fast mobile chat, low memory devices |
| **Qwen2.5-1.5B-Instruct** | Q4_K_M | ~1.1 GB | ~2.0 GB | High accuracy lightweight mobile assistant |
| **SmolLM2-1.7B-Instruct** | Q4_K_M | ~1.0 GB | ~1.8 GB | Efficient text generation |
| **Phi-3.5-mini-instruct** | Q4_K_M | ~2.2 GB | ~3.5 GB | Flagship smartphones only |

---

## 📖 Recommended Resources & Links

1. **Official Repositories & Specs**:
   - [`llama.rn` GitHub Repository](https://github.com/my289/llama.rn) — Native React Native bindings for `llama.cpp`.
   - [`llama.cpp` Core Repository](https://github.com/ggerganov/llama.cpp) — The C++ engine underlying mobile LLM inference.
   - [Hugging Face GGUF Models Tag](https://huggingface.co/models?search=gguf) — Search and download quantized `.gguf` files.

2. **Key Articles & Guides**:
   - *Quantization Guide (Q4_K_M vs Q5_K_M vs Q8)*: Understanding memory-accuracy tradeoffs for mobile devices.
   - *Prompt Templates (ChatML vs Llama-3 format)*: Formatting system, user, and assistant tokens correctly so models don't output gibberish.

3. **Community & Tutorials**:
   - Search YouTube for *"Running llama.cpp on Android / iOS React Native"*.
   - GitHub Discussions on `ggerganov/llama.cpp` regarding mobile performance benchmarks (Snapdragon vs Apple Silicon).
