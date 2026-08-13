# 🏛️ Fiducia — The On-Chain Grant Trust Layer

> *Where grant covenants meet neutral machine adjudication.*

[![GenLayer](https://img.shields.io/badge/Protocol-GenLayer-C9A84C)](https://genlayer.com)
[![Network](https://img.shields.io/badge/Network-Studionet-0E131F)](https://studio.genlayer.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 🔗 Deployed Records (Studionet)

| Entity | Address / Tx Hash | Explorer Link |
|---|---|---|
| **Intelligent Contract** | `0x6dB333eaA76349bB37BE56F14467Abc949464748` | [View Address](https://explorer-studio.genlayer.com/address/0x6dB333eaA76349bB37BE56F14467Abc949464748) |
| **Escrow Lodged (Tx)** | `0x162c9fa5ceca31ee025ae6daf7d6497865c48c72728102ad52351302e14b636a` | [View Tx](https://explorer-studio.genlayer.com/tx/0x162c9fa5ceca31ee025ae6daf7d6497865c48c72728102ad52351302e14b636a) |
| **Milestone 1 Dispatch (Tx)** | `0x62c4676bb0ed3b7c045823ba7baf8d84d789026d9df8bd22237c051ecad932a5` | [View Tx](https://explorer-studio.genlayer.com/tx/0x62c4676bb0ed3b7c045823ba7baf8d84d789026d9df8bd22237c051ecad932a5) |

---

## 📝 Executive Summary

Fiducia is an AI-adjudicated grant escrow and milestone tracking protocol built on GenLayer. Funder allocations are locked in escrow and split across milestones. To claim disbursements, grantees submit progress narratives and public evidence URLs. GenLayer validators independently fetch the raw evidence, run an AI panel to rate four qualitative execution dimensions, and release funds atomically upon consensus of a PASSED verdict. Three consecutive FAILED verdicts auto-trigger a clawback phase, returning remaining capital to the funder after a grace window.

---

## ⚡ The Grant Accountability Gap

Traditional grants suffer from a structural trust dilemma. Funders must choose between two suboptimal paths:
1. **Front-Loaded Funding (High Risk):** Release all capital upfront, exposing the program to non-delivery, abandonment, or misaligned spending.
2. **Heavy Administrative Overhead (High Friction):** Require manual reporting, third-party audits, or multisig approvals, dragging milestones, introducing human bias, and delaying grantee progress.

Fiducia resolves this conflict by acting as a **neutral, machine-adjudicated trust layer**. Escrows are locked on-chain, eliminating funder default risk for the grantee. Rulings are performed by decentralized LLM panels evaluating live retrieved web assets, removing administrative friction for the funder.

---

## 🗺️ System Architecture

The following diagram illustrates the lifecycle of a Fiducia escrow, including milestone delivery, AI panel adjudication, the tri-strike warning count, and the bonded challenge resolution path:

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

---

## 🤖 The AI Adjudication Panel

Validators evaluate submissions against funder-defined **Acceptance Criteria** using a four-dimensional qualitative scale. Rulings require validators to run the non-comparative Equivalence Principle (EP) to verify that the leader's evaluation is fully grounded in the retrieved content.

### 📐 The Evaluation Rubric

| Dimension | Scaling Levels (Strongest to Weakest) | Description |
|---|---|---|
| **Execution Quality** | `EXCELLENT` \| `SATISFACTORY` \| `INSUFFICIENT` | Assesses the completeness and qualitative standard of the delivered milestone deliverables. |
| **Proof Strength** | `COMPELLING` \| `ADEQUATE` \| `MARGINAL` \| `ABSENT` | Evaluates if the evidence provided is verifiable, direct, and matches the narrative claims. |
| **Budget Fidelity** | `ON_TRACK` \| `PARTIAL` \| `DIVERTED` \| `UNACCOUNTED` | Verifies that expenditures and resources are accounted for and aligned with the plan. |
| **Impact Veracity** | `DEMONSTRATED` \| `PLAUSIBLE` \| `UNSUBSTANTIATED` | Rates the credibility of progress, user metrics, or live outputs described in the report. |

### ⚖️ Verdict Logic
To receive a **PASSED** verdict (which triggers transaction finalization and immediate disbursement):
* **Execution Quality** must be `SATISFACTORY` or better.
* **Proof Strength** must be `ADEQUATE` or better.
* **No single dimension** can be rated at its absolute worst level (`INSUFFICIENT`, `ABSENT`, `UNACCOUNTED`, or `UNSUBSTANTIATED`).
* Any deviation fails the criteria, resulting in a **FAILED** verdict.

---

## 🛡️ The Bonded Challenge System

To protect grantees against outlier model verdicts or edge cases where validators fail to fetch dynamic content, the protocol implements a **Bonded Challenge Mechanic**:
* Grantees can challenge a `FAILED` ruling by locking a **Challenge Deposit** (2% of the disputed tranche, minimum `0.02 GEN`).
* Grantees append a **Challenge Note** directing validators to specific content in their URLs that they believe was missed.
* A second-round AI panel evaluates the dispatch with the original ruling and the grantee's note in context.
* **If Overturned:** The deposit is refunded, the milestone is marked `PASSED`, and the tranche releases.
* **If Upheld:** The grantee's deposit is forfeited to the funder as compensation for the administrative delay.

---

## ⚖️ The Curator Role

Fiducia introduces a premium **Curator delegation role** (an appointed EOA) which can be assigned during escrow creation:
* The curator acts as a trusted program officer or technical arbitrator.
* Curators **cannot bypass the AI validator panel** to release funds (preventing collusion).
* Curators can call `close_fund` early if the project undergoes a scope change or if the grantee becomes completely unresponsive, returning unreleased capital to the funder without waiting for the tri-strike streak to compile.

---

## 🔗 Evidence Admissibility Guide

Because GenLayer validators fetch content in a sandboxed non-deterministic run, URLs are filtered by the frontend preflight utility to prevent transaction reverts:

| Admissible URLs | Inadmissible URLs |
|---|---|
| ✅ Raw GitHub files (`raw.githubusercontent.com/...`) | ❌ Social Media (`twitter.com`, `x.com`) |
| ✅ GitHub Gists (`gist.githubusercontent.com/...`) | ❌ Professional profiles (`linkedin.com`) |
| ✅ Academic PDFs/papers (`arxiv.org/...`) | ❌ Auth-gated platforms or Paywalls |
| ✅ Public documentation wikis (`en.wikipedia.org/...`) | ❌ Dynamic JavaScript-heavy applications |

---

## 📂 Project Structure

```
├── contracts/
│   └── fiducia.py         # GenLayer Intelligent Contract (Storage & AI Panel logic)
├── deploy/
│   └── deploy.ts          # TypeScript deploy script (genlayer-js)
├── tests/
│   └── direct/
│       └── test_fiducia.py # Pytest suite with mock GenVM validator stubs
└── frontend/
    ├── app/               # Next.js 15 App Router views
    ├── components/        # UI components (Nav, Atmosphere backdrop)
    ├── lib/
    │   ├── contracts/     # Client contract wrapper (genlayer-js)
    │   ├── hooks/         # React Query mutation & query hooks
    │   └── genlayer/      # Wallet contexts
    └── tailwind.config.ts # Custom theme config (Tailwind v3)
```

---

## 🛠️ Local Development

### 1. Contract Testing
To run the direct-mode validator test suite:
```bash
pip install pytest eth-account
pytest tests/direct/test_fiducia.py
```

### 2. Running Frontend
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

---

## 📜 Security Design Features

1. **Escrow Dust Allocation:** Division remainders from odd-wei splits across milestone tranches are atomically added to the final milestone, ensuring zero locked dust.
2. **Clock-Independent Window:** As GenVM nodes lack a reliable wall-clock timestamp, grace periods for challenges are measured using a contract-level `cycle_count` that increments with every state-changing transaction.
3. **Anti-Injection Guardrails:** Built-in validator guidelines enforce that any instructions contained within grantee dispatches or fetched web text are treated as data under review, preventing prompt injections from hijacking validation verdicts.

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
