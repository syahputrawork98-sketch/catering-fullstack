import { pgTable, text, timestamp, primaryKey, integer, pgEnum, uuid, decimal, date, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { AdapterAccountType } from '@auth/core/adapters';

// --- Enums ---
export const roleEnum = pgEnum('role', ['ADMIN', 'CUSTOMER_SERVICE', 'USER']);
export const statusEnum = pgEnum('status', ['PENDING', 'ACTIVE']);
export const categoryEnum = pgEnum('category', ['PUBLIK', 'INSTANSI']);
export const orderStatusEnum = pgEnum('order_status', ['PENDING', 'PAID', 'CANCELLED', 'SHIPPED', 'COMPLETED']);
export const menuCategoryEnum = pgEnum('menu_category', ['DAILY', 'PAKET']);

// --- Auth.js Tables ---

export const users = pgTable('user', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name'),
	phone: text('phone').unique(),
	password: text('password'), // Hashed with Argon2
	role: roleEnum('role').default('USER').notNull(),
	category: categoryEnum('category').default('PUBLIK').notNull(),
	instansiName: text('instansi_name'),
	status: statusEnum('status').default('ACTIVE').notNull(), // Defaults to ACTIVE for PUBLIK, manual shift for INSTANSI
	image: text('image'),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull()
});

export const accounts = pgTable(
	'account',
	{
		userId: uuid('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').$type<AdapterAccountType>().notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state')
	},
	(account) => [
		{
			compoundKey: primaryKey({
				columns: [account.provider, account.providerAccountId]
			})
		}
	]
);

export const sessions = pgTable('session', {
	sessionToken: text('sessionToken').primaryKey(),
	userId: uuid('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date' }).notNull()
});

export const verificationTokens = pgTable(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull()
	},
	(vt) => [
		{
			compoundKey: primaryKey({ columns: [vt.identifier, vt.token] })
		}
	]
);

// --- Business Tables ---

export const menus = pgTable('menu', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	description: text('description'),
	image: text('image'),
	basePrice: decimal('base_price', { precision: 12, scale: 2 }).notNull(),
	category: menuCategoryEnum('category').default('DAILY').notNull(),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull()
});

export const dailySchedules = pgTable('daily_schedule', {
	id: serial('id').primaryKey(),
	menuId: uuid('menu_id')
		.notNull()
		.references(() => menus.id, { onDelete: 'cascade' }),
	availableDate: date('available_date', { mode: 'string' }).notNull(),
	currentStock: integer('current_stock').notNull().default(0),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull()
});

export const orders = pgTable('order', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'set null' }), // Keep orders even if user is deleted
	status: orderStatusEnum('status').default('PENDING').notNull(),
	grandTotal: decimal('grand_total', { precision: 12, scale: 2 }).notNull(),
	deliveryDate: date('delivery_date').notNull(),
	paymentProof: text('payment_proof'),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull()
});

export const orderItems = pgTable('order_item', {
	id: serial('id').primaryKey(),
	orderId: uuid('order_id')
		.notNull()
		.references(() => orders.id, { onDelete: 'cascade' }),
	menuId: uuid('menu_id')
		.notNull()
		.references(() => menus.id, { onDelete: 'set null' }),
	priceSnapshot: decimal('price_snapshot', { precision: 12, scale: 2 }).notNull(),
	quantity: integer('quantity').notNull().default(1)
});

// --- Relations ---

export const ordersRelations = relations(orders, ({ one, many }) => ({
	user: one(users, {
		fields: [orders.userId],
		references: [users.id]
	}),
	orderItems: many(orderItems)
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id]
	}),
	menu: one(menus, {
		fields: [orderItems.menuId],
		references: [menus.id]
	})
}));

export const usersRelations = relations(users, ({ many }) => ({
	orders: many(orders)
}));

export const menusRelations = relations(menus, ({ many }) => ({
	orderItems: many(orderItems),
	dailySchedules: many(dailySchedules)
}));

export const dailySchedulesRelations = relations(dailySchedules, ({ one }) => ({
	menu: one(menus, {
		fields: [dailySchedules.menuId],
		references: [menus.id]
	})
}));
