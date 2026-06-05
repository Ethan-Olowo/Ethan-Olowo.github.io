---
title: "Machine Learning API Deployment with Flask, Docker & NGINX"
description: "Multi-model machine learning API with Flask, integrating classification, clustering, and recommendation systems, and deployed it using Docker, Gunicorn, and NGINX for scalable, production-ready access."
tags: ["Machine Learning", "REST API", "MLOps"]
tools: ["Docker", "NGINX", "Gunicorn"]
languages: ["Python"]
frameworks: ["Flask", "Scikit-learn"]
type: software

coverImage: ""
order: 9
featured: false
draft: false
---

## Overview

This project implements a comprehensive machine learning API that exposes multiple predictive models and recommendation systems for external consumption. It serves as a bridge between trained machine learning models and real-world applications, emphasizing API design, usability, and deployment.

The system integrates classification models, clustering, and association rule-based recommendations into a unified REST API. It is further enhanced with a production-oriented deployment setup using Docker, Gunicorn, and NGINX, ensuring scalability, security, and portability.

## Features

- REST API serving multiple machine learning models  
- Classification endpoints (Naive Bayes, KNN, SVM, Random Forest)  
- Cluster prediction endpoint using pre-trained models  
- Product recommendation system using association rules (Apriori)  
- Input validation and preprocessing (encoding, scaling)  
- Frontend test interfaces using HTML, CSS, and JavaScript  
- Containerized deployment with Docker for portability  
- Reverse proxy setup with NGINX for secure and scalable access  
- Gunicorn integration for production-grade request handling  

## Tech Stack

- Python  
- Flask  
- Scikit-learn  
- Docker  
- Gunicorn  
- NGINX  
- HTML / CSS / JavaScript  

## System Architecture

- **API Layer:** Flask-based endpoints serving ML models  
- **Model Layer:** Pre-trained models loaded from disk (classification, clustering)  
- **Recommendation Engine:** Association rules applied for product suggestions  
- **Deployment Layer:** Docker containers orchestrating Flask (Gunicorn) and NGINX  
- **Client Layer:** Web-based interfaces for testing API endpoints  

## Key Endpoints

- `/api/predict_naive_bayes_classifier`  
- `/api/predict_knn_classifier`  
- `/api/predict_support_vector_classifier`  
- `/api/predict_random_forest_classifier`  
- `/api/predict_cluster_classifier`  
- `/api/recommend_product_association`  

## Development Highlights

- Unified API design for serving heterogeneous ML models  
- Integration of preprocessing pipelines within API endpoints  
- Implementation of association rule mining for real-world recommendations  
- Deployment using containerization and reverse proxy architecture  
- Demonstration of end-to-end ML system delivery beyond model training  


