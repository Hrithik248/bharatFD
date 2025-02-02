# FAQ Management API

This project implements a REST API for managing Frequently Asked Questions (FAQs) with multilingual support, caching, and a user-friendly interface using AdminJS.

## Overview

This API allows you to create, retrieve, update, and delete FAQs. It supports translations in English, Hindi, and Bengali, with a fallback to English if a translation is unavailable. FAQs and their translations are cached using Redis for improved performance. AdminJS is integrated to provide a user-friendly interface for managing FAQs and their translations, including a WYSIWYG editor.

## Features

- **Multilingual Support:** FAQs can be stored and retrieved in English, Hindi, and Bengali.
- **Caching:** Redis is used to cache FAQs and their translations, significantly improving response times.
- **RESTful API:** A clean and well-documented REST API for managing FAQs.
- **Admin Panel:** AdminJS is integrated to provide a user-friendly interface for managing FAQs. This includes features for creating, reading, updating, and deleting FAQs, as well as managing translations.
- **WYSIWYG Editor Integration:** The AdminJS interface provides a WYSIWYG editor for composing FAQ answers, allowing for rich text formatting.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Redis
- `google-translate-api`
- AdminJS
- ESLint (for linting)
- Mocha/Chai (for testing)

## Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/Hrithik248/bharatFD.git
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Configure environment variables:

    Create a `.env` file in the root directory and add the following environment variables:

    ```bash
    GOOGLE_CLOUD_PROJECT_ID=your-project-id
    GOOGLE_APPLICATION_CREDENTIALS=path/to/your/serviceAccountKey.json
    ```

4.  Start the Redis server:

    ```bash
    redis-server
    ```

5.  Start the server:

    ```bash
    npm start
    ```

## Admin Interface

To access the AdminJS interface, navigate to `/admin` after starting the server. You will be able to manage all FAQs and their translations through this interface. Refer to the AdminJS documentation for details on its features and customization options.

## API Usage

The REST API is still available and can be used programmatically. The AdminJS interface provides a convenient way to manage FAQs through a web browser, but the API remains useful for integration with other systems.

### Retrieving FAQs

- **Get all FAQs (English - default language):**

  ```bash
  curl http://localhost:7777/api/faqs
  ```

- **Get all FAQs (Hindi):**

  ```bash
  curl http://localhost:7777/api/faqs?lang=hi
  ```

- **Get all FAQs (Bengali):**

  ```bash
  curl http://localhost:7777/api/faqs?lang=bn
  ```

- **Get a specific FAQ:**

  ```bash
  curl http://localhost:7777/api/faqs/[faq_id]
  ```

- **Get a specific FAQ (Hindi):**

  ```bash
  curl http://localhost:7777/api/faqs/[faq_id]?lang=hi
  ```

### Creating a FAQ

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "question": "What is the meaning of life?",
  "answer": "42"
}' http://localhost:7777/api/faqs
```

### Updating a FAQ

```bash
curl -X PATCH -H "Content-Type: application/json" -d '{
  "answer": "The updated answer goes here."
}' http://localhost:7777/api/faqs/[faq_id]
```

### Deleting a FAQ

```bash
curl -X DELETE http://localhost:7777/api/faqs/[faq_id]
```

## Testing

Unit tests are written using Mocha, Chai, and Sinon to ensure the API functions as expected. To run the tests, execute:

```bash
npm test
```

The tests cover scenarios for retrieving, creating, updating, and deleting FAQs.

## Git & Version Control

The project uses Git for version control. Commit messages follow conventional commit standards. Examples include:

- `feat: Add multilingual FAQ model.`
- `fix: Improve caching mechanism.`
- `docs: Update README with API examples.`

This practice ensures that commit history is clean and changes are well documented.

## Contribution Guidelines

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Ensure your code meets the ESLint standards.
4.  Write unit tests for any new functionality.
5.  Submit a pull request with clear commit messages and a detailed description of your changes.
