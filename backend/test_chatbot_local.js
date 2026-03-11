
import 'dotenv/config';
import connectDB from './src/config/db.js';
import { processQuery } from './src/services/aiAssistant.js';
import mongoose from 'mongoose';

const runTests = async () => {
    try {
        await connectDB();
        console.log('DB Connected');

        const queries = [
            "Why is TechSupplies Inc delayed?",
            "Show vendors with mismatch above 5%",
            "Tell me about Office Depot Pro", // Should hit getGeneralInsights + context
            "Predict payment risk",
            "Summary of dashboard"
        ];

        for (const q of queries) {
            console.log(`\n--- Testing Query: "${q}" ---`);
            try {
                const result = await processQuery(q);
                console.log('Type:', result.type);
                console.log('Response:', result.response);
                if (result.type === 'general') {
                    console.log('Context Data Payload Keys:', Object.keys(result.data));
                    if (result.data.specificVendorContext) {
                        console.log('Vendor Context Found:', result.data.specificVendorContext.map(v => v.name));
                    }
                }
            } catch (err) {
                console.error('Error processing query:', err);
            }
        }

    } catch (error) {
        console.error('Test Error:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

runTests();
