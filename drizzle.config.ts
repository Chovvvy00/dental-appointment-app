import { defineConfig } from 'drizzle-kit';

// if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: { url: 'postgresql://postgres.pczatzjxiesriccwliwi:SomethingWentWrong000@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres' },
	verbose: true,
	strict: true
});
