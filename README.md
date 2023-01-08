# MINI-MICROSERVICES APP

### A simple application designed to showcase the principles of modern microservice applications

## Client:

A React.js application that allows user to create posts and comments, then displays posts and comments.

<img width="1792" alt="Screenshot 2023-01-08 at 3 11 30 AM" src="https://user-images.githubusercontent.com/49429928/211186611-9c9a8c4f-4fee-4e0a-92fe-19870a9caa97.png">

---

# Services

- ## **Comments**

  This service is responsible for creating and moderating comments for posts.

  ## Endpoints

  ### GET `/posts/:id/comments`

  This endpoint retrieves the comments for a post with a given `id`.

  #### Response

  If successful, this endpoint returns an array of comment objects in the following format:

  ```json
  [
    {
        "id": "comment-id",
        "content": "comment content",
        "status": "comment status"
    },
    ...
  ]
  ```

  ### POST `/posts/:id/comments`

  This endpoint creates a new comment for a post with a given `id`.

  #### Request Body

  The request body should contain a JSON object with the following format:

  ```json
  {
    "content": "comment content"
  }
  ```

  #### Response

  If successful, this endpoint returns the array of comments for the post, including the newly created comment, in the following format:

  ```json
  [
      {
          "id": "comment-id",
          "content": "comment content",
          "status": "pending"
      },
      ...
  ]
  ```

  ### POST `/events`

  This endpoint is for consuming events from the event bus. It listens for `CommentModerated` events and updates the status of a comment accordingly.

  #### **Request Body**

  The request body should contain a JSON object with the following format:

  ```json
  {
    "type": "CommentModerated",
    "data": {
      "postId": "post-id",
      "id": "comment-id",
      "status": "comment status",
      "content": "comment content"
    }
  }
  ```

  #### **Response**

  If successful, this endpoint returns an empty object.

  ## _Implementation Details_

  - This service uses an in-memory data store to store comments by post id.
  - When a new comment is created, it sends a `CommentCreated` event to the event bus.
  - When a `CommentModerated` event is received, the service updates the status of the corresponding comment and sends a `CommentUpdated` event to the event bus.

- ## **Event Bus**

  This service acts as a central hub for events in the microservices architecture. It receives events from other services and broadcasts them to all other services.

  ## Endpoints

  ### POST `/events`

  This endpoint receives events from other services.

  #### **Request Body**

  The request body should contain a JSON object representing the event. The format of the object will depend on the type of event being sent.

  #### **Response**

  If successful, this endpoint returns a JSON object with the following format:

  ```json
  {
    "status": "OK"
  }
  ```

  ### GET `/events`

  This endpoint retrieves a list of all events that have been received by the event bus.

  #### **Response**

  If successful, this endpoint returns an array of event objects in the following format:

  ```json
  [
      {
          "eventType": "event-type",
          "eventData": {
              "event-data-property": "event-data-value"
          }
      },
      ...
  ]
  ```

  ## _Implementation Details_

  - This service maintains a list of events in memory.
  - When it receives an event, it broadcasts the event to all other services and adds the event to its list of events.

- ## **Moderation**

  This service is responsible for moderating comments. It listens for `CommentCreated` events and approves or rejects the comment based on whether it contains the word "orange".

  ## Endpoints

  ### POST `/events`

  This endpoint receives events from the event bus. It listens for `CommentCreated` events and moderates the corresponding comments.

  #### **Request Body**

  The request body should contain a JSON object with the following format:

  ```json
  {
    "type": "CommentCreated",
    "data": {
      "id": "comment-id",
      "postId": "post-id",
      "content": "comment content"
    }
  }
  ```

  #### **Response**

  If successful, this endpoint returns an empty object.

  ## _Implementation Details_

  - When this service receives a `CommentCreated` event, it checks the content of the comment for the word "orange".
  - If the word "orange" is present, it sends a `CommentModerated` event to the event bus with a status of "rejected".
  - If the word "orange" is not present, it sends a `CommentModerated` event to the event bus with a status of "approved".

- ## **Posts**

  This service is responsible for managing posts. It has the following functionality:

  - Creating new posts
  - Retrieving a list of all posts

  ## Endpoints

  ### GET `/posts`

  This endpoint retrieves a list of all posts.

  #### **Response**

  If successful, this endpoint returns an object where the keys are post ids and the values are post objects in the following format:

  ```json
  {
      "post-id-1": {
          "id": "post-id-1",
          "title": "post title"
      },
      "post-id-2": {
          "id": "post-id-2",
          "title": "post title"
      },
      ...
  }
  ```

  ### POST `/posts`

  This endpoint creates a new post.

  #### **Request Body**

  The request body should contain a JSON object with the following format:

  ```json
  {
    "title": "post title"
  }
  ```

  #### **Response**

  If successful, this endpoint returns the newly created post object in the following format:

  ```json
  {
    "id": "post-id",
    "title": "post title"
  }
  ```

  ### POST `/events`

  This endpoint is for consuming events from the event bus. It currently does not do anything with the events it receives.

  #### **Request Body**

  The request body should contain a JSON object representing the event. The format of the object will depend on the type of event being sent.

  #### **Response**

  If successful, this endpoint returns an empty object.

  ## _Implementation Details_

  - This service maintains a list of posts in memory.
  - When a new post is created, it sends a `PostCreated` event to the event bus.

- ## **Query**

  This service is responsible for querying data from the other services in the microservices architecture. It maintains a copy of the data in memory and updates its copy when it receives events from the event bus.

  ## Endpoints

  ### GET `/posts`

  This endpoint retrieves a list of all posts and their associated comments.

  #### **Response**

  If successful, this endpoint returns an object where the keys are post ids and the values are post objects in the following format:

  ```json
  {
      "post-id-1": {
          "id": "post-id-1",
          "title": "post title",
          "comments": [
              {
                  "id": "comment-id-1",
                  "content": "comment content",
                  "status": "approved"
              },
              ...
          ]
      },
      "post-id-2": {
          "id": "post-id-2",
          "title": "post title",
          "comments": [
              {
                  "id": "comment-id-2",
                  "content": "comment content",
                  "status": "approved"
              },
              ...
          ]
      },
      ...
  }
  ```

  ### POST `/events`

  This endpoint is for consuming events from the event bus. It updates its copy of the data based on the events it receives.

  #### **Request Body**

  The request body should contain a JSON object representing the event. The format of the object will depend on the type of event being sent.

  #### **Response**

  If successful, this endpoint returns an empty object.

  ## _Implementation Details_

  - This service maintains a copy of the data in memory.
  - When it starts up, it retrieves a list of past events from the event bus and processes them to initialize its data.
  - When it receives an event from the event bus, it updates its data accordingly.
