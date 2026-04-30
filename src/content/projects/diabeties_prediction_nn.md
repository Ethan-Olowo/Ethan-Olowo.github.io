---
title: "Diabetes Risk Prediction System with Explainable AI and MLOps Pipeline"
description: "Developed a production-ready diabetes risk prediction system using an optimized MLP, enhanced with Explainable AI (SHAP, LIME), and deployed through a sustainable MLOps pipeline with monitoring and drift detection."
tags: ["Python", "Deep Learning", "MLOps", "Explainable AI", "FastAPI", "Optuna"]

coverImage: ""
order: 12
featured: false
draft: false
---

## Overview

This project delivers an end-to-end machine learning system for predicting diabetes risk using health indicator data. It evolves from a baseline neural network into a production-grade solution by integrating advanced optimization techniques, Explainable AI (XAI), and a full MLOps pipeline.

The system is designed around three core principles: high predictive performance, clinical interpretability, and sustainable deployment. It prioritizes patient safety by maximizing recall while ensuring transparency through model explainability techniques.

## Features

- Binary classification model for diabetes risk prediction  
- Optimized Multi-Layer Perceptron (MLP) using Bayesian tuning (Optuna)  
- Explainable AI integration using SHAP (global) and LIME (local)  
- Threshold optimization for recall-focused predictions  
- Full MLOps pipeline with API deployment and monitoring  
- Data drift detection and automated retraining strategy  
- Carbon footprint tracking using Green AI principles  

## Tech Stack

- Python  
- PyTorch  
- Scikit-learn  
- Optuna  
- FastAPI  
- SQLite  
- SHAP / LIME  
- CodeCarbon  

## Model Architecture

- Funnel-based MLP architecture: **128 → 64 → 32 neurons**  
- ReLU activation for hidden layers, Sigmoid for output  
- Dropout (0.3) for regularization  
- Adam optimizer with tuned learning rate  
- Binary Cross-Entropy loss  

## Key Capabilities

- Predicts diabetes risk with high sensitivity (Recall-focused)  
- Provides both global and patient-specific explanations  
- Detects and adapts to real-world data drift  
- Logs predictions for continuous monitoring and improvement  
- Balances model performance with environmental sustainability  

## Development Highlights

- Used Bayesian Optimization (Optuna) for efficient hyperparameter tuning  
- Applied threshold tuning (0.33) to reduce false negatives  
- Achieved high recall (0.89), prioritizing early detection  
- Compared deep learning with traditional models (e.g., XGBoost)  
- Implemented Green AI practices to minimize carbon footprint  

## Explainability & Insights

- **SHAP:** Identified key global drivers (BMI, Age, Blood Pressure, General Health)  
- **LIME:** Provided local explanations for individual predictions  
- Revealed bias toward “classic” metabolic diabetes profiles  
- Enabled transparent, clinically interpretable decision-making  

## System Architecture (MLOps)

- **API Layer:** FastAPI for serving predictions  
- **Inference Engine:** Loads trained model, scaler, and XAI artifacts  
- **Storage:** SQLite database for logging predictions  
- **Monitoring Loop:** Detects data drift (covariate, prior, concept) and triggers retraining  

## Impact

- Supports early detection of diabetes risk  
- Enhances trust through interpretable AI decisions  
- Demonstrates real-world ML deployment beyond experimentation  
- Balances accuracy, interpretability, and sustainability  

## Future Improvements

- Incorporate additional clinical features (e.g., glucose levels, family history)  
- Improve detection of atypical diabetes cases  
- Explore alternative deep learning architectures  
- Expand dataset for better generalization  
- Enhance monitoring with real-time dashboards  
