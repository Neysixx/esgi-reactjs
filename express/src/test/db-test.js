const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.$connect()
    .then(() => {
        console.log('✅ Connexion réussie à MySQL avec Prisma');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Erreur de connexion Prisma:', err);
        process.exit(1);
    });
