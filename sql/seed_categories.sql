-- Seed Default Categories
-- This file contains the SQL to insert all default categories
-- Alternatively, use: npm run db:seed (from backend directory)

-- Expense Categories (18 total)
INSERT INTO "Category" ("id", "name", "type", "icon", "color", "isDefault", "createdAt", "updatedAt") VALUES
('exp_001', 'Food & Dining', 'expense', '🍔', '#FF6B6B', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp_002', 'Groceries', 'expense', '🛒', '#4ECDC4', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp_003', 'Transportation', 'expense', '🚗', '#45B7D1', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp_004', 'Utilities', 'expense', '💡', '#FFA07A', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp_005', 'Entertainment', 'expense', '🎬', '#FFD93D', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp_006', 'Shopping', 'expense', '🛍️', '#FF69B4', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp_007', 'Healthcare', 'expense', '🏥', '#87CEEB', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp_008', 'Education', 'expense', '📚', '#DDA15E', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp_009', 'Travel', 'expense', '✈️', '#BC6C25', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp_010', 'Insurance', 'expense', '🛡️', '#6A4C93', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp_011', 'Rent/Mortgage', 'expense', '🏠', '#C7CEEA', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp_012', 'Phone & Internet', 'expense', '📱', '#B5B8DB', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp_013', 'Fitness', 'expense', '💪', '#90BE6D', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp_014', 'Subscriptions', 'expense', '🔄', '#F94144', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp_015', 'Gifts', 'expense', '🎁', '#F9C74F', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp_016', 'Personal Care', 'expense', '💇', '#D4A5A5', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp_017', 'Pet Care', 'expense', '🐕', '#FAAE7D', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp_018', 'Other', 'expense', '📌', '#9B9B9B', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Income Categories (7 total)
INSERT INTO "Category" ("id", "name", "type", "icon", "color", "isDefault", "createdAt", "updatedAt") VALUES
('inc_001', 'Salary', 'income', '💼', '#06D6A0', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('inc_002', 'Freelance', 'income', '💻', '#118AB2', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('inc_003', 'Bonus', 'income', '🎉', '#073B4C', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('inc_004', 'Investment Returns', 'income', '📈', '#EF476F', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('inc_005', 'Rental Income', 'income', '🏘️', '#FFD166', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('inc_006', 'Gifts Received', 'income', '🎁', '#06FFA5', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('inc_007', 'Other Income', 'income', '💰', '#88D8B0', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Transfer Categories (2 total)
INSERT INTO "Category" ("id", "name", "type", "icon", "color", "isDefault", "createdAt", "updatedAt") VALUES
('trf_001', 'Account to Account', 'transfer', '🔄', '#6C63FF', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('trf_002', 'Credit Card Payment', 'transfer', '💰', '#FFB702', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
