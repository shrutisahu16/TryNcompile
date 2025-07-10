

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const outputPath = path.join(__dirname, 'outputs');

// Ensure the output directory exists
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const deleteExecutable = (outPath) => {
    setTimeout(() => {
        fs.unlink(outPath, (err) => {
            if (err) {
                console.error(`Error deleting file ${outPath}:`, err);
            } else {
                console.log(`Deleted executable: ${outPath}`);
            }
        });
    }, 1 * 60 * 1000); // 1 minute in milliseconds
};

const executeC = async (filepath, inputPath) => {
    const jobId = path.basename(filepath, '.c'); // Extract job ID (without extension)
    const output_filename = `${jobId}.exe`;
    const outPath = path.join(outputPath, output_filename);

    return await new Promise((resolve) => {
        // Compile the C code
        exec(`gcc "${filepath}" -o "${outPath}"`, (compileError, _, compileStderr) => {
            console.log({ compileError, compileStderr });
            if (compileError) {
                return resolve({ error: "Compilation Error", details: compileStderr });
            }

            // Execute the compiled program with the given input
            exec(`"${outPath}" < "${inputPath}"`, (runtimeError, stdout, stderr) => {
                console.log({ runtimeError, stdout, stderr });

                // Schedule deletion in ALL cases
                deleteExecutable(outPath);

                if (runtimeError) {
                    return resolve({ error: "Runtime Error", details: runtimeError.message });
                }

                if (stderr) {
                    return resolve({ error: "Standard Error", details: stderr });
                }

                return resolve({ stdout }); // Return the program's output
            });
        });
    });
};

module.exports = { executeC };
