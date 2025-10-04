import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;

export async function initDatabase() {
    try {
        // Ouvrir la base de données SQLite
        db = await open({
            filename: path.join(__dirname, '../database/teranga.db'),
            driver: sqlite3.Database
        });

        console.log('✅ Connexion SQLite établie');

        // Créer les tables si elles n'existent pas
        await createTables();
        
        return db;
    } catch (error) {
        console.error('❌ Erreur connexion SQLite:', error);
        throw error;
    }
}

async function createTables() {
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
        console.log('✅ Tables créées avec succès');
    } catch (error) {
        console.error('❌ Erreur création tables:', error);
        throw error;
    }
}

export async function getDatabase() {
    if (!db) {
        db = await initDatabase();
    }
    return db;
}

export default { initDatabase, getDatabase };