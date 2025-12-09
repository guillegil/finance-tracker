// src/seed.ts
import { db } from "./shared/api/db";

async function main() {
    console.log("🌱 Starting Database Seed...");

    // 1. Create a User
    const user = await db.user.upsert({
        where: { email: "demo@finance.app" },
        update: {},
        create: {
            email: "demo@finance.app",
            username: "demouser",
            name: "Demo",
            surname: "User",
            passHash: "hashed_password_placeholder", // In real app, hash this!
        },
    });
    console.log(`👤 User created: ${user.id}`);

    // 2. Create a Currency (USD)
    const currency = await db.currency.create({
        data: {
            name: "Euro",
            symbol: "€",
            code: "EUR",
        },
    });
    console.log(`💵 Currency created: ${currency.id}`);

    // 3. Create a Category (Food)
    const category = await db.category.create({
        data: {
            name: "Food & Dining",
            avatar: "🍔",
        },
    });
    console.log(`🍔 Category created: ${category.id}`);

    // 4. Create an Account (Wallet)
    const account = await db.account.create({
        data: {
            name: "Cash Wallet",
            isMain: true,
            currencyId: currency.id,
            userId: user.id,
        },
    });
    console.log(`🏦 Account created: ${account.id}`);

    console.log("\n⚠️  COPY THESE VALUES FOR YOUR API TEST:");
    console.log(JSON.stringify({
        userId: user.id,
        accountId: account.id,
        categoryId: category.id,
        currencyId: currency.id
    }, null, 2));
}

main()
    .then(async () => {
        await db.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await db.$disconnect();
        process.exit(1);
    });