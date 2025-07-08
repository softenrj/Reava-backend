import 'module-alias/register';
import logger from 'jet-logger';
import ENV from '@src/common/constants/ENV';
import server from './server';


const SERVER_START_MSG = (
  'Express server started on port: ' + ENV.Port.toString()
);


/******************************************************************************
                                  Run
******************************************************************************/

// Start the server
server.listen(ENV.Port,'0.0.0.0', err => {
  if (!!err) {
    logger.err(err.message);
  } else {
    logger.info(SERVER_START_MSG);
  }
});
