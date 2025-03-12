/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User(Student and Staff) API Related Functionalities
 */

/**
 * @swagger
 * /api/user/auth/signup:
 *   post:
 *     summary: "Sign Up User"
 *     description: "Registers a new user and sends a verification OTP to their email."
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: "User's email address"
 *               phone_number:
 *                 type: string
 *                 description: "User's phone number"
 *               role:
 *                 type: string
 *                 enum: [student, staff]
 *                 description: "Role of the user. Can be either 'student' or 'staff'."
 *             required:
 *               - email
 *               - phone_number
 *               - role
 *     responses:
 *       "201":
 *         description: "User signed up successfully and OTP sent to email."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "201"
 *                 message:
 *                   type: string
 *                   example: "User signed up successfully. Please verify the OTP sent to your email."
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         email:
 *                           type: string
 *                           format: email
 *                           description: "The email of the newly created user."
 *               required:
 *                 - status_code
 *                 - message
 *                 - data
 *       "400":
 *         description: "Bad Request - Missing required fields or duplicate email."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "400"
 *                 message:
 *                   type: string
 *                   example: "All fields are required: email, phone number, and role."
 *               required:
 *                 - status_code
 *                 - message
 *       "500":
 *         description: "Internal Server Error - Something went wrong while processing the request."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "500"
 *                 message:
 *                   type: string
 *                   example: "Internal server error, please try again later."
 *               required:
 *                 - status_code
 *                 - message
 */

/**
 * @swagger
 * /api/user/auth/signin:
 *   post:
 *     summary: "Sign In User"
 *     description: "Sends a one-time password (OTP) to the user's email for verification during sign-in."
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: "The email address of the user signing in."
 *             required:
 *               - email
 *     responses:
 *       "200":
 *         description: "OTP has been sent to the user's email for verification."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "OTP has been sent to your email. Please verify to continue."
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         email:
 *                           type: string
 *                           format: email
 *                           description: "The email of the user."
 *                         role:
 *                           type: string
 *                           description: "The role of the user (e.g., 'student', 'staff')."
 *               required:
 *                 - status_code
 *                 - message
 *                 - data
 *       "400":
 *         description: "Bad Request - Email is required for sign-in."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "400"
 *                 message:
 *                   type: string
 *                   example: "Email is required for sign-in."
 *               required:
 *                 - status_code
 *                 - message
 *       "404":
 *         description: "User not found - The email provided does not exist."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "404"
 *                 message:
 *                   type: string
 *                   example: "User does not exist. Please sign up first."
 *               required:
 *                 - status_code
 *                 - message
 *       "500":
 *         description: "Internal Server Error - Something went wrong while processing the request."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "500"
 *                 message:
 *                   type: string
 *                   example: "Internal server error, please try again later."
 *               required:
 *                 - status_code
 *                 - message
 */

/**
 * @swagger
 * /api/user/auth/verify-otp:
 *   post:
 *     summary: "Verify OTP for Authentication"
 *     description: "Verifies the OTP sent to the user's email and generates an access token upon successful verification."
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: "The email address of the user who is verifying the OTP."
 *               otp:
 *                 type: string
 *                 description: "The OTP code sent to the user's email."
 *             required:
 *               - email
 *               - otp
 *     responses:
 *       "200":
 *         description: "OTP verified successfully. Access token generated."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "OTP verified successfully. Access token generated."
 *                 data:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                       description: "The generated access token."
 *               required:
 *                 - status_code
 *                 - message
 *                 - data
 *       "400":
 *         description: "Bad Request - Missing email or OTP, OTP expired, or invalid OTP."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "400"
 *                 message:
 *                   type: string
 *                   example: "Email and OTP are required"
 *               required:
 *                 - status_code
 *                 - message
 *       "404":
 *         description: "User not found - The provided email does not exist."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "404"
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *               required:
 *                 - status_code
 *                 - message
 *       "500":
 *         description: "Internal Server Error - Something went wrong while processing the request."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "500"
 *                 message:
 *                   type: string
 *                   example: "Internal server error, please try again later."
 *               required:
 *                 - status_code
 *                 - message
 */

