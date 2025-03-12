/**
 * @swagger
 * tags:
 *   - name: Vendor
 *     description: Vendor Related API Functionalities
 */

/**
 * @swagger
 * /api/vendor/auth/sign-up:
 *   post:
 *     summary: Sign up a new vendor
 *     description: This endpoint allows a new vendor to sign up by providing personal details, operational hours, contact number, and uploading the cafe image and proof of identity document.
 *     tags:
 *       - Vendor
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Vendor's name.
 *                 example: "John's Cafe"
 *               email:
 *                 type: string
 *                 description: Vendor's email address.
 *                 example: "vendor@example.com"
 *               operational_hours:
 *                 type: string
 *                 description: Vendor's operational hours.
 *                 example: "9 AM - 9 PM"
 *               contact_number:
 *                 type: string
 *                 description: Vendor's contact number.
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 description: Vendor's password.
 *                 example: "securePassword123"
 *               cafe_image:
 *                 type: string
 *                 format: binary
 *                 description: Image of the vendor's cafe.
 *               poi_document:
 *                 type: string
 *                 format: binary
 *                 description: Proof of identity document.
 *     responses:
 *       201:
 *         description: Vendor created successfully.
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
 *                   example: "Vendor Created Successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     vendor:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: Unique ID of the vendor.
 *                           example: "64a3f9d8b21e123456789012"
 *                         name:
 *                           type: string
 *                           description: Vendor's name.
 *                           example: "John's Cafe"
 *                         profile_image:
 *                           type: string
 *                           description: URL of the vendor's profile image.
 *                           example: "https://example.com/profile.jpg"
 *                         role:
 *                           type: string
 *                           description: User role.
 *                           example: "vendor"
 *                     access_token:
 *                       type: string
 *                       description: JWT access token for the vendor.
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5..."
 *       400:
 *         description: Bad request due to missing or invalid fields.
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
 *                   example: "Invalid input data"
 *       409:
 *         description: A vendor with this email already exists.
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
 *                   example: "Vendor with this email already exists"
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
 *                   example: "An unexpected error occurred"
 */

/**
 * @swagger
 * /api/vendor/auth/sign-in:
 *   post:
 *     summary: Sign in a vendor
 *     description: This endpoint allows a vendor to sign in using either their email or phone number along with a password.
 *     tags:
 *       - Vendor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Vendor's email address. Either email or phone is required.
 *                 example: "vendor@example.com"
 *               phone:
 *                 type: string
 *                 description: Vendor's phone number. Either phone or email is required.
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 description: Vendor's password.
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: Vendor signed in successfully.
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
 *                   example: "Vendor signed in successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     vendor:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: Unique ID of the vendor.
 *                           example: "64a3f9d8b21e123456789012"
 *                         name:
 *                           type: string
 *                           description: Vendor's name.
 *                           example: "John's Cafe"
 *                         profile_image:
 *                           type: string
 *                           description: URL of the vendor's profile image.
 *                           example: "https://example.com/profile.jpg"
 *                         role:
 *                           type: string
 *                           description: User role.
 *                           example: "vendor"
 *                     access_token:
 *                       type: string
 *                       description: JWT access token for the vendor.
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5..."
 *       400:
 *         description: Bad request due to missing or invalid fields (e.g., missing email/phone or password).
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
 *                   example: "Invalid input: email/phone and password are required"
 *       401:
 *         description: Invalid credentials.
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
 *                   example: "Invalid email, phone number, or password"
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
 *                   example: "An unexpected error occurred"
 */

/**
 * @swagger
 * /api/vendor/create-menu:
 *   post:
 *     summary: Create a menu item
 *     description: This endpoint allows a vendor to create a new menu item. It requires the vendor to be authenticated and provide a menu image.
 *     tags:
 *       - Vendor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the menu item.
 *                 example: "Veggie Pizza"
 *               description:
 *                 type: string
 *                 description: A brief description of the menu item.
 *                 example: "A delicious veggie pizza with fresh toppings."
 *               price:
 *                 type: number
 *                 description: The price of the menu item.
 *                 example: 12.99
 *               menu_image:
 *                 type: string
 *                 format: binary
 *                 description: An image of the menu item. Only '.jpeg', '.png', and '.jpg' file types are allowed.
 *     responses:
 *       201:
 *         description: Menu created successfully.
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
 *                   example: "Menu created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     menu:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: Unique ID of the menu item.
 *                           example: "64a3f9d8b21e123456789012"
 *                         name:
 *                           type: string
 *                           description: Name of the menu item.
 *                           example: "Veggie Pizza"
 *                         description:
 *                           type: string
 *                           description: Description of the menu item.
 *                           example: "A delicious veggie pizza with fresh toppings."
 *                         price:
 *                           type: number
 *                           description: Price of the menu item.
 *                           example: 12.99
 *                         image:
 *                           type: string
 *                           description: URL of the menu item's image.
 *                           example: "https://example.com/menu-images/veggie-pizza.jpg"
 *       400:
 *         description: Bad request due to missing or invalid fields.
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
 *                   example: "Invalid input: Name, description, price, and menu_image are required"
 *       401:
 *         description: Unauthorized. Authentication token is required.
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
 *                   example: "Authentication token is missing or invalid"
 *       404:
 *         description: Vendor not found.
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
 *                   example: "Vendor not found"
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
 *                   example: "An unexpected error occurred"
 */

