const mongoose = require("mongoose");

const EmployeeIssueSchema = mongoose.Schema({
    Eid:{
        type:String,
        required:true
    },
    Date:{
        type:Date,
        required:true
    },
    Title:{
        type:String,
        required:true
    },
    Description:{
        type:String,
        required:true
    },
    Status:{
        type:String,
        enum:["Pending","In Progress","Resolved"],
        default:"Pending"
    } 
})