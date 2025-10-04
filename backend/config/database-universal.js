import pkg from 'pg';
const { Pool } = pkg;

let db = null;

export async function initDatabase() {
    try {
        // Configuration pour production (PostgreSQL) ou développement (SQLite)
        if (process.env.DATABASE_TYPE === 'postgresql' || process.env.NODE_ENV === 'production') {
            // PostgreSQL pour production
            db = new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
            });
            
            console.log('✅ Connexion PostgreSQL établie');
            await createTablesPostgreSQL();
        } else {
            // SQLite pour développement local
            const sqlite3 = await import('sqlite3');
            const { open } = await import('sqlite');
            const path = await import('path');
            const { fileURLToPath } = await import('url');

            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);

            db = await open({
                filename: path.join(__dirname, '../database/teranga.db'),
                driver: sqlite3.default.Database
            });

            console.log('✅ Connexion SQLite établie (développement)');
            await createTablesSQLite();
        }
        
        return db;
    } catch (error) {
        console.error('❌ Erreur connexion base de données:', error);
        throw error;
    }
}

async function createTablesPostgreSQL() {
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            nom VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            mot_de_passe VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'visiteur',
            telephone VARCHAR(20),
            adresse TEXT,
            date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            derniere_connexion TIMESTAMP,
            statut VARCHAR(20) DEFAULT 'actif'
        )
    `;

    const createPropertiesTable = `
        CREATE TABLE IF NOT EXISTS properties (
            id SERIAL PRIMARY KEY,
            titre VARCHAR(255) NOT NULL,
            description TEXT,
            prix DECIMAL(15,2),
            type_propriete VARCHAR(100),
            surface DECIMAL(10,2),
            localisation VARCHAR(255),
            coordonnees_gps VARCHAR(100),
            proprietaire_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            statut VARCHAR(50) DEFAULT 'disponible',
            date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    const createTransactionsTable = `
        CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            propriete_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
            acheteur_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            vendeur_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            montant DECIMAL(15,2),
            type_transaction VARCHAR(100),
            statut VARCHAR(50) DEFAULT 'en_attente',
            hash_blockchain VARCHAR(255),
            date_transaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // Index pour optimiser les performances
    const createIndexes = `
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_properties_localisation ON properties(localisation);
        CREATE INDEX IF NOT EXISTS idx_properties_prix ON properties(prix);
        CREATE INDEX IF NOT EXISTS idx_properties_statut ON properties(statut);
        CREATE INDEX IF NOT EXISTS idx_transactions_propriete ON transactions(propriete_id);
    `;

    try {
        await db.query(createUsersTable);
        await db.query(createPropertiesTable);
        await db.query(createTransactionsTable);
        await db.query(createIndexes);
        console.log('✅ Tables PostgreSQL créées avec succès');
    } catch (error) {
        console.error('❌ Erreur création tables PostgreSQL:', error);
        throw error;
    }
}

async function createTablesSQLite() {
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            mot_de_passe TEXT NOT NULL,
            role TEXT DEFAULT 'visiteur',
            telephone TEXT,
            adresse TEXT,
            date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
            derniere_connexion DATETIME,
            statut TEXT DEFAULT 'actif'
        )
    `;

    const createPropertiesTable = `
        CREATE TABLE IF NOT EXISTS properties (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titre TEXT NOT NULL,
            description TEXT,
            prix DECIMAL(15,2),
            type_propriete TEXT,
            surface DECIMAL(10,2),
            localisation TEXT,
            coordonnees_gps TEXT,
            proprietaire_id INTEGER,
            statut TEXT DEFAULT 'disponible',
            date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (proprietaire_id) REFERENCES users(id)
        )
    `;

    const createTransactionsTable = `
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            propriete_id INTEGER,
            acheteur_id INTEGER,
            vendeur_id INTEGER,
            montant DECIMAL(15,2),
            type_transaction TEXT,
            statut TEXT DEFAULT 'en_attente',
            hash_blockchain TEXT,
            date_transaction DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (propriete_id) REFERENCES properties(id),
            FOREIGN KEY (acheteur_id) REFERENCES users(id),
            FOREIGN KEY (vendeur_id) REFERENCES users(id)
        )
    `;

    try {
        await db.exec(createUsersTable);
        await db.exec(createPropertiesTable);
        await db.exec(createTransactionsTable);
        console.log('✅ Tables SQLite créées avec succès');
    } catch (error) {
        console.error('❌ Erreur création tables SQLite:', error);
        throw error;
    }
}

export async function getDatabase() {
    if (!db) {
        db = await initDatabase();
    }
    return db;
}

// Fonction utilitaire pour exécuter des requêtes de manière compatible
export async function executeQuery(query, params = []) {
    const database = await getDatabase();
    
    if (process.env.DATABASE_TYPE === 'postgresql' || process.env.NODE_ENV === 'production') {
        // PostgreSQL - utilise $1, $2, etc.
        const result = await database.query(query, params);
        return result.rows;
    } else {
        // SQLite - utilise ?, ?, etc.
        if (query.toLowerCase().includes('select')) {
            return await database.all(query, params);
        } else {
            return await database.run(query, params);
        }
    }
}

export default { initDatabase, getDatabase, executeQuery };