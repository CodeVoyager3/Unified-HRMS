const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const verifyRoute = require('./src/routes/employeeVerify');
const attendanceRoute = require('./src/routes/attendance');
const connectDB = require("./src/utils/db");
const { seedDatabase } = require('./src/controllers/recruitmentController'); // Import Seeder

connectDB();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(cors());

// Debugging Middleware: Log all requests
app.use((req, res, next) => {
    console.log(`[Reques] ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.send("Hello World!")
})

app.use("/verify", verifyRoute);
app.use("/employee-issue", require('./src/routes/employeeIssue'));
app.use("/attendance", attendanceRoute);
app.use("/payroll", require('./src/routes/payroll'));
app.use("/credit", require('./src/routes/credit'));
app.use("/inspector", require('./src/routes/inspector'));
app.use("/task", require('./src/routes/task'));
app.use("/challan", require('./src/routes/challan'));
app.use("/api/recruitment", require('./src/routes/recruitmentRoutes'));
app.use("/api/verification", require('./src/routes/verificationRoutes'));

app.listen(PORT, async () => {
    console.log(`Server running on port http://localhost:${PORT}`);

    // Auto-seed data on startup for permanent persistence
    console.log("Initializing Permanent Data...");
    await seedDatabase();
});
