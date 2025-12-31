const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000;
const userSync = require("./src/routes/userSync");
const cors = require('cors');

const connectDB = require("./src/utils/db");
connectDB();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(cors());
app.use("/syncUser", userSync);

app.get('/', (req, res) => {
    res.send("Hello World!")
})




app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
