# Cookies
- JWT
    - User id can be obtained from this auth jwt. Decoding the auth jwt will reveal the key "sub." It's value will be user_id.

# API Docs
## Auth
### /api/auth/register
- **Method: POST**
- Register a new user
- Data
    - string: name
    - string: email
    - string: pw

### /api/auth/login
- **Method: POST**
- Login a user and obtain auth JWT
- Data
    - string: email
    - string: pw

## User
### /api/user/*id*/courses
- **Method: GET**
- JWT REQURIED
- Get user *id* 's courses owned and enrolled

### /api/user/*user_id*/enroll/*course_id*
- **Method: PUT**
- JWT REQURIED
- Enroll user *user_id* in course *course_id*

### /api/user/*user_id*/delete
- **Method: POST**
- JWT REQURIED
- Delete user *user_id*
- Data
    - string: email
    - string: pw

## Course
### /api/course
- **Method: GET**
- Get list of all courses with their info

### /api/course/tags
- **Method: GET**
- Get list of all tags

### /api/course/add
- **Method: POST**
- JWT REQURIED
- Add a course
- Data
    - int: user_id (course owner)
    - string: title
    - string: description
    - string: tags

## Compiler
- **Method: POST**
- JWT REQURIED
- Compile code from specified language and obtain output
- Data
    - int: id (of language as per judge0 docs)
    - string: code
