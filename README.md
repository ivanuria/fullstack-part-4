# BLOG LIST fullstack-part-4

Exercises 4.1 to 4.9

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

### <span id="blog-object">Blog Object</span>

```js
blog {
  title: String,
  author: String,
  url: String,
  likes: Number
}
```

### Errors

- **e00000**:
Malformed ID
- **e00001**:
getValidationErrors used out of a mongoose schema validation
- **e00011**:
Title must be at least 3 characters long
- **e00021**:
Author name must be at least 3 characters long
- **e00031**:
Url must be at least 3 characters long
- **e00032**:
Url syntax must follow W3 URI rules [https://www.w3.org/Addressing/URL/uri-spec.html](https://www.w3.org/Addressing/URL/uri-spec.html)
