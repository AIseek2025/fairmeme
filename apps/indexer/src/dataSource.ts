// src/data-source.ts
import { DataSource } from 'typeorm';
import {Token, Trade, Holders, TradeLog, InvitationLog, members} from './models/event';
import { DB_HOST,DB_PORT,DB_NAME,DB_USER, DB_PASS, debugLog } from './config';

debugLog(`Connecting to database at ${DB_HOST}:${DB_PORT}/${DB_NAME}`);
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username:  DB_USER,
  password:  DB_PASS,
  database: DB_NAME,
  synchronize: false,
  logging: false,
  entities: [Token,Trade,Holders,TradeLog,InvitationLog,members],
});
