require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  mongodb: {
    url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ishaq-medical',
    options: isProduction ? {} : {},
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'migrations',
  migrationFileExtension: '.cjs',
  useFileHash: false,
  moduleSystem: 'commonjs',
};

module.exports = config;
