/**
 * Customer Operations Module
 *
 * Provides CRUD operations for customer management.
 */

import { loadCustomers, saveCustomers } from './storage.js';

/**
 * List all customers with summary information
 * @returns {Object} Object with customers array and count
 */
export function listCustomers() {
  const customers = loadCustomers();

  const summaries = customers.map(c => ({
    name: c.name,
    customer_name: c.config?.customer_name,
    business_type: c.config?.business_type,
    locations: c.config?.locations || []
  }));

  return {
    customers: summaries,
    count: summaries.length
  };
}

/**
 * Get a specific customer by name
 * @param {string} name - Customer name (slug)
 * @returns {Object|null} Customer object or null if not found
 */
export function getCustomer(name) {
  const customers = loadCustomers();
  const customer = customers.find(c => c.name === name);

  if (!customer) {
    return null;
  }

  return customer;
}

/**
 * Get knowledge base for a specific customer
 * @param {string} name - Customer name (slug)
 * @returns {Object} Object with knowledge_base or error
 */
export function getKnowledgeBase(name) {
  const customer = getCustomer(name);

  if (!customer) {
    return { error: `Customer '${name}' not found` };
  }

  return {
    name: customer.name,
    customer_name: customer.config?.customer_name,
    knowledge_base: customer.config?.knowledge_base || ''
  };
}

/**
 * Create a new customer
 * @param {string} name - Customer name (slug)
 * @param {Object} config - Customer configuration
 * @returns {Object} Created customer or error
 */
export function createCustomer(name, config) {
  const customers = loadCustomers();

  // Check if customer already exists
  if (customers.find(c => c.name === name)) {
    return { error: `Customer '${name}' already exists` };
  }

  const now = new Date().toISOString();
  const customer = {
    name,
    config,
    created_at: now,
    updated_at: now
  };

  customers.push(customer);
  saveCustomers(customers);

  return { success: true, customer };
}

/**
 * Update an existing customer
 * @param {string} name - Customer name (slug)
 * @param {Object} updates - Fields to update in config
 * @returns {Object} Updated customer or error
 */
export function updateCustomer(name, updates) {
  const customers = loadCustomers();
  const index = customers.findIndex(c => c.name === name);

  if (index === -1) {
    return { error: `Customer '${name}' not found` };
  }

  // Merge updates into config
  customers[index].config = {
    ...customers[index].config,
    ...updates
  };
  customers[index].updated_at = new Date().toISOString();

  saveCustomers(customers);

  return { success: true, customer: customers[index] };
}

/**
 * Delete a customer
 * @param {string} name - Customer name (slug)
 * @returns {Object} Success or error
 */
export function deleteCustomer(name) {
  const customers = loadCustomers();
  const index = customers.findIndex(c => c.name === name);

  if (index === -1) {
    return { error: `Customer '${name}' not found` };
  }

  const deleted = customers.splice(index, 1)[0];
  saveCustomers(customers);

  return { success: true, deleted };
}

/**
 * Search customers by query
 * @param {string} query - Search query
 * @returns {Object} Object with matching customers array
 */
export function searchCustomers(query) {
  const customers = loadCustomers();
  const queryLower = query.toLowerCase();

  const matches = customers.filter(c => {
    const config = c.config || {};

    // Search in name
    if (c.name.toLowerCase().includes(queryLower)) return true;

    // Search in customer_name
    if (config.customer_name?.toLowerCase().includes(queryLower)) return true;

    // Search in business_type
    if (config.business_type?.toLowerCase().includes(queryLower)) return true;

    // Search in locations
    if (config.locations?.some(loc => loc.toLowerCase().includes(queryLower))) return true;

    // Search in services
    if (config.services?.some(svc => svc.toLowerCase().includes(queryLower))) return true;

    // Search in knowledge_base
    if (config.knowledge_base?.toLowerCase().includes(queryLower)) return true;

    // Search in boosted_keywords
    if (config.boosted_keywords?.some(kw => kw.toLowerCase().includes(queryLower))) return true;

    return false;
  });

  return {
    query,
    matches: matches.map(c => ({
      name: c.name,
      customer_name: c.config?.customer_name,
      business_type: c.config?.business_type,
      locations: c.config?.locations || []
    })),
    count: matches.length
  };
}
