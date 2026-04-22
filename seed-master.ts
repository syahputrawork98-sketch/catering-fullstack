/// <reference types="node" />
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './src/lib/server/db/schema';
import crypto from 'crypto';
import argon2 from 'argon2';

// Configuration - Manually read from .env or use defaults
const DATABASE_URL = "postgres://catering_user:catering_password@localhost:5432/catering_hub";
const client = postgres(DATABASE_URL);
const db = drizzle(client, { schema });

async function seed() {
    console.log('--- SEED FUNCTION STARTED ---');
    console.log('🚀 Starting Master Seeding (Clean Slate)...');

    // 0. Clear Existing Data (Inverse Order of Dependencies)
    console.log('🧹 Clearing old data...');
    console.log(' - Clearing orderItems...'); await db.delete(schema.orderItems);
    console.log(' - Clearing orders...'); await db.delete(schema.orders);
    console.log(' - Clearing dailySchedules...'); await db.delete(schema.dailySchedules);
    console.log(' - Clearing expenses...'); await db.delete(schema.expenses);
    console.log(' - Clearing menus...'); await db.delete(schema.menus);
    console.log(' - Clearing menuCategories...'); await db.delete(schema.menuCategories);
    console.log(' - Clearing menuTypes...'); await db.delete(schema.menuTypes);
    console.log(' - Clearing users...'); await db.delete(schema.users);
    console.log('✨ Database cleared.');

    // 1. Seed Users
    console.log('👥 Seeding Users...');
    const adminId = '550e8400-e29b-41d4-a716-446655440000';
    const csId = crypto.randomUUID();
    const userId1 = crypto.randomUUID();
    const userId2 = crypto.randomUUID();

    const hashedPassword = await argon2.hash('password123');

    const mockUsers = [
        {
            id: adminId,
            name: 'Gourmet Admin',
            phone: '081234567890',
            password: hashedPassword, 
            role: 'ADMIN' as const,
            category: 'PUBLIK' as const,
            status: 'ACTIVE' as const
        },
        {
            id: csId,
            name: 'CS Sarah',
            phone: '081234567891',
            password: hashedPassword,
            role: 'CUSTOMER_SERVICE' as const,
            category: 'PUBLIK' as const,
            status: 'ACTIVE' as const
        },
        {
            id: userId1,
            name: 'Budi Santoso',
            phone: '081234567892',
            password: hashedPassword,
            role: 'USER' as const,
            category: 'PUBLIK' as const,
            status: 'ACTIVE' as const
        },
        {
            id: userId2,
            name: 'Andi (Pegawai RSUD)',
            phone: '081234567893',
            password: hashedPassword,
            role: 'USER' as const,
            category: 'INSTANSI_PEGAWAI' as const,
            instansiName: 'RSUD Kota',
            status: 'ACTIVE' as const
        },
        {
            id: crypto.randomUUID(),
            name: 'Procurement Pertamina',
            phone: '081234567894',
            password: hashedPassword,
            role: 'USER' as const,
            category: 'INSTANSI_BISNIS' as const,
            instansiName: 'PT Pertamina',
            status: 'ACTIVE' as const
        }
    ];

    for (const u of mockUsers) {
        await db.insert(schema.users).values(u).onConflictDoNothing();
    }

    const allUserIds = mockUsers.map(u => u.id);

    // 2. Seed Classification Tables
    console.log('📑 Seeding Menu Classifications...');
    const [dailyType] = await db.insert(schema.menuTypes).values({ name: 'Menu Daily', slug: 'daily' }).returning();
    const [paketType] = await db.insert(schema.menuTypes).values({ name: 'Menu Paket', slug: 'paket' }).returning();
    const [nasiKotakCat] = await db.insert(schema.menuCategories).values({ name: 'Nasi Kotak', slug: 'nasi-kotak' }).returning();
    const [buffetCat] = await db.insert(schema.menuCategories).values({ name: 'Prasmanan', slug: 'prasmanan' }).returning();

    // 3. Seed Menus
    console.log('🍱 Seeding Menus...');
    const menus = [
        { 
            id: crypto.randomUUID(), 
            name: 'Nasi Liwet Special Gourmet', 
            description: 'Nasi gurih khas Sunda dengan ayam goreng lengkuas, tahu, tempe, dan sambal terasi dadak.', 
            image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800&auto=format&fit=crop',
            basePrice: '45000', 
            typeId: dailyType.id, 
            categoryId: nasiKotakCat.id 
        },
        { 
            id: crypto.randomUUID(), 
            name: 'Beef Wellington Royal', 
            description: 'Daging sapi tenderloin premium yang dibalut dengan mushroom duxelles dan puff pastry renyah.', 
            image: 'https://images.unsplash.com/photo-151451687d520-17008039da4a?q=80&w=800&auto=format&fit=crop',
            basePrice: '185000', 
            typeId: paketType.id, 
            categoryId: buffetCat.id 
        },
        { 
            id: crypto.randomUUID(), 
            name: 'Grilled Salmon Glazed', 
            description: 'Salmon Atlantik panggang dengan saus madu mustard, disajikan dengan asparagus segar.', 
            image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop',
            basePrice: '125000', 
            typeId: dailyType.id, 
            categoryId: nasiKotakCat.id 
        },
        { 
            id: crypto.randomUUID(), 
            name: 'Corporate Buffet Package', 
            description: 'Paket lengkap prasmanan untuk acara kantor, mencakup menu pembuka, utama, hingga penutup.', 
            image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop',
            basePrice: '7500000', 
            typeId: paketType.id, 
            categoryId: buffetCat.id 
        }
    ];

    for (const m of menus) {
        try {
            await db.insert(schema.menus).values(m).onConflictDoNothing();
        } catch (err) {
            console.error(`❌ Failed to insert menu: ${m.name}`);
            console.error(err);
            if (typeof process !== 'undefined') process.exit(1);
        }
    }

    // 4. Seed Schedules (Next 7 days & Last 7 days)
    console.log('📅 Seeding Daily Schedules...');
    const today = new Date();
    for (let i = -7; i <= 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        // Assign random menu to each date
        const randomMenu = menus[Math.floor(Math.random() * menus.length)];
        // Use the typeId to check if it's a 'Daily' menu
        if (randomMenu.typeId === dailyType.id) {
            await db.insert(schema.dailySchedules).values({
                menuId: randomMenu.id,
                availableDate: dateStr,
                currentStock: 50
            }).onConflictDoNothing();
        }
    }

    // 5. Seed Expenses (Operational)
    console.log('💸 Seeding Expenses...');
    const expenseCategories = ['BELANJA', 'LOGISTIK', 'GAJI', 'PROMOSI'];
    for (let i = 0; i < 15; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - Math.floor(Math.random() * 30));
        await db.insert(schema.expenses).values({
            amount: (Math.floor(Math.random() * 500) * 1000).toString(),
            description: `Biaya operasional ${i + 1}`,
            category: expenseCategories[Math.floor(Math.random() * expenseCategories.length)],
            expenseDate: date.toISOString().split('T')[0],
            createdAt: date
        });
    }

    // 6. Seed Orders (Historical)
    console.log('🛒 Seeding Orders...');
    const statuses = ['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'] as const;
    for (let i = 0; i < 40; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - Math.floor(Math.random() * 30));
        
        const orderId = crypto.randomUUID();
        const randomUserId = allUserIds[Math.floor(Math.random() * allUserIds.length)];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const grandTotal = (Math.floor(Math.random() * 10) * 50000 + 100000).toString();

        await db.insert(schema.orders).values({
            id: orderId,
            userId: randomUserId,
            status: randomStatus,
            grandTotal: grandTotal,
            deliveryDate: date.toISOString().split('T')[0],
            createdAt: date
        });

        // Add 1-3 items per order
        const itemCount = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < itemCount; j++) {
            const randomMenu = menus[Math.floor(Math.random() * menus.length)];
            await db.insert(schema.orderItems).values({
                orderId: orderId,
                menuId: randomMenu.id,
                priceSnapshot: randomMenu.basePrice,
                quantity: Math.floor(Math.random() * 5) + 1
            });
        }
    }

    console.log('✅ Seeding Completed Successfully!');
    if (typeof process !== 'undefined') process.exit(0);
}


seed().catch(err => {
    console.error('❌ Seeding Failed:', err);
    if (typeof process !== 'undefined') process.exit(1);
});
