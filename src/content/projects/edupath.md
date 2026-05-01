---
title: "EduPath: AI-Powered Career Guidance Platform"
description: "Career Guidance system to bridge the guidance gap for secondary students, using peer clustering, semantic interest matching, and real-time economic indicators, to transform decisions from guesswork into data-driven strategies."
tags: ["Python", "XGBoost", "FastAPI", "Sentence Transformers", "OpenRouter API", "ReactJS", "Supabase", "Optuna"]
type: data-science

githubUrl: "https://github.com/Ethan-Olowo/Degree-Recommender-Backend"
coverImage: ""
order: 1
featured: true
draft: false
---
## Overview
EduPath is an AI-powered career guidance platform designed to bridge the gap in professional guidance for secondary students. The project addresses the problem of informational scarcity and misaligned career decisions by providing data-driven, personalized recommendations based on peer clustering, semantic interest matching, and real-time economic indicators.

## Problem Statement
Students transitioning from secondary to higher education often lack access to reliable, professional guidance. This leads to mismatches between aptitudes and degree choices, resulting in higher dropout rates and academic dissatisfaction.

## Solution & Features
- Hybrid recommendation engine combining peer clustering, semantic interest matching, and economic viability scoring
- Modular three-tier architecture for scalability (backend, frontend, model layer)
- Responsive dashboards and real-time visualization
- Chat assistant for interactive exploration of recommendations

## Technical Architecture & Repositories

The platform follows a modular **three-tier architecture** designed for scalability and clear separation of concerns. You can explore the specific implementations across the following repositories:

*   **[Model & Notebooks Repo](https://github.com/Ethan-Olowo/edupath_notebooks):** Contains the data preprocessing pipelines, XGBoost training scripts, and Optuna hyperparameter tuning logic.
*   **[Backend API Repo](https://github.com/Ethan-Olowo/Degree-Recommender-Backend):** The FastAPI core that orchestrates the recommendation engine, LLM integration, and Supabase interactions.
*   **[Frontend UI Repo](https://github.com/Ethan-Olowo/edufind-app):** The React/TypeScript application featuring responsive dashboards and real-time visualization components.

## Hybrid Recommendation Engine

To provide holistic guidance, the system avoids the pitfalls of "black-box" single-algorithm approaches by fusing three distinct methodologies.

### Peer Clustering (Cold-Start Mitigation)
Using a dataset of over **500,000 student records**, the system employs an **XGBoost Classifier** to map new users to "peer archetypes". By analyzing socioeconomic indicators, parental education, and school types, the model predicts successful degree categories even for users who haven't yet articulated specific interests. 
*   **Performance:** The model achieved a **Top-5 accuracy of approximately 70%** across diverse academic clusters.

### Semantic Interest Matching
Traditional systems often fail because students lack the domain-specific vocabulary to describe their goals. EduPath uses **Sentence Transformers** (`all-MiniLM-L6-v2`) to generate high-dimensional vector embeddings of student hobbies and interests. These are compared against degree program metadata using **cosine similarity** to find matches based on deep semantic meaning rather than simple keyword counts.

### Economic Viability Scoring
Recommendations are weighted by real-world demand. The system interfaces with the **World Bank API** to retrieve country-level indicators (GDP growth, inflation) and **ILOSTAT** data for industry-specific wage trends.
> **Note:** A degree in "Financial Engineering" might receive a higher weight if the student's region shows a projected 15% growth in the financial services sector.

## The Student Experience

The interface was designed to be "agentic," allowing students to not just view results, but to discuss them with the chat assistant.

### Student Dashboard
![Student Dashboard](public/images/dashboard_edupath.jpeg)

### Recommendation Page
![Recommendation Page](public/images/reccommendation_edupath.jpeg)

### Chat Assistant
![Recommendation Page](public/images/chat_edupath.jpeg)


### Explainable AI (XAI)
Every recommendation is accompanied by a natural language justification. By sending the "key factors" (e.g., high semantic fit + strong market outlook) to a Large Language Model via the **OpenRouter API**, the system generates a transparent rationale. This helps build trust, as students can see exactly which part of their profile triggered the suggestion.

## Data & Implementation Details

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Backend** | FastAPI / SQLAlchemy | Asynchronous API management and ORM. |
| **Database** | Supabase (PostgreSQL) | Relational storage with **pgvector** for embedding searches. |
| **ML Models** | Scikit-learn / XGBoost | Clustering and classification logic. |
| **Optimization** | Optuna | Bayesian search for hyperparameter tuning. |
| **Frontend** | React / Tailwind CSS | Responsive UI with dark/light mode support. |

## Future Horizons: From Chatbots to Agents

The project’s roadmap includes moving beyond simple chat interfaces toward **Agentic Interaction** via the **Model Context Protocol (MCP)**. This would allow the AI to proactively ask the student for missing data—like a recent interest in robotics—and dynamically update their profile and recommendations in real-time. 

By bridging the gap between academic potential and economic reality, EduPath ensures the next generation of students isn't just picking a degree, but launching a career.