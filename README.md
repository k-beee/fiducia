# Fiducia
> *Where grant promises meet on-chain proof.*

![GenLayer](https://img.shields.io/badge/GenLayer-Protocol-C9A84C)
![Studionet](https://img.shields.io/badge/Network-Studionet-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Executive Summary
Fiducia is a trustless grant accountability protocol deployed on GenLayer. It uses tranched escrow and independent AI validators to evaluate grantee dispatches before releasing funds.

## Architecture
```mermaid
graph TD
    A([🐉 Fund Lodged\nEscrow Locked]) --> B{Valid Parameters?}
    B -- No --> Z0[❌ Reverted]
    B -- Yes --> C[Milestone Queue Initialised]
    C --> D([Grantee Submits Dispatch])
    D --> E[Each Validator Independently\nFetches Evidence URLs]
    E --> F[AI Panel Rules\n4 Qualitative Dimensions]
    F --> G{Overall Verdict?}
    G -- PASSED --> H[💰 Disbursement Released\nOn Finalised Tx]
    H --> I{Final Milestone?}
    I -- No --> D
    I -- Yes --> J([✅ Fund COMPLETED\nAll Capital Disbursed])
    G -- FAILED --> K[Streak Counter +1]
    K --> L{3 Consecutive\nFAILEDs?}
    L -- No --> M[Streak Recorded\nFund Remains ACTIVE]
    M --> D
    L -- Yes --> N([⚠️ CLAWBACK_PENDING\nChallenge Window Opens])
    N --> O{Grantee Lodges\nBonded Challenge?}
    O -- No --> P[Window Elapses\nclawback_window_actions]
    P --> Q([💸 Remaining Escrow\nReturned to Funder])
    O -- Yes --> R[Grantee Posts\nChallenge Deposit ≥2%]
    R --> S[Second AI Panel Review\nOriginal Ruling in Context]
    S --> T{Second Verdict?}
    T -- PASSED --> U[🔄 Ruling OVERTURNED]
    U --> V[Deposit Refunded +\nDisbursement Released]
    V --> W{Final Milestone?}
    W -- No --> D
    W -- Yes --> J
    T -- FAILED --> X[Ruling UPHELD]
    X --> Y[Deposit Forfeited\nto Funder]
    Y --> Q
```
