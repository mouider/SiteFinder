/* eslint-disable @typescript-eslint/no-explicit-any */
import * as client from 'redis';
import config from 'config';

interface Tls {
  key: string;
  cert: string;
  ca: string;
}
interface ClientOptions {
  host: string;
  port: number;
  password?: string;
  connectTimeout?: number;
  url?: string;
  tls?: Tls;
  max_retry?: number;
  period?: number;
}
function setConfig(options?: ClientOptions): ClientOptions {
  if (config.has('dataStores.redis.host')) {
    options = {
      host: config.get('dataStores.redis.host'),
      port: config.get('dataStores.redis.port')
    };
    if (config.has('dataStores.redis.connectTimeout')) {
      options.connectTimeout = config.get('dataStores.redis.connectTimeout');
    }
    if (config.has('dataStores.redis.url')) {
      options.url = config.get('dataStores.redis.url');
    }
    if (config.has('dataStores.redis.password')) {
      options.password = config.get('dataStores.redis.password');
    }
    if (config.has('dataStores.redis.tls')) {
      options.tls = config.get('dataStores.redis.tls')
    }
    if (config.has('dataStores.redis.retry')) {
      options.max_retry = config.get('dataStores.redis.retry.max_retry');
      options.period = config.get('dataStores.redis.retry.period');
    }
    return options;
  }
}

export function getClient(clientConfig?: ClientOptions) {
  const connectionConfig = clientConfig ? clientConfig : setConfig();
  const redis_client = client.createClient(
    {
      socket:
      {
        host: connectionConfig.host,
        port: connectionConfig.port,
        connectTimeout: connectionConfig.connectTimeout,
        reconnectStrategy: (attempt: any) => {
          if (attempt > connectionConfig.max_retry) {
            return new Error('Retry attempts exhausted.');
          }
          // Try again after a period of time...
          return (attempt * connectionConfig.period);
        }
      }
    }
  );
  return redis_client;
}



