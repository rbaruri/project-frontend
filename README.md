NerdNest – Frontend

The frontend application for NerdNest, an AI-powered Learning Management System designed to help students organize their learning journey through syllabus-based study resources, timeline-based quizzes, and performance tracking.

Tech Stack

* Framework: React
* Language: TypeScript
* State Management: Redux-Saga
* API Communication: GraphQL
* Backend Integration: Hasura
* Database: PostgreSQL (through the backend)

Core Features

1. Syllabus Upload

* Provide an interface for students to upload academic syllabi.
* Integrate with backend document-processing workflows.
* Display processed syllabus information.

2. AI-Powered Study Resources

* Display curated study links generated from syllabus content.
* Organize learning resources to help students follow their academic curriculum.

3. Timeline-Based Quizzes

* Present quizzes based on the learning timeline.
* Provide an interface for students to attempt assessments.
* Display assessment results.

4. Performance Tracking

* Display student learning progress.
* Track quiz and assessment performance.
* Present automatically generated performance reports.

Architecture

             React Application
                    |
                    v
              TypeScript
                    |
                    v
               Redux-Saga
                    |
                    v
             GraphQL Client
                    |
                    v
                Hasura
                    |
                    v
              PostgreSQL

State Management

Redux-Saga manages asynchronous application workflows, including API interactions and other side effects.

Backend Integration

The frontend communicates with the backend through Hasura’s GraphQL APIs.

These APIs support:

* Application data retrieval.
* Syllabus-related workflows.
* Learning resource data.
* Quiz and assessment data.
* Student performance information.

Getting Started

Clone the repository:

git clone <FRONTEND_REPOSITORY_URL>
cd <FRONTEND_DIRECTORY>

Install dependencies:

npm install

Configure the GraphQL endpoint and other required environment variables.

Start the development server:

npm start

Update the development command and environment variable names according to the actual project configuration.

Project Goals

* Provide an intuitive learning experience.
* Make syllabus-based learning easier to manage.
* Help students access relevant study resources.
* Encourage continuous assessment.
* Make learning progress measurable and accessible.
