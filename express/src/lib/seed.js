const prisma = require('./prisma');
const bcrypt = require('bcrypt');

async function seed() {
    try {
        console.log('🌱 Seeding database...');
        
        // Create tables if they don't exist
        const tableCount = await prisma.table.count();
        if (tableCount === 0) {
            console.log('Creating tables...');
            
            await prisma.table.createMany({
                data: [
                    { seats: 2 },
                    { seats: 2 },
                    { seats: 2 },
                    { seats: 4 },
                    { seats: 4 },
                    { seats: 4 },
                    { seats: 6 },
                    { seats: 6 },
                    { seats: 8 }
                ]
            });
            
            console.log('Created 9 tables.');
        }
        
        // Create admin user if it doesn't exist
        const adminExists = await prisma.user.findUnique({
            where: { email: 'admin@restaurant.com' }
        });
        
        if (!adminExists) {
            console.log('Creating admin user...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            await prisma.user.create({
                data: {
                    email: 'admin@restaurant.com',
                    password: hashedPassword,
                    fname: 'Admin',
                    lname: 'Restaurant',
                    phone: '0600000000',
                    role: 'admin'
                }
            });
            
            console.log('Admin user created.');
        }
        
        // Create client user if it doesn't exist
        const clientExists = await prisma.user.findUnique({
            where: { email: 'client@example.com' }
        });
        
        if (!clientExists) {
            console.log('Creating client user...');
            const hashedPassword = await bcrypt.hash('client123', 10);
            
            await prisma.user.create({
                data: {
                    email: 'client@example.com',
                    password: hashedPassword,
                    fname: 'Client',
                    lname: 'Test',
                    phone: '0611111111',
                    role: 'client'
                }
            });
            
            console.log('Client user created.');
        }
        
        // Create menu items if they don't exist
        const menuItemCount = await prisma.menuItem.count();
        if (menuItemCount === 0) {
            console.log('Creating menu items...');
            
            const menuItems = [
                // Entrées
                { name: 'Salade César', description: 'Salade romaine, croûtons, parmesan et sauce césar', price: 8.50, category: 'entrées' },
                { name: 'Soupe à l\'oignon', description: 'Soupe à l\'oignon gratinée au fromage', price: 7.50, category: 'entrées' },
                { name: 'Foie gras', description: 'Foie gras mi-cuit et sa confiture d\'oignons', price: 15.00, category: 'entrées' },
                
                // Plats
                { name: 'Entrecôte', description: 'Entrecôte grillée avec frites maison et sauce au poivre', price: 22.50, category: 'plats' },
                { name: 'Magret de canard', description: 'Magret de canard rôti aux fruits rouges', price: 19.50, category: 'plats' },
                { name: 'Risotto aux champignons', description: 'Risotto crémeux aux champignons sauvages', price: 16.00, category: 'plats' },
                
                // Desserts
                { name: 'Crème brûlée', description: 'Crème brûlée à la vanille', price: 7.00, category: 'desserts' },
                { name: 'Fondant au chocolat', description: 'Fondant au chocolat et sa boule de glace vanille', price: 8.00, category: 'desserts' },
                { name: 'Tarte Tatin', description: 'Tarte Tatin et sa chantilly maison', price: 7.50, category: 'desserts' },
                
                // Boissons
                { name: 'Vin rouge', description: 'Verre de vin rouge du moment', price: 5.00, category: 'boissons' },
                { name: 'Vin blanc', description: 'Verre de vin blanc du moment', price: 5.00, category: 'boissons' },
                { name: 'Eau minérale', description: 'Bouteille d\'eau minérale (50cl)', price: 3.50, category: 'boissons' }
            ];
            
            await prisma.menuItem.createMany({ data: menuItems });
            
            console.log(`Created ${menuItems.length} menu items.`);
        }
        
        console.log('✅ Seeding completed successfully.');
    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// If this file is run directly
if (require.main === module) {
    seed();
}

module.exports = seed; 