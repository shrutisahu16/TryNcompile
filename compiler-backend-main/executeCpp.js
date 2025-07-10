
// const fs = require('fs');
// const path = require('path');
// const { exec } = require('child_process');


// const outputPath = path.join(__dirname, 'outputs');
// //C:\Users\AYUSH\Documents\compiler\Backend\outputs


// // // if above path does not exist then create it. 
// if (!fs.existsSync(outputPath)) {
//     fs.mkdirSync(outputPath, { recursive: true });
// }


// //filePath=>
// // C:\Users\AYUSH\Documents\compiler\Backend\codes\27bb3242-5952-459d-bd24-7d1aab0d7762.cpp

// const executeCpp = async (filepath, inputPath) => {
//     const jobId = path.basename(filepath).split(".")[0];
//     // path.basename(filepath)=> 27bb3242-5952-459d-bd24-7d1aab0d7762.cpp

//     //splitting will create an array at 0th index we are getting id and
//     // at 1st index we got extension name cpp
//     // ["27bb3242-5952-459d-bd24-7d1aab0d7762","cpp"]

//     const output_filename = `${jobId}.exe`;
//     //27bb3242-5952-459d-bd24-7d1aab0d7762.exe

//     const outPath = path.join(outputPath, output_filename);
//     //C:\Users\AYUSH\Documents\compiler\Backend\outputs\27bb3242-5952-459d-bd24-7d1aab0d7762.exe


//     // compilation of our code
//     return new Promise((resolve, reject) => {
//         exec(
//             // `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ${jobId}.exe < ${inputPath}`
//             `g++ "${filepath}" -o "${outPath}" && "${outPath}" < "${inputPath}"`
//             ,

//             (error, stdout, stderr) => {

//                 console.log({ error, stdout, stderr });
//                 if (error) {
//                     reject({ error, stderr });
//                 }
//                 if (stderr) {
//                     reject(stderr);
//                 }
//                 resolve(stdout);
//             }
//         );
//     });


// };

// module.exports = {
//     executeCpp,
// };
///////////////////////////////////////////////////////////////////////////////////


// const fs = require('fs');
// const path = require('path');
// const { exec } = require('child_process');

// const outputPath = path.join(__dirname, 'outputs');

// // Ensure the output directory exists
// if (!fs.existsSync(outputPath)) {
//     fs.mkdirSync(outputPath, { recursive: true });
// }

// const executeCpp = async (filepath, inputPath) => {

//     const jobId = path.basename(filepath, '.cpp'); // Extract job ID (without extension)
//     const output_filename = `${jobId}.exe`;
//     const outPath = path.join(outputPath, output_filename);

//     // Compile the C++ code
//     return await new Promise((resolve) => {
//         exec(`g++ "${filepath}" -o "${outPath}"`, (compileError, _, compileStderr) => {
//             console.log({ compileError, compileStderr });
//             if (compileError) {
//                 return resolve({ error: "Compilation Error", details: compileStderr });
//             }


//             // Execute the compiled program with the given input
//             exec(`"${outPath}" < "${inputPath}"`, (runtimeError, stdout, stderr) => {

//                 console.log({ runtimeError, stdout, stderr })
//                 if (runtimeError) {
//                     return resolve({ error: "Runtime Error", details: runtimeError.message });
//                 }
//                 if (stderr) {
//                     return resolve({ error: "Standard Error", details: stderr });
//                 }

//                 return resolve({ stdout }); // Return the program's output
//             });
//         });
//     });
// };

// module.exports = { executeCpp };

//////////////////////////////////////////////////////////////////////////////////////////

// const fs = require('fs');
// const path = require('path');
// const { exec } = require('child_process');

// const outputPath = path.join(__dirname, 'outputs');

// // Ensure the output directory exists
// if (!fs.existsSync(outputPath)) {
//     fs.mkdirSync(outputPath, { recursive: true });
// }

// const executeCpp = async (filepath, inputPath) => {
//     const jobId = path.basename(filepath, '.cpp'); // Extract job ID (without extension)
//     const output_filename = `${jobId}.exe`;
//     const outPath = path.join(outputPath, output_filename);

//     return await new Promise((resolve) => {
//         // Compile the C++ code
//         exec(`g++ "${filepath}" -o "${outPath}"`, (compileError, _, compileStderr) => {
//             console.log({ compileError, compileStderr });
//             if (compileError) {
//                 return resolve({ error: "Compilation Error", details: compileStderr });
//             }

//             // Execute the compiled program with the given input
//             exec(`"${outPath}" < "${inputPath}"`, (runtimeError, stdout, stderr) => {
//                 console.log({ runtimeError, stdout, stderr });

//                 if (runtimeError) {
//                     return resolve({ error: "Runtime Error", details: runtimeError.message });
//                 }
//                 if (stderr) {
//                     return resolve({ error: "Standard Error", details: stderr });
//                 }

//                 // Schedule automatic deletion of the executable file after 10 minutes
//                 setTimeout(() => {
//                     fs.unlink(outPath, (err) => {
//                         if (err) {
//                             console.error(`Error deleting file ${outPath}:`, err);
//                         } else {
//                             console.log(`Deleted executable: ${outPath}`);
//                         }
//                     });
//                 }, 1 * 60 * 1000); // 1 minutes in milliseconds

//                 return resolve({ stdout });
//             });
//         });
//     });
// };

// module.exports = { executeCpp };


/////////////////////////////////////////////////////////////////////////////////////
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const outputPath = path.join(__dirname, 'outputs');

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const deleteExecutable = (outPath) => {
    setTimeout(() => {
        fs.unlink(outPath, (err) => {
            if (err) {
                console.error(`Error deleting file ${outPath}:`, err);
            } else {
                console.log(`Deleted file: ${outPath}`);
            }
        });
    }, 1 * 60 * 1000); // 1 minute
};

const executeCpp = async (filepath, inputPath) => {
    const jobId = path.basename(filepath, '.cpp');
    const output_filename = `${jobId}.exe`;
    const outPath = path.join(outputPath, output_filename);

    return await new Promise((resolve) => {
        exec(`g++ "${filepath}" -o "${outPath}"`, (compileError, _, compileStderr) => {
            console.log({ compileError, compileStderr });
            if (compileError) {
                return resolve({ error: "Compilation Error", details: compileStderr });
            }

            exec(`"${outPath}" < "${inputPath}"`, (runtimeError, stdout, stderr) => {
                console.log({ runtimeError, stdout, stderr });

                // Always schedule deletion
                deleteExecutable(outPath);

                if (runtimeError) {
                    return resolve({ error: "Runtime Error", details: runtimeError.message });
                }

                if (stderr) {
                    return resolve({ error: "Standard Error", details: stderr });
                }

                return resolve({ stdout });
            });
        });
    });
};

module.exports = { executeCpp };

