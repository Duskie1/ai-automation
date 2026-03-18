/**
 * Customer Storage Module
 *
 * Handles JSONL file operations for customer data persistence.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data directory path (relative to this module)
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const CUSTOMERS_FILE = path.join(DATA_DIR, 'customers.jsonl');

/**
 * Ensure data directory exists
 */
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Get the path to the customers.jsonl file
 * @returns {string} Path to customers.jsonl
 */
export function getCustomersFilePath() {
  return CUSTOMERS_FILE;
}

/**
 * Load all customers from JSONL file
 * @returns {Array} Array of customer objects
 */
export function loadCustomers() {
  ensureDataDir();

  if (!fs.existsSync(CUSTOMERS_FILE)) {
    return [];
  }

  const content = fs.readFileSync(CUSTOMERS_FILE, 'utf-8');
  const lines = content.trim().split('\n').filter(line => line.trim());

  return lines.map(line => {
    try {
      return JSON.parse(line);
    } catch {
      return null;
    }
  }).filter(customer => customer !== null);
}

/**
 * Save all customers to JSONL file
 * @param {Array} customers - Array of customer objects
 */
export function saveCustomers(customers) {
  ensureDataDir();

  const lines = customers.map(customer => JSON.stringify(customer));
  fs.writeFileSync(CUSTOMERS_FILE, lines.join('\n') + '\n', 'utf-8');
}

/**
 * Append a single customer to JSONL file
 * @param {Object} customer - Customer object to append
 */
export function appendCustomer(customer) {
  ensureDataDir();

  const line = JSON.stringify(customer) + '\n';
  fs.appendFileSync(CUSTOMERS_FILE, line, 'utf-8');
}
