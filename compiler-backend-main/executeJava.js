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

const executeJava = async (filepath, inputPath) => {
    const jobId = path.basename(filepath, '.java');
    const className = jobId;
    const classFilePath = path.join(outputPath, `${className}.class`);

    return await new Promise((resolve) => {
        exec(`javac "${filepath}" -d "${outputPath}"`, (compileError, _, compileStderr) => {
            console.log({ compileError, compileStderr });
            if (compileError) {
                return resolve({ error: "Compilation Error", details: compileStderr });
            }

            exec(`java -cp "${outputPath}" ${className} < "${inputPath}"`, (runtimeError, stdout, stderr) => {
                console.log({ runtimeError, stdout, stderr });

                // Always schedule deletion
                deleteExecutable(classFilePath);

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

module.exports = { executeJava };
