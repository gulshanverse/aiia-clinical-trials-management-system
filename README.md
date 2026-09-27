# AIIA Clinical Trials Management System

> An integrated, interoperable and audit-ready Clinical Trial Management System for Ayurveda research.

[![Smart India Hackathon](https://img.shields.io/badge/Smart%20India%20Hackathon-2026-blue)](#)
[![HealthTech](https://img.shields.io/badge/Domain-HealthTech-green)](#)
[![Clinical Research](https://img.shields.io/badge/Clinical-Research-purple)](#)
[![CDISC](https://img.shields.io/badge/Standard-CDISC-orange)](#)
[![HL7 FHIR](https://img.shields.io/badge/Interoperability-HL7%20FHIR-red)](#)

---

### From Protocol to Evidence — One Connected Research Platform
## Overview

The AIIA Clinical Trials Management System (CTMS) is an integrated digital
platform designed to support the end-to-end lifecycle of Ayurveda clinical
research.

The platform brings together traditionally fragmented workflows such as:

- Study and protocol management
- Ethics and regulatory tracking
- CTRI registration tracking
- Site and participant management
- Electronic Data Capture (EDC/eCRF)
- Pharmacovigilance and AE/SAE management
- Data quality and query management
- CDISC-aligned research data workflows
- HL7 FHIR interoperability
- AI-assisted study risk monitoring
- Role-based dashboards
- Audit trails and data provenance
- Analytics and regulatory reporting

## Problem

Clinical research workflows are often distributed across multiple systems,
spreadsheets and disconnected processes.

A typical study may involve separate workflows for:

- Protocol and study tracking
- Ethics Committee approvals
- CTRI registration
- Site and participant monitoring
- Clinical data collection
- Adverse Event / Serious Adverse Event reporting
- Regulatory compliance
- Data quality management
- Research data standardization
- Institutional reporting

This fragmentation can make it difficult to obtain a unified, real-time view
of study progress, compliance, recruitment, data quality and participant safety.

The problem becomes particularly relevant for Ayurveda research, where
study-specific workflows and Indian regulatory requirements need to coexist
with modern clinical research data standards and interoperability.

## Solution

The proposed system provides a unified CTMS layer that connects the major
clinical research workflows through a common study-centric data model.

### Core capabilities

1. Study & Protocol Management
2. Ethics & Regulatory Management
3. CTRI Tracking
4. Site & Participant Management
5. EDC / eCRF
6. Data Quality & Query Management
7. Pharmacovigilance
8. AE / SAE Tracking
9. CDISC-aligned Data Workflows
10. HL7 FHIR Interoperability
11. AI-assisted Risk Monitoring
12. Analytics & Reporting
13. Role-Based Access Control
14. Immutable Audit Trail
15. Research Data Provenance

## Key Innovations

### 1. Protocol-to-Execution Engine

Transforms an approved study protocol into an executable operational
workflow including milestones, visits, data-collection requirements,
validation rules and monitoring tasks.

### 2. Regulatory Digital Twin

Maintains a continuously updated representation of the study's regulatory
state, including ethics approvals, CTRI status, applicable submissions,
renewals and pending compliance actions.

### 3. Explainable Study Risk Engine

Uses operational indicators such as recruitment performance, data queries,
protocol deviations, overdue activities and site performance to identify
potential study risks.

Rather than providing only a risk score, the system exposes the underlying
risk factors to support human decision-making.

### 4. FHIR ↔ CDISC Interoperability Layer

Provides an architectural bridge between healthcare interoperability
workflows using HL7 FHIR and research-oriented CDISC data structures.

### 5. Trial Replay & Research Provenance

Provides chronological reconstruction of study activities and data changes,
supporting traceability, review and audit workflows.

### 6. Ayurveda-Focused Research Model

The platform is designed around the requirements of Ayurveda clinical
research rather than treating Ayurveda as an afterthought within a generic
clinical-trial platform.

## High-Level Architecture

```text
┌──────────────────────────────────────────────────────────┐
│                     USER INTERFACE                       │
│ PI │ Coordinator │ Site │ Ethics │ PV │ Admin │ Analyst │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                 APPLICATION / API LAYER                   │
│ RBAC │ Workflow │ Validation │ Notifications │ Audit      │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                    CTMS CORE                             │
│                                                          │
│ Study │ Protocol │ Sites │ Participants │ EDC/eCRF       │
│ Ethics │ Regulatory │ CTRI │ PV │ AE/SAE │ Queries      │
└──────────────────────────┬───────────────────────────────┘
                           │
             ┌─────────────┼──────────────┐
             ▼             ▼              ▼
        AI / Risk      Interoperability   Analytics
        Engine         FHIR / CDISC       & Reporting
             │             │              │
             └─────────────┼──────────────┘
                           ▼
┌──────────────────────────────────────────────────────────┐
│                  DATA & SECURITY LAYER                   │
│ Database │ Object Storage │ Audit Logs │ Encryption      │
│ Backup │ Provenance │ Access Control │ Monitoring        │
└──────────────────────────────────────────────────────────┘
```

## Planned Technology Stack

> The following technologies represent the planned implementation stack and
> should be updated as the project is finalized and implemented.

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Component-based UI system

### Backend

- Node.js
- NestJS
- REST APIs
- Authentication & RBAC

### Data

- PostgreSQL
- Prisma ORM
- Object Storage

### AI / Analytics

- Python
- FastAPI
- Machine Learning / Risk Scoring
- Analytics pipelines

### Interoperability

- HL7 FHIR R4
- CDISC-aligned data structures
- REST APIs

### Infrastructure

- Docker
- GitHub Actions
- Cloud deployment

### Security

- Role-Based Access Control
- Encryption
- Audit Logging
- Secure Authentication
- Data Minimization

## System Modules

| Module | Purpose |
|---|---|
| Study Management | Manage studies, protocols and lifecycle milestones |
| Site Management | Manage participating research sites and investigators |
| Participant Management | Screening, enrollment, visits and retention |
| EDC / eCRF | Capture and validate clinical research data |
| Ethics Management | Track EC submissions, approvals and renewals |
| Regulatory Management | Track regulatory activities and deadlines |
| CTRI Tracking | Manage CTRI-related study information and status |
| Pharmacovigilance | Capture and manage AE/SAE workflows |
| Data Quality | Queries, validation and deviation monitoring |
| Interoperability | FHIR and research-data exchange |
| AI Risk Engine | Identify operational risk signals |
| Analytics | Study, site and portfolio intelligence |
| Reporting | Generate operational and regulatory reports |
| Audit Trail | Track critical system and data changes |
| Access Control | Role-based permissions and security |

## User Roles

### Principal Investigator

Study-level oversight, protocol monitoring, safety review and analytics.

### Study Coordinator

Operational study management, participant tracking, visits and queries.

### Site Staff

Participant activities, data capture and site-level tasks.

### Ethics Committee

Review workflows, approvals, renewals and compliance activities.

### Pharmacovigilance Team

AE/SAE review, safety workflows and reporting.

### Regulatory Team

Regulatory submissions, deadlines and compliance tracking.

### Research Leadership

Portfolio-level analytics, study health and institutional insights.

### System Administrator

User management, roles, security and platform configuration.

## Repository Structure

```text
aiia-clinical-trials-management-system/
│
├── apps/
│   ├── web/                 # Main CTMS web application
│   ├── admin/               # Administration & configuration
│   └── api/                 # Backend API
│
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── types/               # Shared TypeScript types
│   ├── config/              # Shared configuration
│   ├── validation/          # Validation schemas
│   └── workflows/           # Study workflow definitions
│
├── services/
│   ├── ai-engine/           # Risk scoring & intelligence
│   └── interoperability/    # FHIR/CDISC integration services
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── workflows/
│   ├── compliance/
│   └── research/
│
├── infrastructure/
│   ├── docker/
│   └── deployment/
│
├── tests/
│
├── .github/
│   └── workflows/
│
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── README.md
├── LICENSE
└── CONTRIBUTING.md
```
