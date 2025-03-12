/**
 * @swagger
 * /api/rider/auth/sign-up:
 *   post:
 *     summary: Sign up a new rider
 *     description: This endpoint allows a new rider to sign up with their personal details and proof of identity. Upon successful sign-up, the rider will receive an access token to authenticate further requests.
 *     tags:
 *       - Rider
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: email
 *         in: formData
 *         required: true
 *         description: The email of the rider.
 *         schema:
 *           type: string
 *           example: "john.doe@example.com"
 *       - name: password
 *         in: formData
 *         required: true
 *         description: The password for the rider's account.
 *         schema:
 *           type: string
 *           example: "password123"
 *       - name: phone
 *         in: formData
 *         required: true
 *         description: The phone number of the rider.
 *         schema:
 *           type: string
 *           example: "+1234567890"
 *       - name: first_name
 *         in: formData
 *         required: true
 *         description: The first name of the rider.
 *         schema:
 *           type: string
 *           example: "John"
 *       - name: last_name
 *         in: formData
 *         required: true
 *         description: The last name of the rider.
 *         schema:
 *           type: string
 *           example: "Doe"
 *       - name: address
 *         in: formData
 *         required: true
 *         description: The address of the rider.
 *         schema:
 *           type: string
 *           example: "123 Main Street, City, Country"
 *       - name: emergency_contact_name
 *         in: formData
 *         required: true
 *         description: The name of the emergency contact.
 *         schema:
 *           type: string
 *           example: "Jane Doe"
 *       - name: emergency_contact_number
 *         in: formData
 *         required: true
 *         description: The phone number of the emergency contact.
 *         schema:
 *           type: string
 *           example: "+0987654321"
 *       - name: proof_of_identity
 *         in: formData
 *         required: true
 *         type: file
 *         description: The proof of identity file (e.g., a PDF or DOCX file).
 *     responses:
 *       201:
 *         description: Rider registered successfully
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
 *                   example: "Rider registered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     rider:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "605c72ef153207001f6b15f"
 *                         email:
 *                           type: string
 *                           example: "john.doe@example.com"
 *                         role:
 *                           type: string
 *                           example: "rider"
 *                     access_token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwN2JkZTkwLTlmY2UtNGNlOS04ZDYwLWRmOGExZDdhYTkzNiIsImVtYWlsIjoiam9obi5kb2VAY29tLmNvbSIsInJvbGUiOiJyaWRlciJ9.-vH9eEyYp8ns4xtSTbYihv8XpoOBpEVZWk45msltgCU"
 *       400:
 *         description: Invalid request due to missing or incorrect data
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
 *                   example: "All fields are required"
 *       409:
 *         description: Rider with this email already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 409
 *                 message:
 *                   type: string
 *                   example: "Rider with this email already registered"
 *       500:
 *         description: Internal Server Error – Something went wrong on the server
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
 *                   example: "File upload failed. Please try again."
 */

/**
 * @swagger
 * /api/rider/auth/sign-in:
 *   post:
 *     summary: Sign in a rider
 *     description: This endpoint allows a rider to sign in by providing their email and password. Upon successful sign-in, an access token will be returned for further authenticated requests.
 *     tags:
 *       - Rider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Rider sign in successful
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
 *                   example: "Rider sign in successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     rider:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "605c72ef153207001f6b15f"
 *                         email:
 *                           type: string
 *                           example: "john.doe@example.com"
 *                         role:
 *                           type: string
 *                           example: "rider"
 *                     accessToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwN2JkZTkwLTlmY2UtNGNlOS04ZDYwLWRmOGExZDdhYTkzNiIsImVtYWlsIjoiam9obi5kb2VAY29tLmNvbSIsInJvbGUiOiJyaWRlciJ9.-vH9eEyYp8ns4xtSTbYihv8XpoOBpEVZWk45msltgCU"
 *       400:
 *         description: Invalid request due to missing or incorrect data
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
 *                   example: "Email and password are required"
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Invalid email or password"
 *       500:
 *         description: Internal Server Error – Something went wrong on the server
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
 *                   example: "File upload failed. Please try again."
 */

/**
 * @swagger
 * /api/rider/orders/{orderId}/complete:
 *   post:
 *     summary: Complete an order and mark it as delivered
 *     description: This endpoint allows a rider to mark an order as completed (delivered) by providing the OTP. The rider's income will be updated after completing the order.
 *     tags:
 *       - Rider
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: The ID of the order to be completed
 *         schema:
 *           type: string
 *           example: "60d5f1e1e3e3b7f789123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Order successfully closed and rider's income updated
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
 *                   example: "Order Successfully Closed"
 *       400:
 *         description: Invalid request due to missing or incorrect data
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
 *                   example: "Invalid OTP"
 *       404:
 *         description: The specified order or rider was not found
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
 *                   example: "Order not found or not assigned to this rider"
 *       500:
 *         description: Internal server error while processing the request
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
 *                   example: "Failed to complete the order. Please try again."
 */

