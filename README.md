# BLOG LIST fullstack-part-4

Exercises 4.1 to 4.17

## ENV Variables

- PORT:
port to set the app to
- MONGODB_URI:
connection url to mongoDB

## API

### Index of endpoints

- **GET /api/blogs**:
return list of all posts in blog
- **POST /api/blogs**:
appends new post to blog. [see model](#blog-object)
- **GET /api/blogs/:id**:
returns blog post with requested id
- **DELETE /api/blogs/:id**:
deletes blog post with requested id
- **PUT /api/blogs/:id**:
updates blog post with requested id with given information. [see model](#blog-object)
- **POST /api/users**:
appends new user to app. [see model](#user-object)

### <span id="blog-object">Blog Object</span>

```js
blog {
  title: String,
  author: String,
  url: String,
  likes: Number
}
```

### <span id="user-object">User Object</span>

```js
user {
  user: String,
  name: String,
  password: String
}
```

### Errors

- **ValidationErrors**:
Check key ValidationErrors with array of errors
- **e00000**:
Malformed ID
- **e00010**:
Title is required
- **e00011**:
Title must be at least 3 characters long
- **e00021**:
Author name must be at least 3 characters long
- **e00030**:
Url is required
- **e00031**:
Url must be at least 3 characters long
- **e00032**:
Url syntax must follow W3 URI rules [https://www.w3.org/Addressing/URL/uri-spec.html](https://www.w3.org/Addressing/URL/uri-spec.html)
- **e00040**:
Username is required
- **e00041**:
Username must be at least 3 characters long
- **e00043**:
Username must be unique
- **e00050**:
Name is required
- **e00051**:
Name must be at least 3 characters long
- **e00060**:
Password is required
- **e00061**:
Password must be at least 3 characters long
