/* eslint-disable @typescript-eslint/no-explicit-any */
import redis from 'redis-mock';
import bluebird from 'bluebird';
import { RedisKeyGenerator } from '../../src/repositories/impl/redis/redisKeyGenerator';
bluebird.promisifyAll(redis);
export class AsyncRedisMock {
  client: any;
  constructor() {
    this.client = redis.createClient();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getClient(param?: unknown): any {
    return  this ;
  }
  async connect(): Promise<any>
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  {
   return 1;
  }
  async geoAdd(keyName1: any, param1:any): Promise<any>
  {
    return await this.client.zaddAsync(keyName1,parseInt(param1.member,10),await  RedisKeyGenerator.getSiteHashKey(parseInt(param1.member,10)));
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async geoSearch(keyName1: any, param1:any): Promise<any>
  {
    return await ['2','3','1'];
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async zRange(keyName1: string, param1:number, param2: number): Promise<any> {
    return await ['2','3','1'];
  }
 
  async keys(keyName: string): Promise<string> {
    return await this.client.keysAsync(keyName);
  }
  async sIsMember(keyName1: string, keyName2: string): Promise<boolean> {
    return await this.client.sismemberAsync(keyName1, keyName2);
  }
  async del(keyName: string): Promise<any> {
    return await this.client.delAsync(keyName);
  }
  async quit() {
    return await this.client.quitAsync()
  }
  async set(keyName: string, keyValue: any): Promise<any> {
    return await this.client.setAsync(keyName, keyValue)
  }
  async get(keyName: string): Promise<any> {
    return await this.client.getAsync(keyName)
  }
  async sMembers(keyName: string): Promise<object[]> {
    return await this.client.smembersAsync(keyName)
  }
  async hGetAll(keyName: string): Promise<any> {
    return await this.client.hgetallAsync(keyName)
  }
  async sAdd(keyName: string, keyValue: any): Promise<any> {
    return await this.client.saddAsync(keyName, keyValue);
  }
  async hSet(keyName: string, keyValue: any): Promise<any> {
    return await this.client.hmsetAsync(keyName, keyValue);
  }
  async incrBy(keyName: string, keyValue: number): Promise<number> {
    return await this.client.incrbyAsync(keyName, keyValue);
  }
  async rPush(keyName: string, keyValue: string[]) {
    return await this.client.rpushAsync(keyName, keyValue);
  }
  async lRange(keyName: string, arg1: number, arg2: number) {
    return await this.client.lrangeAsync(keyName, arg1, arg2);
  }
  async incrByFloat(keyName: string, keyValue: number) {
    return await this.client.incrbyfloatAsync(keyName, keyValue);
  }
}