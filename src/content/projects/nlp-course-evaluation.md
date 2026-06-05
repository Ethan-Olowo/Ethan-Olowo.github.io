---
title: "NLP-Powered Course Evaluation Analysis with Topic Modeling & Sentiment Classification"
description: "NLP pipeline to extract topics and sentiments from student course evaluations, with an interactive Gradio interface deployed on Hugging Face for real-time predictions."
tags: ["NLP", "Sentiment Analysis", "Topic Modeling"]
tools: ["Hugging Face"]
languages: ["Python"]
frameworks: ["Scikit-learn", "Gradio"]
liveUrl: "https://huggingface.co/spaces/EthanOlowo/BI_NLP_Lab"
coverImage: ""
order: 10
featured: true
draft: false
---

## Overview

This project applies Natural Language Processing (NLP) to analyze student course evaluations, extracting actionable insights for educators and administrators. It solves the problem of manually sifting through large volumes of feedback by automating topic and sentiment analysis.

## Problem Statement
Educational institutions receive large volumes of unstructured course feedback, making it difficult to identify key themes and overall sentiment efficiently.

## Solution & Features
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

