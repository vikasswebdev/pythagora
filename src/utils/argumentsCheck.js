const AVAILABLE_MODES = ['capture', 'test'];
const args = require('minimist')(process.argv.slice(2));

function logErrorAndExit(message) {
    console.error(message);
    process.exit(1);
}

if (!args.initScript) {
    logErrorAndExit(`
        Please provide the script that you use to start your Node.js app by adding --initScript <relative path to the file you would usually run to start your app>.

        Eg. --initScript ./app.js
        `);
} else if (!args.mode) {
    console.log('Mode not provided. Defaulting to "capture".');
    args.mode = 'capture';
} else if (!AVAILABLE_MODES.includes(args.mode)) {
    logErrorAndExit(`Mode "${args.mode}" not recognized. Available modes are: ${AVAILABLE_MODES.join(', ')}`);
}

if (args.rerun_all_failed) {
    if (args.mode !== 'test') logErrorAndExit(`Flag --rerun_all_failed allowed only in "--mode test"`);
}

console.log(`Running ${args.initScript} using Pythagora in '${args.mode.toUpperCase()}' mode.`);

module.exports = args
