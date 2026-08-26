import { PrismaClient } from "@prisma/client";

async function testCredentials() {
  const passwords = ["postgres", "admin", "root", "1234", "123456", "password", "surya"];
  const users = ["postgres", "root"];

  for (const user of users) {
    for (const pass of passwords) {
      const url = `postgresql://${user}:${pass}@localhost:5432/postgres?schema=public`;
      const client = new PrismaClient({
        datasources: {
          db: { url },
        },
      });
      try {
        await client.$connect();
        console.log(`🎉 SUCCESS: Connected to PostgreSQL with ${user}:${pass}`);
        await client.$disconnect();
        return url;
      } catch (err) {
        await client.$disconnect();
      }
    }
  }
  console.log("Could not auto-connect with standard default passwords.");
  return null;
}

testCredentials();