/**
 * @swagger
 * /api/user/auth/resend-otp:
 *   post:
 *     summary: "Resend OTP for Authentication"
 *     description: "Resends the OTP to the user's email if certain conditions are met, like waiting for the cooldown period."
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []  # This endpoint requires the user to be authenticated with JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: "The email address of the user requesting the OTP resend."
 *             required:
 *               - email
 *     responses:
 *       "200":
 *         description: "OTP resent successfully. Please check your email."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "OTP resent successfully. Please check your email."
 *               required:
 *                 - status_code
 *                 - message
 *       "400":
 *         description: "Bad Request - Missing email or no OTP associated with the user."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "400"
 *                 message:
 *                   type: string
 *                   example: "Email is required"
 *               required:
 *                 - status_code
 *                 - message
 *       "429":
 *         description: "Too Many Requests - User attempted to resend OTP before the cooldown period."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "429"
 *                 message:
 *                   type: string
 *                   example: "You can only resend the OTP after 60 seconds."
 *               required:
 *                 - status_code
 *                 - message
 *       "404":
 *         description: "Not Found - User does not exist."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "404"
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *               required:
 *                 - status_code
 *                 - message
 *       "500":
 *         description: "Internal Server Error - Something went wrong while processing the request."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "500"
 *                 message:
 *                   type: string
 *                   example: "Internal server error, please try again later."
 *               required:
 *                 - status_code
 *                 - message
 */

/**
 * @swagger
 * /api/user/auth/work-email/verify/send:
 *   post:
 *     summary: "Send Work Email Verification OTP"
 *     description: "Sends a verification OTP to the user's work email address if the user is a staff member and the email is valid."
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []  # This endpoint requires the user to be authenticated with JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               work_email:
 *                 type: string
 *                 format: email
 *                 description: "The work email address to verify."
 *             required:
 *               - work_email
 *     responses:
 *       "200":
 *         description: "Verification email sent successfully to work email."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "Verification email sent successfully to work email."
 *               required:
 *                 - status_code
 *                 - message
 *       "400":
 *         description: "Bad Request - Invalid work email format or work email already verified."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "400"
 *                 message:
 *                   type: string
 *                   example: "Invalid work email format"
 *               required:
 *                 - status_code
 *                 - message
 *       "403":
 *         description: "Forbidden - Only staff users can verify work email."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "403"
 *                 message:
 *                   type: string
 *                   example: "Only staff users can verify work email."
 *               required:
 *                 - status_code
 *                 - message
 *       "404":
 *         description: "Not Found - User does not exist."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "404"
 *                 message:
 *                   type: string
 *                   example: "User does not exist"
 *               required:
 *                 - status_code
 *                 - message
 *       "500":
 *         description: "Internal Server Error - Something went wrong while processing the request."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "500"
 *                 message:
 *                   type: string
 *                   example: "Internal server error, please try again later."
 *               required:
 *                 - status_code
 *                 - message
 */

/**
 * @swagger
 * /api/user/auth/work-email/verify:
 *   post:
 *     summary: "Verify Work Email OTP"
 *     description: "Verifies the OTP sent to the user's work email and marks the work email as verified."
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []  # This endpoint requires the user to be authenticated with JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 description: "The OTP to verify the work email."
 *             required:
 *               - otp
 *     responses:
 *       "200":
 *         description: "Work email verified successfully."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "Work email verified successfully"
 *               required:
 *                 - status_code
 *                 - message
 *       "400":
 *         description: "Bad Request - Invalid OTP or OTP expired."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "400"
 *                 message:
 *                   type: string
 *                   example: "Invalid OTP"
 *               required:
 *                 - status_code
 *                 - message
 *       "404":
 *         description: "Not Found - User does not exist."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "404"
 *                 message:
 *                   type: string
 *                   example: "User does not exist"
 *               required:
 *                 - status_code
 *                 - message
 *       "500":
 *         description: "Internal Server Error - Something went wrong while processing the request."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "500"
 *                 message:
 *                   type: string
 *                   example: "Internal server error, please try again later."
 *               required:
 *                 - status_code
 *                 - message
 */

