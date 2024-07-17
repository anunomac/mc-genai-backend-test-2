# Sentiment Analysis Backend

This project is an alternate backend for [mc-genai-backend-test](https://github.com/anunomac/mc-genai-backend-test), originally implemented in Django. This version is implemented using Node.js, Express, MongoDB, and RabbitMQ.

## Table of Contents

- [Getting Started](#getting-started)

- [Prerequisites](#prerequisites)

- [Installation](#installation)

- [Running the Application](#running-the-application)

- [API Endpoints](#api-endpoints)

- [Project Structure](#project-structure)

- [Important Notes](#Important-notes)

## Getting Started

These instructions will guide you through setting up and running the project on your local machine for development and testing purposes.

## Prerequisites

- Node.js

- MongoDB

- RabbitMQ

## Installation

1. Clone the repository:

```sh

git clone https://github.com/repo/sentiment-analysis-backend.git

cd sentiment-analysis-backend

```

2. Install dependencies:

```sh

npm install

```

3. Ensure MongoDB is running on your local machine:
[Install and run mongoDB](https://www.mongodb.com/docs/manual/installation/)

4. Ensure RabbitMQ is running on your local machine:
refer to [mc-genai-backend-test](https://github.com/anunomac/mc-genai-backend-test) for instructions

## Running the Application

1. Start the server:

```sh

node app.js

```

The server will start on port 8000 by default. You should see messages indicating that the server is running and connected to MongoDB and RabbitMQ.

## API Endpoints
The endpoints are the same as [mc-genai-backend-test](https://github.com/anunomac/mc-genai-backend-test)

  
## Important Notes  
  
- It is not possible to load all the models provided by Hugging Face on the transformers.js library. For reference, use this list: [Transformers.js compatible models](https://huggingface.co/models?library=transformers.js&sort=trending&search=sentiment).  
- Errors and logs are not handled as gracefully as in the main submission.  
- I opted to use RabbitMQ to handle the queue. While it is less popular with Node.js, it is the same message broker used with the Django backend, reducing the amount of external dependencies needed to run both projects.  
- I opted to use MongoDB over an SQL database due to its popularity with Node.js applications.  
- Both RabbitMQ and MongoDB choices were influenced by my own code reusability.  