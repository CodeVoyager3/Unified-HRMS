const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars from Server/.env (which is two levels up from src/models)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const User = require("./User");

const uri = process.env.MONGO_URI;

const mcdDummyData = [
  {
    name: "Vikram Malhotra",
    employeeId: "MCD-1002",
    email: "vikram.m@mcd.gov.in",
    role: "Deputy Commissioner",
    department: "Head Office",
    Zone: "Civil Line",
    Ward: 6,
    joiningDate: new Date("2021-05-20"),
    employmentStatus: "Permanent"
  },
  {
    name: "Sunita Deshmukh",
    employeeId: "MCD-7001",
    email: "sunita.d@mcd.gov.in",
    role: "Sanitary Inspector",
    department: "Sanitation",
    Zone: "Narela",
    Ward: 2,
    joiningDate: new Date("2023-02-15"),
    employmentStatus: "Permanent"
  },
  {
    name: "Ramesh Chand",
    employeeId: "MCD-8015",
    email: "ramesh.c@mcd.gov.in",
    role: "Worker",
    department: "Cleaning",
    Zone: "Rohini",
    Ward: 25,
    joiningDate: new Date("2024-01-10"),
    employmentStatus: "Contractual"
  },
  {
    name: "Kavita Rao",
    employeeId: "MCD-1045",
    email: "kavita.r@mcd.gov.in",
    role: "Staff",
    department: "Finance",
    Zone: "Keshavpuram",
    Ward: 57,
    joiningDate: new Date("2022-09-30"),
    employmentStatus: "Permanent"
  },
  {
    name: "Arjun Tyagi",
    employeeId: "MCD-9012",
    email: "arjun.t@mcd.gov.in",
    role: "Sanitary Inspector",
    department: "Solid Waste",
    Zone: "City S.P.Zone",
    Ward: 75,
    joiningDate: new Date("2023-06-12"),
    employmentStatus: "Permanent"
  },
  {
    name: "Meena Kumari",
    employeeId: "MCD-3021",
    email: "meena.k@mcd.gov.in",
    role: "Worker",
    department: "Health",
    Zone: "Karolbagh",
    Ward: 84,
    joiningDate: new Date("2024-03-05"),
    employmentStatus: "Contractual"
  },
  {
    name: "Deepak Gupta",
    employeeId: "MCD-4055",
    email: "deepak.g@mcd.gov.in",
    role: "Staff",
    department: "Water Supply",
    Zone: "West Zone",
    Ward: 105,
    joiningDate: new Date("2021-11-22"),
    employmentStatus: "Permanent"
  },
  {
    name: "Suresh Meena",
    employeeId: "MCD-6088",
    email: "suresh.m@mcd.gov.in",
    role: "Worker",
    department: "Road Maintenance",
    Zone: "Najafgarh Zone",
    Ward: 127,
    joiningDate: new Date("2023-12-01"),
    employmentStatus: "Contractual"
  },
  {
    name: "Anita Nair",
    employeeId: "MCD-2099",
    email: "anita.n@mcd.gov.in",
    role: "Staff",
    department: "Education",
    Zone: "Central Zone",
    Ward: 144,
    joiningDate: new Date("2022-04-18"),
    employmentStatus: "Permanent"
  },
  {
    name: "Pawan Kalyan",
    employeeId: "MCD-5112",
    email: "pawan.k@mcd.gov.in",
    role: "Sanitary Inspector",
    department: "Animal Control",
    Zone: "South Zone",
    Ward: 155,
    joiningDate: new Date("2020-08-14"),
    employmentStatus: "Permanent"
  },
  {
    name: "Sanjay Raut",
    employeeId: "MCD-7123",
    email: "sanjay.r@mcd.gov.in",
    role: "Staff",
    department: "Market Control",
    Zone: "Shahdara South Zone",
    Ward: 197,
    joiningDate: new Date("2023-05-25"),
    employmentStatus: "Contractual"
  },
  {
    name: "Lata Mangesh",
    employeeId: "MCD-8144",
    email: "lata.m@mcd.gov.in",
    role: "Worker",
    department: "Cleaning",
    Zone: "Shahdara North Zone",
    Ward: 220,
    joiningDate: new Date("2024-02-14"),
    employmentStatus: "Contractual"
  },
  {
    name: "Rajesh Khanna",
    employeeId: "MCD-9155",
    email: "rajesh.kh@mcd.gov.in",
    role: "Deputy Commissioner",
    department: "Transport",
    Zone: "Narela",
    Ward: 30,
    joiningDate: new Date("2019-12-10"),
    employmentStatus: "Permanent"
  },
  {
    name: "Geeta Phogat",
    employeeId: "MCD-1166",
    email: "geeta.p@mcd.gov.in",
    role: "Sanitary Inspector",
    department: "Sanitation",
    Zone: "Civil Line",
    Ward: 15,
    joiningDate: new Date("2023-07-20"),
    employmentStatus: "Permanent"
  },
  {
    name: "Manoj Bajpayee",
    employeeId: "MCD-2177",
    email: "manoj.b@mcd.gov.in",
    role: "Staff",
    department: "Security",
    Zone: "Rohini",
    Ward: 37,
    joiningDate: new Date("2022-01-15"),
    employmentStatus: "Permanent"
  },
  {
    name: "Nirmala S.",
    employeeId: "MCD-3188",
    email: "nirmala.s@mcd.gov.in",
    role: "Staff",
    department: "Finance",
    Zone: "Keshavpuram",
    Ward: 64,
    joiningDate: new Date("2021-03-22"),
    employmentStatus: "Permanent"
  },
  {
    name: "Pankaj Tripathi",
    employeeId: "MCD-4199",
    email: "pankaj.t@mcd.gov.in",
    role: "Worker",
    department: "Solid Waste",
    Zone: "City S.P.Zone",
    Ward: 72,
    joiningDate: new Date("2024-04-01"),
    employmentStatus: "Contractual"
  },
  {
    name: "Smriti Irani",
    employeeId: "MCD-5211",
    email: "smriti.i@mcd.gov.in",
    role: "Deputy Commissioner",
    department: "Education",
    Zone: "Karolbagh",
    Ward: 141,
    joiningDate: new Date("2018-05-15"),
    employmentStatus: "Permanent"
  },
  {
    name: "Harish Salve",
    employeeId: "MCD-6222",
    email: "harish.s@mcd.gov.in",
    role: "Staff",
    department: "Electricity",
    Zone: "West Zone",
    Ward: 115,
    joiningDate: new Date("2022-10-10"),
    employmentStatus: "Permanent"
  },
  {
    name: "Raghav Chadha",
    employeeId: "MCD-7233",
    email: "raghav.c@mcd.gov.in",
    role: "Sanitary Inspector",
    department: "Health",
    Zone: "Najafgarh Zone",
    Ward: 120,
    joiningDate: new Date("2023-09-05"),
    employmentStatus: "Permanent"
  },
  {
    name: "Suresh Prabhu",
    employeeId: "MCD-1003",
    email: "suresh.p@mcd.gov.in",
    role: "Commissioner",
    department: "Head Office",
    Zone: "City S.P.Zone",
    Ward: 74,
    joiningDate: new Date("2015-06-01"),
    employmentStatus: "Permanent"
  },
  {
    name: "Meenakshi Lekhi",
    employeeId: "MCD-2055",
    email: "meenakshi.l@mcd.gov.in",
    role: "Deputy Commissioner",
    department: "Education",
    Zone: "South Zone",
    Ward: 173,
    joiningDate: new Date("2019-03-12"),
    employmentStatus: "Permanent"
  },
  {
    name: "Rajesh Gahlot",
    employeeId: "MCD-3122",
    email: "rajesh.g@mcd.gov.in",
    role: "Sanitary Inspector",
    department: "Sanitation",
    Zone: "Najafgarh Zone",
    Ward: 122,
    joiningDate: new Date("2022-11-15"),
    employmentStatus: "Permanent"
  },
  {
    name: "Komal Tyagi",
    employeeId: "MCD-9901",
    email: "komal.t@mcd.gov.in",
    role: "Worker",
    department: "Cleaning",
    Zone: "Narela",
    Ward: 4,
    joiningDate: new Date("2024-05-10"),
    employmentStatus: "Contractual"
  },
  {
    name: "Anil Baijal",
    employeeId: "MCD-1088",
    email: "anil.b@mcd.gov.in",
    role: "Staff",
    department: "Water Supply",
    Zone: "Civil Line",
    Ward: 11,
    joiningDate: new Date("2020-01-20"),
    employmentStatus: "Permanent"
  },
  {
    name: "Sarita Choudhary",
    employeeId: "MCD-4044",
    email: "sarita.c@mcd.gov.in",
    role: "Sanitary Inspector",
    department: "Solid Waste",
    Zone: "Rohini",
    Ward: 44,
    joiningDate: new Date("2023-04-05"),
    employmentStatus: "Permanent"
  },
  {
    name: "Vijay Goel",
    employeeId: "MCD-6059",
    email: "vijay.g@mcd.gov.in",
    role: "Staff",
    department: "Market Control",
    Zone: "Keshavpuram",
    Ward: 59,
    joiningDate: new Date("2021-08-30"),
    employmentStatus: "Permanent"
  },
  {
    name: "Poonam Azad",
    employeeId: "MCD-7082",
    email: "poonam.a@mcd.gov.in",
    role: "Staff",
    department: "Finance",
    Zone: "City S.P.Zone",
    Ward: 82,
    joiningDate: new Date("2022-02-14"),
    employmentStatus: "Permanent"
  },
  {
    name: "Manoj Tiwari",
    employeeId: "MCD-8139",
    email: "manoj.t@mcd.gov.in",
    role: "Sanitary Inspector",
    department: "Transport",
    Zone: "Karolbagh",
    Ward: 139,
    joiningDate: new Date("2020-10-10"),
    employmentStatus: "Permanent"
  },
  {
    name: "Alka Lamba",
    employeeId: "MCD-9111",
    email: "alka.l@mcd.gov.in",
    role: "Worker",
    department: "Health",
    Zone: "West Zone",
    Ward: 111,
    joiningDate: new Date("2024-02-28"),
    employmentStatus: "Contractual"
  },
  {
    name: "Somnath Bharti",
    employeeId: "MCD-5131",
    email: "somnath.b@mcd.gov.in",
    role: "Staff",
    department: "Electricity",
    Zone: "Najafgarh Zone",
    Ward: 131,
    joiningDate: new Date("2023-09-12"),
    employmentStatus: "Contractual"
  },
  {
    name: "Atishi Marlena",
    employeeId: "MCD-2145",
    email: "atishi.m@mcd.gov.in",
    role: "Deputy Commissioner",
    department: "Education",
    Zone: "Central Zone",
    Ward: 145,
    joiningDate: new Date("2021-06-20"),
    employmentStatus: "Permanent"
  },
  {
    name: "Saurabh Bhardwaj",
    employeeId: "MCD-3172",
    email: "saurabh.b@mcd.gov.in",
    role: "Staff",
    department: "Health",
    Zone: "South Zone",
    Ward: 172,
    joiningDate: new Date("2022-12-05"),
    employmentStatus: "Permanent"
  },
  {
    name: "Kailash Gahlot",
    employeeId: "MCD-4195",
    email: "kailash.g@mcd.gov.in",
    role: "Staff",
    department: "Road Maintenance",
    Zone: "Shahdara South Zone",
    Ward: 195,
    joiningDate: new Date("2023-01-15"),
    employmentStatus: "Permanent"
  },
  {
    name: "Gautam Gambhir",
    employeeId: "MCD-5218",
    email: "gautam.g@mcd.gov.in",
    role: "Worker",
    department: "Security",
    Zone: "Shahdara North Zone",
    Ward: 218,
    joiningDate: new Date("2024-06-01"),
    employmentStatus: "Contractual"
  },
  {
    name: "Jitender Singh",
    employeeId: "MCD-6031",
    email: "jitender.s@mcd.gov.in",
    role: "Sanitary Inspector",
    department: "Solid Waste",
    Zone: "Narela",
    Ward: 31,
    joiningDate: new Date("2022-07-19"),
    employmentStatus: "Permanent"
  },
  {
    name: "Rekha Gupta",
    employeeId: "MCD-7019",
    email: "rekha.g@mcd.gov.in",
    role: "Staff",
    department: "Finance",
    Zone: "Civil Line",
    Ward: 19,
    joiningDate: new Date("2021-11-11"),
    employmentStatus: "Permanent"
  },
  {
    name: "Naveen Tyagi",
    employeeId: "MCD-8051",
    email: "naveen.t@mcd.gov.in",
    role: "Worker",
    department: "Cleaning",
    Zone: "Rohini",
    Ward: 51,
    joiningDate: new Date("2023-08-22"),
    employmentStatus: "Contractual"
  },
  {
    name: "Preeti Aggarwal",
    employeeId: "MCD-9065",
    email: "preeti.a@mcd.gov.in",
    role: "Deputy Commissioner",
    department: "Animal Control",
    Zone: "Keshavpuram",
    Ward: 65,
    joiningDate: new Date("2018-04-10"),
    employmentStatus: "Permanent"
  },
  {
    name: "Adarsh Shastri",
    employeeId: "MCD-1113",
    email: "adarsh.s@mcd.gov.in",
    role: "Staff",
    department: "Market Control",
    Zone: "West Zone",
    Ward: 113,
    joiningDate: new Date("2022-05-25"),
    employmentStatus: "Permanent"
  }
];



const seedDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB...");


    await User.deleteMany({});
    console.log("Old data cleared.");

    await User.insertMany(dummyUsers);
    console.log("100 Dummy Users inserted successfully!");

    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding data:", err);
    mongoose.connection.close();
  }
};

seedDB();