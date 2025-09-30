This project was updated to include Prisma for database access.

What's included:

- `prisma/schema.prisma` - Prisma schema with a simple `User` model
- `lib/prisma.ts` - Prisma client singleton wrapper
- `app/api/db-test/route.ts` - API route to list up to 5 users for quick testing

Local setup steps

1. Install new dependencies:
   npm install

2. Initialize the database (MySQL must be running and accessible via `DATABASE_URL` in `.env`).
   If the database `sintravels` doesn't exist yet, create it in MySQL:

   # Windows (cmd.exe)

   mysql -u root -p

   # then in mysql shell:

   CREATE DATABASE sintravels;

3. Run Prisma migrate or push the schema:
   npx prisma migrate dev --name init

4. Start the dev server:
   npm run dev

5. Test the DB route:
   Open http://localhost:3000/api/db-test

Notes:

- The `.env` already contains a `DATABASE_URL` based on earlier provided DB_HOST/USER. Edit if needed.
- For production, set proper environment variables and don't keep plaintext passwords in source control.
