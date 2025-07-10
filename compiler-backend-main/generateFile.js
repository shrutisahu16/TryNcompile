
// const fs = require('fs');
// const path = require('path');
// const { v4: uuid } = require('uuid');

// const dirCodes = path.join(__dirname, 'codes');
// //C:\Users\AYUSH\Documents\online_comp\compiler\Backend\codes


// // // if above path does not exist then create it. 
// if (!fs.existsSync(dirCodes)) {
//     fs.mkdirSync(dirCodes, { recursive: true });
// }

// const generateFile = async (format, content) => {
//     const jobID = uuid();
//     const filename = `${jobID}.${format}`;// 123454-uniqueid.cpp
//     const filePath = path.join(dirCodes, filename);//file is created
//     //     //// C:\Users\AYUSH\Documents\compiler\Backend\codes\123454-uniqueid.cpp

//     //     //create and store the code in file

//     fs.writeFileSync(filePath, content);
//     return filePath;
// };

// module.exports = {
//     generateFile,
// };


/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dirCodes = path.join(__dirname, 'codes');

// Ensure the codes directory exists
if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async (format, content) => {
    const jobID = uuidv4().replace(/-/g, ""); // Generate unique ID without hyphens
    const filename = `${format === 'java' ? "Java" : ""}${jobID}.${format}`;
    const filePath = path.join(dirCodes, filename);

    // If the format is Java, update the class name dynamically
    if (format === "java") {
        let classMatch = content.match(/\bclass\s+(\w+)/);


        let className = classMatch[1];  // Extract the class name    
        // Replace all occurrences of the class name with "Java"
        content = content.replace(new RegExp(`\\b${className}\\b`, 'g'), `Java${jobID}`);

        console.log("\nModified Code:\n" + content);
    }

    // Write content to file
    fs.writeFileSync(filePath, content);

    // Schedule file deletion after 1 minutes
    setTimeout(() => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error deleting file ${filePath}:`, err);
            } else {
                console.log(`Deleted file: ${filePath}`);
            }
        });
    }, 1 * 60 * 1000); // 1 minutes in milliseconds

    return filePath;
};

module.exports = {
    generateFile,
};
