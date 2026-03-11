
import 'dotenv/config';
import connectDB from './src/config/db.js';
import { processQuery } from './src/services/aiAssistant.js';
import mongoose from 'mongoose';
import fs from 'fs';

const logFile = 'result_log.txt';
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
};

const runTests = async () => {
    fs.writeFileSync(logFile, 'Starting Test...\n');
    try {
        await connectDB();
        log('DB Connected');

        const queries = [
            "Why is TechSupplies Inc delayed?",
            "Show vendors with mismatch above 5%",
            "Tell me about Office Depot Pro", // Should hit getGeneralInsights + context
            "Predict payment risk",
            "Summary of dashboard"
        ];

        for (const q of queries) {
            log(`\n--- Testing Query: "${q}" ---`);
            try {
                const result = await processQuery(q);
                log(`Type: ${result.type}`);
                log(`Response: ${result.response}`);
                if (result.type === 'general' && result.data && result.data.specificVendorContext) {
                    log('Wait, specificVendorContext is present.');
                    // Convert to string safely
                    const names = Array.isArray(result.data.specificVendorContext)
                        ? result.data.specificVendorContext.map(v => v.name).join(', ')
                        : 'Not an array?';
                    log(`Vendor Context Found: ${names}`);
                }
            } catch (err) {
                log(`Error processing query: ${err.message}`);
                console.error(err);
            }
        }

    } catch (error) {
        log(`Test Error: ${error.message}`);
        console.error(error);
    } finally {
        if (mongoose.connection) await mongoose.connection.close();
        process.exit(0);
    }
};

runTests();
