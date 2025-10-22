# NestJS Clean Architecture

This project is a NestJS application built with Clean Architecture principles. It serves as a forum/Q&A system where users can ask questions, provide answers, and engage in discussions.

## Technologies Used

* **Framework:** NestJS
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Testing:** Vitest
* **Validation:** Zod

## Getting Started

To get started with the project, you'll need to have Node.js, npm, and Docker installed.

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up the database:**
   ```bash
   npm run prisma:migrate:dev
   ```
4. **Run the application:**
   ```bash
   npm run start:dev
   ```

## Project Structure

This project follows the principles of Clean Architecture, organizing the code into three main layers:

* **`core`:** This layer contains the core business logic and entities of the application. It is independent of any external frameworks or libraries.
* **`domain`:** This layer contains the application-specific business rules. It depends on the `core` layer but not on the `infra` layer.
* **`infra`:** This layer is responsible for implementing the interfaces defined in the `domain` layer. It contains the code that interacts with external systems, such as databases, APIs, and message queues.

## Domain Layer

The `domain` layer is divided into the following sub-domains:

* **`forum`:** This sub-domain contains the core business logic for the forum/Q&A system. It includes the following entities:
    * `Question`
    * `Answer`
    * `Comment`
    * `Attachment`
    * `Student`
    * `Instructor`
* **`notification`:** This sub-domain is responsible for handling notifications within the application.

## API Endpoints

The following are the main API endpoints provided by the application:

### Authentication

* **`POST /accounts`**: Create a new account
* **`POST /sessions`**: Authenticate a user

### Questions

* **`GET /questions`**: Fetch recent questions
* **`GET /questions/:slug`**: Get a question by slug
* **`POST /questions`**: Create a new question
* **`PUT /questions/:id`**: Edit a question
* **`DELETE /questions/:id`**: Delete a question

### Answers

* **`POST /questions/:questionId/answers`**: Answer a question
* **`PUT /answers/:id`**: Edit an answer
* **`DELETE /answers/:id`**: Delete an answer

### Comments

* **`POST /questions/:questionId/comments`**: Comment on a question
* **`POST /answers/:answerId/comments`**: Comment on an answer
* **`DELETE /comments/:id`**: Delete a comment
