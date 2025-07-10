// const express = require('express');
// const cors = require("cors");
// const { generateFile } = require("./generateFile");
// const { executeCpp } = require('./executeCpp');
// const { generateInputFile } = require('./generateInputFile');


// const app = express();

// //middleware
// app.use(cors());
// app.use(express.json()); // this line means that it will accept raw json data 
// app.use(express.urlencoded({ extended: true }));//

// app.get('/', (req, res) => {
//     res.json({ online: "cpp-compiler" });
// });

// app.post("/run", async (req, res) => {
//     const { language = 'cpp', code, input } = req.body; // ye 3 chije frontend se li
//     if (code === undefined) {
//         return res.status(404).json({ "success": false, message: "empty code body!" })
//     }

//     try {
//         const filePath = await generateFile(language, code);
//         const inputPath = await generateInputFile(input);
//         const output = await executeCpp(filePath, inputPath);

//         res.json({ filePath, inputPath, output });
//     } catch (error) {
//         res.status(500).json({ "success": false, message: error.message })
//     }


// })

// app.listen(3000, () => {
//     console.log("server listening port 3000");
// })

const express = require('express');
const cors = require("cors");
const { generateFile } = require("./generateFile");
const { executeCpp } = require('./executeCpp');
const { executeJava } = require('./executeJava');
const { executeC } = require('./executeC');
const { generateInputFile } = require('./generateInputFile');

require("dotenv").config();

const aiRoutes = require('./ai.routes')



const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/ai', aiRoutes)

app.get('/', (req, res) => {
    res.json({ online: "cpp-java-c-compiler" });
});



app.post("/run", async (req, res) => {
    const { language = 'cpp', code, input } = req.body;

    if (!code) {
        return res.status(400).json({ success: false, message: "Empty code body!" });
    }


    try {
        const filePath = await generateFile(language, code);
        const inputPath = await generateInputFile(input);

        let output;
        if (language === "cpp") {
            output = await executeCpp(filePath, inputPath);
        } else if (language === "c") {
            output = await executeC(filePath, inputPath);
        } else if (language === "java") {
            output = await executeJava(filePath, inputPath);
        } else {
            return res.status(400).json({ success: false, message: "Unsupported language!" });
        }



        console.log({ filePath, inputPath, output });
        res.json({ filePath, inputPath, output });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});






app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
