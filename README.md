# OpsFlow — IT Helpdesk & Infrastructure Ticketing Platform

[![Next.js](https://img.shields.io/badge/Next.js-14%2B-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Production-black?logo=vercel&logoColor=white)](https://opsflow-it-helpdesk.vercel.app)
[![Architecture](https://img.shields.io/badge/Architecture-Dual--Role%20RBAC-0ea5e9)](https://opsflow-it-helpdesk.vercel.app)

OpsFlow is a modern IT Helpdesk and Infrastructure Incident Management platform engineered for enterprise IT support and system administration workflows. Built with Next.js and TypeScript, OpsFlow delivers a dynamic dual-role dashboard enabling seamless incident dispatch, asset diagnostics, and service request resolution for both employees and system administrators.

---

## 🌐 Live Production Demo

- **Production URL:** [https://opsflow-it-helpdesk.vercel.app](https://opsflow-it-helpdesk.vercel.app)
- **Deployment Platform:** Vercel Edge Network

---

## ✨ Key Features

- **Dual-Role Dashboard (RBAC):** Dynamic role toggle enabling context-switching between employee service requests and system administrator triage dashboards.
- **Incident Lifecycle Management:** Track tickets through end-to-end statuses (Open, In Progress, Escalated, Resolved) with priority tiering (Low, Medium, Critical).
- **Infrastructure Categorization:** Structured routing for hardware, network endpoints, operating system provisioning, and Active Directory permission issues.
- **Responsive Telemetry & Metrics:** Real-time visualization of queue resolution times, pending tickets, and system health status.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | Server/Client hybrid component architecture and page routing |
| **Language** | TypeScript (99.4%) | End-to-end type safety across ticket schemas, user sessions, and status models |
| **State Management** | React Context API & Hooks | Centralized ticket state, filtering pipelines, and active role switching |
| **UI & Styling** | Tailwind CSS / PostCSS | Responsive enterprise-grade dark UI with accessible contrast standards |
| **Hosting & CDN** | Vercel Edge Network | Edge-cached production artifact delivery and automated deployment |

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
- `npm` or `bun`

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/alexyadao/opsflow.git](https://github.com/alexyadao/opsflow.git)
   cd opsflow