/**
 * @swagger
 * /api/user/auth/work-email/resend-otp:
 *   post:
 *     summary: "Resend OTP to Work Email"
 *     description: "Resends the OTP to the user's work email for verification. This endpoint can only be used if the user's work email is not verified."
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []  # This endpoint requires the user to be authenticated with JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               work_email:
 *                 type: string
 *                 description: "The work email for which the OTP is being resent."
 *             required:
 *               - work_email
 *     responses:
 *       "200":
 *         description: "OTP resent successfully to the work email."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "OTP resent successfully"
 *               required:
 *                 - status_code
 *                 - message
 *       "400":
 *         description: "Bad Request - Work email is already verified or missing."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "400"
 *                 message:
 *                   type: string
 *                   example: "Work email already verified"
 *               required:
 *                 - status_code
 *                 - message
 *       "404":
 *         description: "Not Found - User does not exist."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "404"
 *                 message:
 *                   type: string
 *                   example: "User does not exist"
 *               required:
 *                 - status_code
 *                 - message
 *       "429":
 *         description: "Too Many Requests - OTP can only be resent after a minimum interval."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "429"
 *                 message:
 *                   type: string
 *                   example: "You can only resend the OTP after X seconds."
 *               required:
 *                 - status_code
 *                 - message
 *       "500":
 *         description: "Internal Server Error - Something went wrong while processing the request."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: string
 *                   example: "500"
 *                 message:
 *                   type: string
 *                   example: "Internal server error, please try again later."
 *               required:
 *                 - status_code
 *                 - message
 */