/**
 * @swagger
 * /api/rider/orders:
 *   get:
 *     summary: Fetch all assigned orders for a rider
 *     description: Retrieves all orders assigned to a rider, optionally filtered by status.
 *     tags:
 *       - Rider
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         required: false
 *         description: Filter orders by status (optional).
 *         schema:
 *           type: string
 *           enum: ["delivered", "out_for_delivery"]
 *           example: "out_for_delivery"
 *     responses:
 *       200:
 *         description: Orders successfully fetched.
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
 *                   example: "Orders Successfully fetched"
 *                 data:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "64d7c6f9b12e3b003c9c2bda"
 *                           placed_by:
 *                             type: string
 *                             example: "customer"
 *                           service_type:
 *                             type: string
 *                             example: "delivery"
 *                           address:
 *                             type: string
 *                             example: "123 Main Street, City, Country"
 *                           vendor:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: "Vendor A"
 *                               phone:
 *                                 type: string
 *                                 example: "+1234567890"
 *                           status:
 *                             type: string
 *                             example: "out_for_delivery"
 *                           contact_number:
 *                             type: string
 *                             example: "+1234567890"
 *       400:
 *         description: Invalid input, such as an invalid rider ID or status.
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
 *                   example: "Invalid Rider Id"
 *       500:
 *         description: Internal server error.
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
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 * /api/rider/account-details:
 *   post:
 *     summary: Add account details for a rider
 *     description: This endpoint allows a rider to add their bank account details, including account number and bank code.
 *     tags:
 *       - Rider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               account_number:
 *                 type: string
 *                 description: The rider's bank account number
 *                 example: "1234567890"
 *               bank_code:
 *                 type: string
 *                 description: The rider's bank code
 *                 example: "123"
 *     responses:
 *       201:
 *         description: Rider account details successfully added
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
 *                   example: "Account detail added successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     account_details:
 *                       type: object
 *                       properties:
 *                         account_number:
 *                           type: string
 *                           example: "1234567890"
 *                         account_name:
 *                           type: string
 *                           example: "John Doe"
 *                         bank_code:
 *                           type: string
 *                           example: "123"
 *                         bank_name:
 *                           type: string
 *                           example: "Bank of Example"
 *       400:
 *         description: Missing or invalid data (e.g., missing account number or bank code)
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
 *                   example: "Both Bank Code and Account Number are required"
 *       404:
 *         description: Rider not found
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
 *                   example: "Rider not found"
 *       409:
 *         description: Account number already used by this rider
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 409
 *                 message:
 *                   type: string
 *                   example: "Account Number already used"
 *       500:
 *         description: Error while creating transfer recipient or saving rider account details
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
 *                   example: "Error Creating Transfer Recipient"
 */

/**
 * @swagger
 * /api/rider/payout:
 *   post:
 *     summary: Initiate a payout for a rider
 *     description: This endpoint allows a rider to initiate a payout request for their available income.
 *     tags:
 *       - Rider
 *     responses:
 *       200:
 *         description: Payout initiated successfully
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
 *                   example: "Rider payout initiated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Payout successfully initiated"
 *                     amount:
 *                       type: number
 *                       example: 5000
 *                     currency:
 *                       type: string
 *                       example: "NGN"
 *                     transfer_code:
 *                       type: string
 *                       example: "TRANSFER12345"
 *                     reference_code:
 *                       type: string
 *                       example: "REF12345"
 *       400:
 *         description: Invalid rider ID, insufficient funds, or missing recipient code
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
 *                   example: "Insufficient funds for payout"
 *       404:
 *         description: Rider not found
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
 *                   example: "Rider Not Found"
 *       500:
 *         description: Error while initiating payout
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
 *                   example: "Error initiating payout"
 */

/**
 * @swagger
 * /api/rider/payout:
 *   get:
 *     summary: Fetch all payouts for a rider
 *     description: This endpoint allows a rider to fetch a list of their previous payout requests.
 *     tags:
 *       - Rider
 *     responses:
 *       200:
 *         description: Rider's payout history successfully fetched
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
 *                   example: "Rider payouts fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     payouts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           amount:
 *                             type: number
 *                             example: 5000
 *                           currency:
 *                             type: string
 *                             example: "NGN"
 *                           status:
 *                             type: string
 *                             example: "pending"
 *                           reference_code:
 *                             type: string
 *                             example: "REF12345"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-01-16T12:00:00Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-01-16T12:30:00Z"
 *       400:
 *         description: Invalid rider ID
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
 *                   example: "Invalid Rider ID"
 *       404:
 *         description: Rider not found
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
 *                   example: "Rider Not Found"
 *       500:
 *         description: Error while fetching payouts
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
 *                   example: "Error fetching rider payouts"
 */
