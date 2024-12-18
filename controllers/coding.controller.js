import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

const getFileExtension = (language) => {
    switch (language) {
        case "javascript": return "js";
        case "python": return "py";
        case "c": return "c";
        case "cpp": return "cpp";
        default: throw new Error("Unsupported language.");
    }
};

function getExecutionCommand(language, filePath, inputFilePath = null) {
    const isWindows = process.platform === "win32";
    const inputRedirect = inputFilePath ? `< ${inputFilePath}` : "";

    switch (language) {
        case "javascript":
            return `node ${filePath}`;
        case "python":
            return `py ${filePath} ${inputRedirect}`;
        case "c":
            return isWindows
                ? `del code.exe >nul 2>&1 & gcc ${filePath} -o code.exe && code.exe ${inputRedirect}`
                : `rm -f code.out && gcc ${filePath} -o code.out && ./code.out ${inputRedirect}`;
        case "cpp":
            return isWindows
                ? `del code.exe >nul 2>&1 & g++ ${filePath} -o code.exe && code.exe ${inputRedirect}`
                : `rm -f code.out && g++ ${filePath} -o code.out && ./code.out ${inputRedirect}`;
        default:
            throw new Error("Unsupported language.");
    }
}

export const runCode = async (req, res) => {
    const { code, input, language } = req.body;

    let fileName = '';
    let inputFileName = '';
    try {
        const tempDir = path.resolve('temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        fileName = path.join(tempDir, `code.${getFileExtension(language)}`);
        inputFileName = input ? path.join(tempDir, `input.txt`) : null;

        await writeFileAsync(fileName, code);
        if (input) await writeFileAsync(inputFileName, input);

        // Clean up old executable (Windows)
        if (fs.existsSync("code.exe")) await unlinkAsync("code.exe");

        const command = getExecutionCommand(language, fileName, inputFileName);
        exec(command, { timeout: 5000 }, async (error, stdout, stderr) => {
            await unlinkAsync(fileName).catch(() => {});
            if (inputFileName) await unlinkAsync(inputFileName).catch(() => {});

            if (error) {
                return res.status(500).json({
                    error: "Execution failed",
                    details: stderr || error.message,
                });
            }
            return res.status(200).json({ output: stdout });
        });
    } catch (err) {
        return res.status(500).json({
            error: "Server error",
            details: err.message,
        });
    }
};
