http://localhost:3000

---

**Endpoints:**

---

**POST /register**

http://localhost:3000/register

Parameters of the request:
  -	name (string, required): The name of the user.
  -	email (string, required): The user's email.
  -	password (string, required): The user's password.

Example:

    {
        "name": "Anastasiia Klishch",
				
        "email": "anastasiia.klshch@example.com",
				
        "password": "testpassword"
    }

Response codes:
   - 201 Created  { msg: 'User has been successfully registered', userId }
   - 400 Bad Request   { msg: 'The user already exists' }
   - 500 Internal Server Error  { msg: 'There was an error during registration', error: error.message }

---

**POST /login**

http://localhost:3000/login

Parameters of the request:
   - email (string, required): The user's email.
   - password (string, required): The user's password.

Example:

    {
        "email": "anastasiia.klshch@example.com",
        "password": "testpassword"
    }

Response codes:
   - 200 OK   { msg: 'Login successful', user: { id: user.id, name: user.name, email: user.email }
   - 400 Bad Request   { errors: errors.array() }
   - 401 Unauthorized   { msg: 'Invalid email or password' }
   - 403 Forbidden   { msg: 'Please verify your email before logging in' }
   - 404 Not Found   { msg: 'User not found' }
   - 500 Internal Server Error   { msg: 'Internal server error', error: error.message }

---

**POST /send-activation-link**

http://localhost:3000/send-activation-link

Parameters of the request:
   - email (string, required): The user's email.

Example:

    {
        "email": "anastasiia.klshch@example.com"
    }

Response codes:
   - 200 OK   { "message": "Activation link sent" }
   - 400 Bad Request   { "message": "Email is required" }
   - 500 Internal Server Error   { "message": "Error processing request", "error": "Error details" }

---

**GET /activate-account**

http://localhost:3000/activate-account?token=

Parameters of the request:
   - token (string, required): The activation token sent to the user's email.

Example:

    {
        "token": "exampleActivationToken"
    }

Response codes:
   - 200 OK   { "message": "Account activated successfully" }
   - 400 Bad Request   { "message": "Token is required" }   or   { "message": "Invalid or expired token" }   or   { "message": "Token expired" }   or   { "message": "User not found" }
   - 500 Internal Server Error   { "message": "Error processing request", "error": "Error details" }

---

**POST /send-password-reset-link**

http://localhost:3000/send-password-reset-link

Parameters of the request:
	-	email (string, required): The user's email.


Example:

		{
		    "email": "anastasiia.klshch@example.com"
		}


Response codes:
   - 200 OK   { "message": "Activation link sent" }
   - 400 Bad Request   { "message": "Email is required" }
   - 404 Not Found { msg: 'User not found' }
   - 500 Internal Server Error   { "message": "Error processing request", "error": "Error details" }

---

**POST /reset-password**

http://localhost:3000/reset-password?token=

Request Parameters
    - token (string, required): An activation token that was sent to the user via email.
    - newPassword (string, required): New users password.

 Example:

 	http://localhost:3000/reset-password?token=
	 
	{
 	   "newPassword": "newSecurePassword123"
	}
 
 Response codes:
   - 200 OK   { "message": "Password reset successful" }
   - 400 Bad Request   { "message": "Token is required" }   or   { "message": "Invalid or expired token" }   or   { "message": "Token expired" }
   - 404 Not Found { msg: 'User not found' }
   - 500 Internal Server Error   { "message": "Error processing request", "error": "Error details" }
