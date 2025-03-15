/**
 * @swagger
 * components:
 *   schemas:
 *     VideoEstimateResponse:
 *       type: object
 *       properties:
 *         status_code:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: "Estimate gotten successfully"
 *         data:
 *           type: object
 *           properties:
 *             credit_estimate:
 *               type: number
 *               example: 5.5
 *             estimate:
 *               type: string
 *               example: "Base cost calculated for a 50 MB video with 10 minutes duration"
 *             job_id:
 *               type: string
 *               example: "vid_123456"
 *     VideoJobResponse:
 *       type: object
 *       properties:
 *         status_code:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: "Job operation successful"
 *         data:
 *           type: string
 *           example: "Video job canceled successfully"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status_code:
 *           type: integer
 *           example: 400
 *         message:
 *           type: string
 *           example: "Bad request"
 */

/**
 * @swagger
 * /video/estimate:
 *   get:
 *     summary: Get video processing estimate
 *     tags: [Video]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - video_url
 *               - video_size
 *               - video_duration
 *               - subtitle_type
 *             properties:
 *               video_url:
 *                 type: string
 *                 example: "https://example.com/video.mp4"
 *               file_name:
 *                 type: string
 *                 example: "video.mp4"
 *               video_size:
 *                 type: number
 *                 example: 52428800
 *                 description: Size in bytes
 *               video_duration:
 *                 type: number
 *                 example: 600
 *                 description: Duration in seconds
 *               subtitle_type:
 *                 type: string
 *                 enum: [merge, srt]
 *                 example: "merge"
 *               customization_options:
 *                 type: object
 *                 example: { fontSize: 16, color: "white" }
 *               translation_language:
 *                 type: string
 *                 example: "es"
 *     responses:
 *       200:
 *         description: Estimate retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VideoEstimateResponse'
 *       400:
 *         description: Missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /video/jobs/{jobId}/cancel:
 *   delete:
 *     summary: Cancel a video job
 *     tags: [Video]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *           example: "vid_123456"
 *     responses:
 *       204:
 *         description: Video job canceled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VideoJobResponse'
 *       400:
 *         description: Cannot cancel job due to status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User or job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /video/jobs/{jobId}/accept:
 *   post:
 *     summary: Accept a video job
 *     tags: [Video]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *           example: "vid_123456"
 *     responses:
 *       200:
 *         description: Job accepted and processing started
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VideoJobResponse'
 *       400:
 *         description: Job already accepted or completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       402:
 *         description: Insufficient credits
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User or job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Processing error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
