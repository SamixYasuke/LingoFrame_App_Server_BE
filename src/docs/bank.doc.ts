/**
 * @swagger
 * tags:
 *   - name: Banks
 *     description: API Operations related to banks.
 */

/**
 * @swagger
 * /api/bank:
 *   get:
 *     summary: Get the list of all banks
 *     description: Retrieves a list of all banks in Nigeria using the Paystack API.
 *     tags: [Banks]
 *     responses:
 *       200:
 *         description: A list of banks.
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
 *                   example: "Bank List Fetched Successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     banks:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: The bank ID.
 *                             example: 123
 *                           name:
 *                             type: string
 *                             description: The name of the bank.
 *                             example: "Bank Name"
 *                           slug:
 *                             type: string
 *                             description: The slug of the bank.
 *                             example: "bank-slug"
 *                           code:
 *                             type: string
 *                             description: The code of the bank.
 *                             example: "12345"
 *       500:
 *         description: Error while fetching the bank list.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error Fetching Bank List"
 */
