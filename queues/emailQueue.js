// queues/emailQueue.js
import Queue from 'bull';
import { sendReceipt } from '../utils/sendReceipt.js'; // Assuming you have an email utility function

const emailQueue = new Queue('receipt');

// Define a job processor function
emailQueue.process(async (job) => {
   try {
    const { recipient, content } = job.data;

    console.log("The email job", job);
    
    // Send receipt email
    await sendReceipt(recipient, content); // Assuming sendReceipt is an asynchronous function
   } catch (error) {

    console.log("Error from reciept job",error);
    
   }
});

// Set up retry options
emailQueue.on('failed', async (job, error) => {
    console.error(`Email sending failed for job ${job.id}:`, error.message);

    console.log("On event from email/reciept job");
    // Retry the job with exponential backoff, up to 3 retries
    if (job.attemptsMade < 3) {
        await job.retry();
    } else {
        console.error(`Maximum retry limit reached for job ${job.id}.`);
        // Optionally, you can move failed jobs to a dead-letter queue here
        // For simplicity, we're not handling dead-letter queue in this example
    }
});

export default emailQueue;
