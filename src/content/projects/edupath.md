---
title: "EduPath: AI-Powered Career Guidance Platform"
description: "Developed a hybrid recommendation engine integrating peer clustering and semantic matching to align student profiles with academic degrees. Engineered a FastAPI backend with a real-time AI career assistant via OpenRouter and integrated World Bank labor market data. Managed relational datasets and high-dimensional vector operations using Supabase and PostgreSQL."
tags: ["Python", "Scikit-learn", "FastAPI", "Sentence Transformers", "OpenRouter API", "ReactJS", "Supabase"]

coverImage: ""
order: 1
featured: true
draft: false
---
## Overview

The AI-Driven Undergraduate Degree Recommendation System addresses the "guidance gap" in secondary education, where students often make high-stakes academic decisions based on incomplete or informal advice. This misalignment between interests and chosen paths contributes to increased program switching and dropout rates in higher education.

This project provides a scalable, data-driven solution that generates personalized degree recommendations by aligning a student's academic performance, self-reported interests, and socioeconomic background with real-world labor market trends.

## Features

* **Hybrid Recommendation Engine:** Integrates three core approaches—Content-Based Filtering, Peer Clustering, and Market Trend Analysis—to provide holistic guidance.
* **Cold-Start Mitigation:** Employs an XGBoost classifier and demographic archetypes to identify suitable academic fields for users who lack a history of higher education choices.
* **Semantic Interest Matching:** Utilizes **Sentence Transformers** (MiniLM-L6-v2) to map general student interests to discipline-specific program metadata using high-dimensional vector similarity.
* **Economic Viability Scoring:** Automatically retrieves and normalizes country-level indicators from the **World Bank API** to weight suggestions toward industries with favorable growth and salary prospects.
* **Explainable AI (XAI):** Leverages Large Language Models via the **OpenRouter API** to generate natural language justifications, helping students understand the specific profile features and market factors behind each recommendation.
* **Role-Specific Dashboards:** Features a Student Dashboard for profile management and recommendation discovery, and an Admin Dashboard for system oversight, reporting, and algorithm configuration.

## Tech Stack

* **Backend:** Python, FastAPI, SQLAlchemy, Pydantic.
* **Machine Learning:** Scikit-learn, XGBoost, Pandas, NumPy, Sentence Transformers.
* **Frontend:** React.js, TypeScript, Tailwind CSS, Vite.
* **Database & Security:** Supabase (PostgreSQL with `pgvector` extension), Row-Level Security (RLS).
* **Optimization:** Optuna for Bayesian hyperparameter tuning of ensemble models.

## Outputs

* **High Accuracy:** The finalized XGBoost model achieved a robust **Top-5 accuracy of approximately 70%** across various degree categories.
* **Comprehensive Documentation:** Includes a detailed system architecture, UML design diagrams, and a rigorous testing suite covering unit, API, and integration tests.
* **Scalable Architecture:** A modular, three-tier web application designed to democratize access to professional-grade career guidance regardless of a student's socioeconomic background.