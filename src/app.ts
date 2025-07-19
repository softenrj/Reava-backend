import chalk from "chalk";
import ENV from "./common/constants/ENV";
import app from "./server";
import chalkAnimation from 'chalk-animation';
import logger from "primelogger";

const SPINNER_FRAMES = ['|', '/', '-', '\\'];
let spinnerIndex = 0;

const SERVER_START_MSG = `🚀 Express server started on port: ${ENV.Port}`;

// Start spinner simulation
const startSpinner = (text: string) => {
  const interval = setInterval(() => {
    const frame = SPINNER_FRAMES[spinnerIndex++ % SPINNER_FRAMES.length];
    process.stdout.write(`\r${chalk.magentaBright(frame)} ${text}`);
  }, 100);
  return () => clearInterval(interval);
};

// Start Server
app.listen(ENV.Port, (err) => {
  if (err) {
    logger.error(chalk.redBright(err.message));
  } else {
    const stop = startSpinner(`Starting server on port ${ENV.Port}...`);

    // Wait 1s then show fancy message
    setTimeout(() => {
      stop(); // stop spinner
      const rainbow = chalkAnimation.rainbow(SERVER_START_MSG);
      setTimeout(() => rainbow.stop(), 3000); // stop animation after 3s
    }, 1000);
  }
});