/**
 * @swagger
 * /api/user/vendors:
 *   get:
 *     summary: Retrieve all available vendors
 *     description: This endpoint retrieves a list of all available vendors with basic details such as name, contact number, operational hours, and profile image.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of vendors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Vendors retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     vendors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The unique identifier of the vendor
 *                             example: "609c72ef12e4c1289c7eae85"
 *                           name:
 *                             type: string
 *                             description: The name of the vendor
 *                             example: "Vendor XYZ"
 *                           contact_number:
 *                             type: string
 *                             description: The contact number of the vendor
 *                             example: "+123456789"
 *                           operational_hours:
 *                             type: string
 *                             description: The operational hours of the vendor
 *                             example: "9:00 AM - 6:00 PM"
 *                           profile_image:
 *                             type: string
 *                             description: The URL of the vendor's profile image
 *                             example: "http://example.com/profile_image.jpg"
 *       404:
 *         description: No vendors found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "No vendors found"
 *       500:
 *         description: "Internal Server Error – Something went wrong on the server"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /api/user/vendors/{vendorId}/menu:
 *   get:
 *     summary: Retrieve menus by vendor ID
 *     description: This endpoint retrieves all menu items for a specific vendor. You can optionally filter the menus by name using the `search` query parameter.
 *     tags:
 *       - User
 *     parameters:
 *       - name: vendorId
 *         in: path
 *         description: The unique identifier of the vendor
 *         required: true
 *         schema:
 *           type: string
 *           example: "609c72ef12e4c1289c7eae85"
 *       - name: search
 *         in: query
 *         description: A search term to filter menu items by name (optional)
 *         required: false
 *         schema:
 *           type: string
 *           example: "pizza"
 *     responses:
 *       200:
 *         description: Successfully retrieved the menus for the specified vendor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "All menus retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     vendor:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: The unique identifier of the vendor
 *                           example: "609c72ef12e4c1289c7eae85"
 *                         name:
 *                           type: string
 *                           description: The name of the vendor
 *                           example: "Vendor XYZ"
 *                     menu:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The unique identifier of the menu item
 *                             example: "609c72ef12e4c1289c7eae86"
 *                           name:
 *                             type: string
 *                             description: The name of the menu item
 *                             example: "Pizza"
 *                           image:
 *                             type: string
 *                             description: The URL of the menu item's image
 *                             example: "http://example.com/pizza.jpg"
 *                           price:
 *                             type: number
 *                             description: The price of the menu item
 *                             example: 12.99
 *       400:
 *         description: Invalid vendor ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid vendor ID"
 *       404:
 *         description: Vendor not found or no menus found for the vendor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "No menus found for this vendor"
 *       500:
 *         description: "Internal Server Error – Something went wrong on the server"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /api/user/cart:
 *   post:
 *     summary: Add an item to the user's cart
 *     description: This endpoint allows a user to add a menu item to their cart, updating the quantity if the item is already in the cart.
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menu_id
 *               - quantity
 *             properties:
 *               menu_id:
 *                 type: string
 *                 description: The unique identifier of the menu item to add to the cart
 *                 example: "609c72ef12e4c1289c7eae86"
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the menu item to add
 *                 example: 2
 *     responses:
 *       200:
 *         description: Successfully added the item to the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Item added to cart"
 *                 data:
 *                   type: object
 *                   properties:
 *                     cart:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           menu:
 *                             type: string
 *                             description: The menu item ID
 *                             example: "609c72ef12e4c1289c7eae86"
 *                           quantity:
 *                             type: integer
 *                             description: The quantity of the menu item
 *                             example: 2
 *       400:
 *         description: Invalid User ID, Menu Item ID, or Quantity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid User ID or Menu Item ID"
 *       404:
 *         description: Menu item not found or currently unavailable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Menu item not found or currently unavailable"
 *       500:
 *         description: "Internal Server Error – Something went wrong on the server"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /api/user/cart:
 *   get:
 *     summary: Retrieve the items in the user's cart
 *     description: This endpoint allows a user to retrieve their cart items, including the vendor, menu item details, and quantity. It also calculates the total cart price.
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Cart items retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     cart_total:
 *                       type: number
 *                       description: The total price of the cart
 *                       example: 1500
 *                     currency:
 *                       type: string
 *                       description: The currency used for the cart total
 *                       example: "NGN"
 *                     cart:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           vendor_name:
 *                             type: string
 *                             description: The name of the vendor offering the menu item
 *                             example: "Vendor Name"
 *                           menu_id:
 *                             type: string
 *                             description: The unique identifier of the menu item
 *                             example: "609c72ef12e4c1289c7eae86"
 *                           menu_image:
 *                             type: string
 *                             description: The URL of the menu item's image
 *                             example: "http://example.com/menu-image.jpg"
 *                           menu_name:
 *                             type: string
 *                             description: The name of the menu item
 *                             example: "Menu Item Name"
 *                           menu_price:
 *                             type: number
 *                             description: The price of the menu item
 *                             example: 500
 *                           quantity:
 *                             type: integer
 *                             description: The quantity of the menu item in the cart
 *                             example: 2
 *       400:
 *         description: Invalid or missing User ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid User ID or Menu Item ID"
 *       404:
 *         description: User's cart not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Cart not found"
 *       500:
 *         description: "Internal Server Error – Something went wrong on the server"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /api/user/cart:
 *   delete:
 *     summary: Clear the user's cart
 *     description: This endpoint allows a user to clear all items from their cart.
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully cleared the user's cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Cart cleared successfully"
 *       400:
 *         description: Invalid or missing User ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid User ID"
 *       404:
 *         description: Cart not found for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Cart not found"
 *       500:
 *         description: "Internal Server Error – Something went wrong on the server"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /api/user/cart/{menuId}:
 *   delete:
 *     summary: Remove an item from the user's cart
 *     description: This endpoint allows a user to remove a specific item from their cart by the menu item ID.
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: menuId
 *         in: path
 *         description: The ID of the menu item to remove from the cart.
 *         required: true
 *         schema:
 *           type: string
 *           example: "605c72ef153207001f6b15f"
 *     responses:
 *       200:
 *         description: Successfully removed the item from the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Item removed from cart successfully"
 *       400:
 *         description: Invalid or missing User ID or Menu Item ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid User ID or Menu Item ID"
 *       404:
 *         description: Cart not found or Item not found in the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Cart not found"
 *       500:
 *         description: "Internal Server Error – Something went wrong on the server"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /api/user/checkout:
 *   get:
 *     summary: Retrieve user's checkout information
 *     description: This endpoint allows the user to retrieve the summary of their checkout, including item details, total cost, vendor breakdown, and service charges.
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved checkout data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Checkout data retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     order_total:
 *                       type: number
 *                       example: 1200
 *                     total_items_ordered:
 *                       type: integer
 *                       example: 3
 *                     vendor_count:
 *                       type: integer
 *                       example: 2
 *                     cart_total:
 *                       type: number
 *                       example: 1000
 *                     service_charge:
 *                       type: number
 *                       example: 50
 *                     currency:
 *                       type: string
 *                       example: "NGN"
 *                     cart:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           vendor_id:
 *                             type: string
 *                             example: "605c72ef153207001f6b15f"
 *                           vendor:
 *                             type: string
 *                             example: "Vendor A"
 *                           items:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 menu:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: string
 *                                       example: "605c72ef153207001f6b15f"
 *                                     name:
 *                                       type: string
 *                                       example: "Item 1"
 *                                     description:
 *                                       type: string
 *                                       example: "Delicious food item"
 *                                     price:
 *                                       type: number
 *                                       example: 500
 *                                     image:
 *                                       type: string
 *                                       example: "https://example.com/image.jpg"
 *                                 quantity:
 *                                   type: integer
 *                                   example: 2
 *                                 total_price:
 *                                   type: number
 *                                   example: 1000
 *                           vendor_total:
 *                             type: number
 *                             example: 1000
 *       400:
 *         description: Invalid User ID or other input errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid User ID or Menu Item ID"
 *       404:
 *         description: Cart not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Cart not found"
 *       500:
 *         description: "Internal Server Error – Something went wrong on the server"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /api/user/place-order:
 *   post:
 *     summary: Place an order
 *     description: Allows a user to place an order from their cart. Groups items by vendor, calculates charges, and initializes payment.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - service_type
 *               - address
 *             properties:
 *               service_type:
 *                 type: string
 *                 enum: ["delivery", "pickup"]
 *                 example: "delivery"
 *               address:
 *                 type: string
 *                 example: "123 Main Street, City, Country"
 *     responses:
 *       201:
 *         description: Order placed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Order placed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     order_total:
 *                       type: number
 *                       example: 2000.0
 *                     total_items_ordered:
 *                       type: integer
 *                       example: 10
 *                     vendor_count:
 *                       type: integer
 *                       example: 2
 *                     cart_total:
 *                       type: number
 *                       example: 1800.0
 *                     delivery_fee:
 *                       type: number
 *                       example: 500
 *                     service_charge:
 *                       type: number
 *                       example: 100.0
 *                     payment_data:
 *                       type: object
 *                       properties:
 *                         reference:
 *                           type: string
 *                           example: "TXN123456"
 *                     orders:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "64d7c6f9b12e3b003c9c2bda"
 *                           vendor:
 *                             type: string
 *                             example: "64d7c6f9b12e3b003c9c2bdd"
 *                           total_price:
 *                             type: number
 *                             example: 1200.0
 *       400:
 *         description: Bad request due to missing or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Your cart is empty"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "User not found!"
 *       500:
 *         description: Internal server error during payment initialization.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Error during payment initialization. Orders have been rolled back."
 */

/**
 * @swagger
 * /api/user/orders/{orderId}/confirm-collected:
 *   post:
 *     summary: Confirm collection of a pickup order. Applicable only to orders with a service type of "pickup."
 *     description: This endpoint allows users to confirm that their pickup order has been collected. The order status will be updated to "collected" if the order is valid and meets the necessary conditions.
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: The ID of the order to confirm as collected.
 *         schema:
 *           type: string
 *           example: "605c72ef153207001f6b15f"
 *     responses:
 *       200:
 *         description: Order confirmed as collected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Order Collected Successfully"
 *       400:
 *         description: Invalid request. The order could not be confirmed as collected due to one of the following reasons.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Order is already collected or delivered"
 *                 reasons:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "Invalid User ID or Order ID"
 *                     - "Order is already collected or delivered"
 *                     - "Not a pickup order"
 *                     - "Order is not in the 'ready for pickup' status"
 *       404:
 *         description: Order not found or does not belong to the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Order not found or does not belong to this user"
 *       500:
 *         description: "Internal Server Error – Something went wrong on the server"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