/**
 * @swagger
 * /api/vendor/menu:
 *   get:
 *     summary: Retrieve all menu items for the authenticated vendor
 *     description: This endpoint retrieves all menu items created by the authenticated vendor. It requires the vendor to be authenticated.
 *     tags:
 *       - Vendor
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of menu items retrieved successfully.
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
 *                     menu:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: Unique ID of the menu item.
 *                             example: "64a3f9d8b21e123456789012"
 *                           name:
 *                             type: string
 *                             description: Name of the menu item.
 *                             example: "Veggie Pizza"
 *                           image:
 *                             type: string
 *                             description: URL of the menu item's image.
 *                             example: "https://example.com/menu-images/veggie-pizza.jpg"
 *                           price:
 *                             type: number
 *                             description: Price of the menu item.
 *                             example: 12.99
 *       400:
 *         description: Bad request due to invalid vendor ID.
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
 *       401:
 *         description: Unauthorized. Authentication token is required.
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
 *                   example: "Authentication token is missing or invalid"
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
 *                   example: "An unexpected error occurred"
 */

/**
 * @swagger
 * /api/vendor/menu/{menuId}:
 *   get:
 *     summary: Retrieve a specific menu item by ID for the authenticated vendor
 *     description: Fetches details of a menu item that belongs to the authenticated vendor using the menu's unique ID.
 *     tags:
 *       - Vendor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: menuId
 *         in: path
 *         required: true
 *         description: The unique ID of the menu item to retrieve.
 *         schema:
 *           type: string
 *           example: "64a3f9d8b21e123456789012"
 *     responses:
 *       200:
 *         description: Menu item retrieved successfully.
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
 *                   example: "Menu retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     menu:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: Unique ID of the menu item.
 *                           example: "64a3f9d8b21e123456789012"
 *                         name:
 *                           type: string
 *                           description: Name of the menu item.
 *                           example: "Veggie Pizza"
 *                         description:
 *                           type: string
 *                           description: Description of the menu item.
 *                           example: "A delicious vegetarian pizza with fresh vegetables and cheese."
 *                         price:
 *                           type: number
 *                           description: Price of the menu item.
 *                           example: 12.99
 *                         image:
 *                           type: string
 *                           description: URL of the menu item's image.
 *                           example: "https://example.com/menu-images/veggie-pizza.jpg"
 *                         available:
 *                           type: boolean
 *                           description: Indicates if the menu item is currently available.
 *                           example: true
 *       400:
 *         description: Bad request due to invalid vendor or menu ID.
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
 *                   example: "Invalid vendor or menu ID"
 *       401:
 *         description: Unauthorized. Authentication token is required.
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
 *                   example: "Authentication token is missing or invalid"
 *       404:
 *         description: Menu not found or doesn't belong to the current vendor.
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
 *                   example: "Menu not found or doesn't belong to the vendor"
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
 *                   example: "An unexpected error occurred"
 */

