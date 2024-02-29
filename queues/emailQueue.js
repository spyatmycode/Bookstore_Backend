// queues/emailQueue.js
import Queue from 'bull';
import { sendReceipt } from '../utils/sendReceipt.js'; // Assuming you have an email utility function

const emailQueue = new Queue('receipt');

// Define a job processor function
emailQueue.process(async (job) => {
    try {
        const { recipient, content } = job.data;

        console.log("Processing email job in the email queue");

        // Send receipt email
        await sendReceipt(recipient, content); // Assuming sendReceipt is an asynchronous function
    } catch (error) {
        console.error(`Error from receipt job:`, error);

        // Retry the job with exponential backoff, up to 3 retries
        if (job.attemptsMade < 3) {
            await job.retry();
        } else {
            console.error(`Maximum retry limit reached for job ${job.id}.`);
            // Optionally, you can move failed jobs to a dead-letter queue here
            // For simplicity, we're not handling the dead-letter queue in this example
        }
    }
});

export default emailQueue;
