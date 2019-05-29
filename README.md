

## SIMPLE BLOG API DOCUMENTATION

### Authentication

* #### Login

      POST /auth/login
      {
        "email": "email@example.com",
        "password: "a_very_secret_password"
      }

  response example

      {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFhMzJlY2E4LWI1NmUtNGFhNi04YWMyLTBhMzJhOGY3ZTcwNSIsInJvbGVzIjowLCJpYXQiOjE1NTkxMjUxMzMsImV4cCI6MTU1OTEyODczM30.jn75VDgYEE0OGCrziYn1vzonaG3qk_Gm67_-LPolaes",
        "expiresIn": 3600
      }

* #### Signup

      POST /auth/signup
      {
        "email": "email@example.com",
        "username: "johndoe",
        "password: "a_very_secret_password"
      }
---

### Articles

NOTE : All of the following requests need to be authorized via bearer tokens

* #### Get all articles

      GET /article

  response example

      [
        {
          "id": "8e828fb2-17d4-4046-8552-c1e2d19449ed",
          "title": "Test article",
          "content": "Hello World",
          "created": "2019-05-29T10:24:46.082Z",
          "updated": "2019-05-29T10:31:28.000Z",
          "likes": 1,
          "comments": [
            {
              "id": "42769810-1e84-4340-aa57-81b22207be6b",
              "content": "Hello World",
              "created": "2019-05-29T11:04:10.463Z",
              "user": {
                "username": "dogganidhal"
              }
            }
          ]
        }
      ]

* #### Get article details

      GET /article/:id

  response example

      {
        "id": "8e828fb2-17d4-4046-8552-c1e2d19449ed",
        "title": "Test article",
        "content": "Hello World",
        "created": "2019-05-29T10:24:46.082Z",
        "updated": "2019-05-29T10:31:28.000Z",
        "likes": 1,
        "comments": [
          {
            "id": "42769810-1e84-4340-aa57-81b22207be6b",
            "content": "Hello World",
            "created": "2019-05-29T11:04:10.463Z",
            "user": {
              "username": "dogganidhal"
            }
          }
        ]
      }

* #### Create article

      POST /article/:id
      {
        "title": "Test edited article",
        "content": "Hello World"
      }

* #### Edit article

      PUT /article/:id
      {
        "title": "Test edited article",
        "content": "Hello World"
      }

* #### Like article

      PUT /article/like/:id

* #### Comment article

      POST /article/comment/:id
      {
        "content": "Test comment"
      }