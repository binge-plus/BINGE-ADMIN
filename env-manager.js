import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_key';
const ENV_FILE = path.join(__dirname, '.env');
const ENCRYPTED_FILE = path.join(__dirname, 'workflow-monitoring-dashboard-env.enc');

function encryptEnv() {
  try {
    if (!fs.existsSync(ENV_FILE)) {
      console.error('Error: .env file not found');
      process.exit(1);
    }

    execSync(`openssl enc -aes-256-cbc -in ${ENV_FILE} -out ${ENCRYPTED_FILE} -pass pass:${ENCRYPTION_KEY}`);
    console.log('Environment file encrypted successfully');
  } catch (error) {
    console.error('Error encrypting environment file:', error);
    process.exit(1);
  }
}

function decryptEnv() {
  try {
    if (!fs.existsSync(ENCRYPTED_FILE)) {
      console.error('Error: Encrypted environment file not found');
      process.exit(1);
    }

    execSync(`openssl enc -d -aes-256-cbc -in ${ENCRYPTED_FILE} -out ${ENV_FILE} -pass pass:${ENCRYPTION_KEY}`);
    console.log('Environment file decrypted successfully');
  } catch (error) {
    console.error('Error decrypting environment file:', error);
    process.exit(1);
  }
}

// Handle command line arguments
const command = process.argv[2];

switch (command) {
  case 'encrypt':
    encryptEnv();
    break;
  case 'decrypt':
    decryptEnv();
    break;
  default:
    console.log('Usage: node env-manager.js [encrypt|decrypt]');
    process.exit(1);
} 