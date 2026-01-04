const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Ward = require('./src/models/Ward');

const fs = require('fs');
async function listZones() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const zones = await Ward.distinct('zoneName');
        fs.writeFileSync('zones_dump.txt', JSON.stringify(zones, null, 2));
        console.log('Zones returned:', zones.length);
    } catch (err) {
        console.error(err);
        fs.writeFileSync('zones_dump.txt', 'Error: ' + err.message);
    } finally {
        await mongoose.disconnect();
    }
}

listZones();
