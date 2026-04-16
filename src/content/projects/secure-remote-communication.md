---
title: "Secure Remote Communication System with AES Encryption"
description: "Developed a secure messaging system using AES symmetric encryption with OTP-based key delivery via SMS simulation, enabling confidential communication between remote devices."
tags: ["Python", "AES Encryption", "Flask", "PyQt6", "Networking"]
githubUrl: "https://github.com/Ethan-Olowo/secure_remote_com"
coverImage: ""
order: 4
featured: false
draft: false
---

## Overview

This project is a secure remote communication system designed to enable confidential message exchange between two devices over a network. It uses AES symmetric encryption to protect message content and implements an OTP-based key transfer mechanism via SMS (simulated) to ensure secure decryption.

The system combines encryption, networking, and a graphical user interface to provide an end-to-end secure messaging workflow, including device discovery, message transmission, and controlled decryption.

## Features

- AES-based encryption and decryption for secure message handling  
- OTP-based key delivery via simulated SMS for secure key exchange  
- End-to-end automated workflow (encryption, transmission, decryption)  
- Local network device discovery for selecting communication targets  
- Built-in Flask server for receiving and storing encrypted messages  
- User-friendly GUI built with PyQt6 for sending and receiving messages  
- Server control (start/stop) directly from the interface  

## Tech Stack

- Python  
- AES (Symmetric Encryption)  
- Flask  
- PyQt6  
- Socket/Network Scanning  