/**
 * @swagger
 * /api/vendor/menu/{menuId}/availability:
 *   patch:
 *     summary: Toggle the availability of a menu item
 *     description: Updates the availability status of a menu item for the authenticated vendor.
 *     tags:
 *       - Vendor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: menuId
 *         in: path
 *         required: true
 *         description: The unique ID of the menu item to update availability.
 *         schema:
 *           type: string
 *           example: "64a3f9d8b21e123456789012"
 *     responses:
 *       200:
 *         description: Menu item availability toggled successfully.
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
 *                   example: "Menu item availability toggled successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Unique ID of the menu item.
 *                       example: "64a3f9d8b21e123456789012"
 *                     available:
 *                       type: boolean
 *                       description: The updated availability status of the menu item.
 *                       example: true
 *       400:
 *         description: Bad request due to invalid vendor or menu ID.
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
 *                   example: "Invalid vendor or menu ID"
 *       401:
 *         description: Unauthorized. Authentication token is required.
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
 *                   example: "Authentication token is missing or invalid"
 *       404:
 *         description: Menu item not found or doesn't belong to the current vendor.
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
 *                   example: "Menu item not found or doesn't belong to the vendor"
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
 *                   example: "An unexpected error occurred"
 */

/**
 * @swagger
 * /api/vendor/menu/{menuId}:
 *   delete:
 *     summary: Delete a menu item
 *     description: Deletes a specific menu item belonging to the authenticated vendor.
 *     tags:
 *       - Vendor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: menuId
 *         in: path
 *         required: true
 *         description: The unique ID of the menu item to delete.
 *         schema:
 *           type: string
 *           example: "64a3f9d8b21e123456789012"
 *     responses:
 *       200:
 *         description: Menu item deleted successfully.
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
 *                   example: "Menu item deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     menu:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: Unique ID of the deleted menu item.
 *                           example: "64a3f9d8b21e123456789012"
 *       400:
 *         description: Bad request due to invalid vendor or menu ID.
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
 *                   example: "Invalid vendor or menu ID"
 *       401:
 *         description: Unauthorized. Authentication token is required.
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
 *                   example: "Authentication token is missing or invalid"
 *       404:
 *         description: Menu item not found or doesn't belong to the current vendor.
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
 *                   example: "Menu item not found or doesn't belong to the vendor"
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
 *                   example: "An unexpected error occurred"
 */

/**
 * @swagger
 * /api/vendor/menu/{menuId}:
 *   patch:
 *     summary: Update a menu item
 *     description: Updates the details of a specific menu item, including its name, price, description, and image, belonging to the authenticated vendor.
 *     tags:
 *       - Vendor
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: menuId
 *         in: path
 *         required: true
 *         description: The unique ID of the menu item to update.
 *         schema:
 *           type: string
 *           example: "64a3f9d8b21e123456789012"
 *       - name: menu_image
 *         in: formData
 *         required: false
 *         description: The new image file for the menu item.
 *         type: file
 *       - name: name
 *         in: formData
 *         required: false
 *         description: The new name of the menu item.
 *         schema:
 *           type: string
 *           example: "Delicious Pizza"
 *       - name: price
 *         in: formData
 *         required: false
 *         description: The new price of the menu item.
 *         schema:
 *           type: number
 *           example: 12.99
 *       - name: description
 *         in: formData
 *         required: false
 *         description: The new description of the menu item.
 *         schema:
 *           type: string
 *           example: "A cheesy pizza with fresh toppings."
 *     responses:
 *       200:
 *         description: Menu item updated successfully.
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
 *                   example: "Menu item updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Unique ID of the updated menu item.
 *                       example: "64a3f9d8b21e123456789012"
 *                     name:
 *                       type: string
 *                       description: Updated name of the menu item.
 *                       example: "Delicious Pizza"
 *                     price:
 *                       type: number
 *                       description: Updated price of the menu item.
 *                       example: 12.99
 *                     description:
 *                       type: string
 *                       description: Updated description of the menu item.
 *                       example: "A cheesy pizza with fresh toppings."
 *                     image_url:
 *                       type: string
 *                       description: URL of the updated image for the menu item.
 *                       example: "https://res.cloudinary.com/example/image/upload/v1234567890/menu-images/pizza.jpg"
 *       400:
 *         description: Bad request due to invalid vendor ID, menu ID, or file type.
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
 *                   example: "Invalid Vendor or Menu Id"
 *       401:
 *         description: Unauthorized. Authentication token is required.
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
 *                   example: "Unauthorized. Please provide a valid token."
 *       404:
 *         description: Menu item not found or doesn't belong to the authenticated vendor.
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
 *                   example: "Menu item not found or doesn't belong to the current vendor."
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
 *                   example: "Internal server error. Please try again later."
 */

