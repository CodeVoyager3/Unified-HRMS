const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const verifyRoute = require('./src/routes/employeeVerify');
const attendanceRoute = require('./src/routes/attendance');
const connectDB = require("./src/utils/db");
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




app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
