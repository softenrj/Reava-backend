import jetEnv, { num } from 'jet-env';
import { isEnumVal } from 'jet-validators';
import 'dotenv/config'

export enum NodeEnvs {
  Development = 'development',
  Production = 'production',
  Test = 'test'
}

const ENV = jetEnv({
  NodeEnv: isEnumVal(NodeEnvs),
  Port: num,
});

export default ENV;
