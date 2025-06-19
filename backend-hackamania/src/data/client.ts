// import { Pool } from 'pg';
// import dotenv from 'dotenv';
// 
// dotenv.config();
// 
// const pool = new Pool({
    // host: process.env.PGHOST!,
    // user: process.env.PGUSER!,
    // password: process.env.PGPASSWORD!,
    // database: process.env.PGDATABASE!,
    // port: Number(process.env.PGPORT!),
// });
// 
// export default pool;
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;