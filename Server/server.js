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

app.get('/', (req, res) => {
    res.send("Hello World!")
})

app.use("/verify", verifyRoute);
<<<<<<< HEAD
app.use("/employee-issue", require('./src/routes/employeeIssue'));
=======
app.use("/attendance", attendanceRoute);
>>>>>>> 4861f750e8353007d3c83ee997e74e0ca6726805


app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