/**
 * @swagger
 * /api/vendor/orders:
 *   get:
 *     summary: Get all orders for a vendor
 *     description: Retrieves all orders placed for a specific vendor, with an optional status filter (e.g., completed, active, rejected).
 *     tags:
 *       - Vendor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         required: false
 *         description: The status of the orders to filter by (e.g., completed, active, rejected).
 *         schema:
 *           type: string
 *           enum:
 *             - active
 *             - completed
 *             - rejected
 *           example: "active"
 *     responses:
 *       200:
 *         description: All orders retrieved successfully.
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
 *                   example: "All orders retrieved successfully"
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
 *                             description: Unique ID of the order.
 *                             example: "64a3f9d8b21e123456789012"
 *                           placed_by:
 *                             type: string
 *                             description: ID of the user who placed the order.
 *                             example: "64b4f9d8b21e123456789012"
 *                           service_type:
 *                             type: string
 *                             description: Type of service for the order.
 *                             example: "delivery"
 *       400:
 *         description: Bad request due to invalid vendor ID.
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
 *                   example: "Invalid Vendor Id"
 *       401:
 *         description: Unauthorized. Authentication token is required.
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
 *                   example: "Unauthorized. Please provide a valid token."
 *       500:
 *         description: Internal server error while retrieving orders.
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
 *                   example: "Error retrieving orders"
 */

/**
 * @swagger
 * /api/vendor/orders/{orderId}:
 *   get:
 *     summary: Get a specific order by its ID for a vendor
 *     description: Retrieves a specific order for a vendor by its ID.
 *     tags:
 *       - Vendor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: The ID of the order to retrieve.
 *         schema:
 *           type: string
 *           example: "64a3f9d8b21e123456789012"
 *     responses:
 *       200:
 *         description: Order retrieved successfully.
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
 *                   example: "Order retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: Unique ID of the order.
 *                           example: "64a3f9d8b21e123456789012"
 *                         placed_by:
 *                           type: string
 *                           description: ID of the user who placed the order.
 *                           example: "64b4f9d8b21e123456789012"
 *                         service_type:
 *                           type: string
 *                           description: Type of service for the order (e.g., delivery).
 *                           example: "delivery"
 *                         items:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               menu:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                     description: Menu item ID.
 *                                     example: "64a3f9d8b21e123456789013"
 *                                   name:
 *                                     type: string
 *                                     description: Name of the menu item.
 *                                     example: "Pizza"
 *                               quantity:
 *                                 type: integer
 *                                 description: Quantity of the item ordered.
 *                                 example: 2
 *       400:
 *         description: Bad request due to invalid order ID.
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
 *                   example: "Invalid Order ID"
 *       401:
 *         description: Unauthorized. Authentication token is required.
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
 *                   example: "Unauthorized. Please provide a valid token."
 *       404:
 *         description: Order not found or doesn't belong to the vendor.
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
 *                   example: "Order not found or doesn't belong to this vendor"
 *       500:
 *         description: Internal server error while retrieving the order.
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
 *                   example: "Error retrieving order"
 */

/**
 * @swagger
 * /api/vendor/orders/{orderId}/accept:
 *   post:
 *     summary: Accept an order for a vendor
 *     description: Changes the order status to "in_preparation" for a vendor.
 *     tags:
 *       - Vendor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: The ID of the order to accept.
 *         schema:
 *           type: string
 *           example: "64a3f9d8b21e123456789012"
 *     responses:
 *       200:
 *         description: Order accepted successfully.
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
 *                   example: "Order accepted successfully"
 *       400:
 *         description: Bad request due to invalid order or vendor ID, or incorrect order status.
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
 *                   example: "Invalid Vendor or Order Id"
 *       404:
 *         description: Order not found or doesn't belong to the vendor.
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
 *                   example: "Order not found or doesn't belong to this vendor"
 *       500:
 *         description: Internal server error while accepting the order.
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
 *                   example: "Error accepting order"
 */

/**
 * @swagger
 * /api/vendor/orders/{orderId}/reject:
 *   post:
 *     summary: Reject an order for a vendor
 *     description: Changes the order status to "rejected_by_vendor" for a vendor and processes a refund to the customer.
 *     tags:
 *       - Vendor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: The ID of the order to reject.
 *         schema:
 *           type: string
 *           example: "64a3f9d8b21e123456789012"
 *     responses:
 *       200:
 *         description: Order rejected successfully and customer refund in process.
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
 *                   example: "Order rejected successfully and customer refund in process."
 *       400:
 *         description: Bad request due to invalid order or vendor ID, or incorrect order status.
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
 *                   example: "Invalid Vendor or Order Id"
 *       404:
 *         description: Order or payment not found, or order doesn't belong to the vendor.
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
 *                   example: "Order not found or doesn't belong to this vendor"
 *       500:
 *         description: Internal server error while rejecting the order.
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
 *                   example: "Cannot Reject Order: Failed to update the order status"
 */

