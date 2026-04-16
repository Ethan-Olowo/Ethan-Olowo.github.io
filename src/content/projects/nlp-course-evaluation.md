---
title: "NLP-Powered Course Evaluation Analysis with Topic Modeling & Sentiment Classification"
description: "Built an end-to-end NLP pipeline to extract topics and sentiments from student course evaluations, with an interactive Gradio interface deployed on Hugging Face for real-time predictions."
tags: ["Python", "NLP", "LDA", "Sentiment Analysis", "Gradio", "Hugging Face"]
liveUrl: "https://huggingface.co/spaces/EthanOlowo/BI_NLP_Lab"
coverImage: ""
order: 10
featured: true
draft: false
---

## Overview

This project applies Natural Language Processing techniques to analyze student course evaluations and extract meaningful insights for decision-making. It combines topic modeling and sentiment analysis to identify key themes discussed by students and assess their associated sentiments.

An interactive web interface, deployed via Hugging Face Spaces using Gradio, allows users to input new evaluation text and receive real-time predictions for both topic classification and sentiment, making the solution accessible to non-technical stakeholders.

## Features

- Topic modeling using Latent Dirichlet Allocation (LDA) to uncover key themes  
- Sentiment classification (positive, negative, neutral) using machine learning models  
- End-to-end NLP pipeline from preprocessing to prediction  
- Interactive Gradio-based interface for real-time user input and predictions  
- Deployment on Hugging Face Spaces for easy access and demonstration  
- Interpretation of results with data-driven recommendations  

## Tech Stack

- Python  
- Scikit-learn  
- NLP (Text preprocessing, feature extraction)  
- LDA (Topic Modeling)  
- Gradio  
- Hugging Face Spaces  

## System Workflow

- **Data Preprocessing:** Text cleaning, normalization, and feature engineering  
- **Topic Modeling:** LDA used to identify latent themes in course evaluations  
- **Sentiment Analysis:** Classification models trained and evaluated for sentiment prediction  
- **Interface Layer:** Gradio app for user interaction and real-time inference  
- **Deployment:** Hosted on Hugging Face Spaces for accessibility  

## Key Capabilities

- Accepts new textual course evaluations as input  
- Predicts the most relevant topic (theme) of the input  
- Classifies sentiment associated with the text  
- Provides an intuitive interface for non-technical users  

## Development Highlights

- Integrated unsupervised (LDA) and supervised (classification) learning approaches  
- Designed a user-friendly NLP interface for real-world usability  
- Connected analytical results to actionable insights for stakeholders  
- Demonstrated full ML lifecycle: preprocessing, modeling, evaluation, and deployment  

