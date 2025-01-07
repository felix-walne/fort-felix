function logToConsoleWithDelay(text: String): Promise<void>  {
    return new Promise((resolve) => {
        let index = 0;

        function logNextChar(): void {
            if (index < text.length) {
                process.stdout.write(text[index]); // Write the current character to the same line
                index++;
                setTimeout(logNextChar, 50); // Call logNextChar after the interval
            } else {
                console.log(); // Move to the next line after all characters are logged
                resolve(); // Resolve the promise once all characters have been logged
            }
        }

        logNextChar(); // Start logging characters
    });
}

export async function logToConsole(text: String) {
    await logToConsoleWithDelay(text);
}