/**
 * @swagger
 * /api/vendor/orders/{orderId}/complete:
 *   post:
 *     summary: Mark an order as completed
 *     description: Updates the order status to "ready_for_pickup" or "out_for_delivery" based on the service type, and optionally assigns a rider for delivery.
 *     tags:
 *       - Vendor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: The ID of the order to complete.
 *         schema:
 *           type: string
 *           example: "64a3f9d8b21e123456789012"
 *     responses:
 *       200:
 *         description: Order completed successfully
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
 *                   example: Order completed successfully
 *       400:
 *         description: Bad request, such as invalid IDs or invalid order status
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
 *                   example: Invalid Vendor or Order Id
 *       401:
 *         description: Unauthorized
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
 *                   example: Unauthorized access
 *       404:
 *         description: Order not found or does not belong to this vendor
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
 *                   example: Order not found or does not belong to this vendor
 *       500:
 *         description: Internal server error
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
 *                   example: Failed to update the order
 */

/**
 * @swagger
 * /api/vendor/account-details:
 *   post:
 *     summary: Add vendor account details
 *     description: Allows a vendor to add or update their bank account details.
 *     tags:
 *       - Vendor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               account_number:
 *                 type: string
 *                 description: The vendor's bank account number.
 *                 example: "0123456789"
 *               bank_code:
 *                 type: string
 *                 description: The bank's code.
 *                 example: "044"
 *     responses:
 *       201:
 *         description: Account added successfully
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
 *                   example: Account Added Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     account_details:
 *                       type: object
 *                       properties:
 *                         account_number:
 *                           type: string
 *                           example: "0123456789"
 *                         account_name:
 *                           type: string
 *                           example: "John Doe"
 *                         bank_code:
 *                           type: string
 *                           example: "044"
 *                         bank_name:
 *                           type: string
 *                           example: "Access Bank"
 *       400:
 *         description: Invalid request data
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
 *                   example: Both Bank Code and Account Number are required
 *       404:
 *         description: Vendor not found
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
 *                   example: Vendor Not Found
 *       409:
 *         description: Conflict with existing account details
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
 *                   example: Account Number already used
 *       500:
 *         description: Server error
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
 *                   example: Error Creating Transfer Recipient
 */

/**
 * @swagger
 * /api/vendor/payout:
 *   post:
 *     summary: Initiate vendor payout
 *     description: Allows a vendor to initiate a payout to their registered bank account.
 *     tags:
 *       - Vendor
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment initiated successfully
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
 *                   example: Payment Initiated Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     payout:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: Transfer initiated successfully
 *                         amount:
 *                           type: number
 *                           example: 5000
 *                         currency:
 *                           type: string
 *                           example: NGN
 *                         transfer_code:
 *                           type: string
 *                           example: TRF_1a2b3c4d5e
 *                         reference_code:
 *                           type: string
 *                           example: REF_1a2b3c4d5e
 *       400:
 *         description: Bad Request (e.g., invalid vendor ID, insufficient funds, or recipient code not set)
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
 *                   example: Insufficient funds for payout
 *       404:
 *         description: Vendor not found
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
 *                   example: Vendor Not Found
 *       500:
 *         description: Internal server error (e.g., failed to initiate payout)
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
 *                   example: Failed to initiate payout
 */

/**
 * @swagger
 * /api/vendor/payout:
 *   get:
 *     summary: Fetch vendor payouts
 *     description: Retrieves all payout records for the authenticated vendor.
 *     tags:
 *       - Vendor
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payouts fetched successfully
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
 *                   example: Vendor Payouts Fetched Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     payouts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "64ab3e2f9e7b4c987d0a5c21"
 *                           amount:
 *                             type: number
 *                             example: 5000
 *                           status:
 *                             type: string
 *                             example: "pending"
 *                           reference_code:
 *                             type: string
 *                             example: "REF_1a2b3c4d5e"
 *                           currency:
 *                             type: string
 *                             example: "NGN"
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-08-14T10:00:00.000Z"
 *       400:
 *         description: Invalid Vendor ID
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
 *                   example: Invalid Vendor ID
 *       404:
 *         description: Vendor not found
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
 *                   example: Vendor Not Found
 *       500:
 *         description: Internal server error
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
 *                   example: Failed to fetch payouts
 */
