const { connectWithTLS, closeConnection } = require('./utils/mongooseConnection.cjs');
const { startBackup, completeBackup, failBackup, removeBackup } = require('./utils/migrationBackup.cjs');

const MIGRATION_ID = '20260828120000-create-indexes-and-backup-collection';

const generateSummaryReport = (migrationSummary) => {
  const { summary } = migrationSummary;
  return [
    '\n=== MIGRATION SUMMARY REPORT ===',
    `Migration ID: ${MIGRATION_ID}`,
    `Duration: ${Math.round(migrationSummary.duration / 1000)} seconds`,
    `Status: ${migrationSummary.status}`,
    '',
    'INDEXES:',
    '-'.repeat(80),
    `Collections ensured: ${summary.collections.join(', ')}`,
    `Indexes created: ${summary.indexesCreated}`,
    '-'.repeat(80),
    '',
    '='.repeat(80),
  ].join('\n');
};

module.exports = {
  async up(db) {
    const migrationSummary = {
      startTime: new Date(),
      endTime: null,
      status: 'running',
      summary: { collections: [], indexesCreated: 0 },
    };
    let migrationBackupId = null;

    try {
      await connectWithTLS();

      const started = await startBackup(db, {
        migrationId: MIGRATION_ID,
        type: 'create-indexes',
      });

      if (started.skip) {
        console.log('Migration already completed, skipping...');
        return;
      }
      migrationBackupId = started.backupId;

      const collections = [
        'users',
        'tokens',
        'products',
        'categories',
        'brands',
        'manufacturers',
        'inventorybatches',
        'orders',
        'prescriptions',
        'reviews',
        'blogposts',
        'banners',
        'deals',
        'faqs',
        'deliveryzones',
        'storesettings',
        'inquiries',
        'newsletters',
        'coupons',
        'activitylogs',
        '__migrations_backup',
      ];

      for (const name of collections) {
        await db.createCollection(name).catch((e) => {
          if (e.code !== 48 && e.codeName !== 'NamespaceExists') throw e;
        });
      }
      migrationSummary.summary.collections = collections;

      const indexes = [
        ['users', { email: 1 }, { unique: true }],
        ['products', { slug: 1 }, { unique: true }],
        ['products', { sku: 1 }, { unique: true }],
        ['products', { categoryId: 1, active: 1 }, {}],
        ['products', { name: 'text', genericName: 'text', saltName: 'text', sku: 'text', searchKeywords: 'text' }, { name: 'product_text' }],
        ['categories', { slug: 1 }, { unique: true }],
        ['brands', { slug: 1 }, { unique: true }],
        ['orders', { publicRef: 1 }, { unique: true }],
        ['orders', { status: 1, createdAt: -1 }, {}],
        ['prescriptions', { status: 1, createdAt: -1 }, {}],
        ['inventorybatches', { productId: 1, batchNumber: 1 }, { unique: true }],
        ['inventorybatches', { expiryDate: 1 }, {}],
        ['blogposts', { slug: 1 }, { unique: true }],
        ['activitylogs', { createdAt: -1 }, {}],
        ['newsletters', { email: 1 }, { unique: true }],
        ['coupons', { code: 1 }, { unique: true }],
      ];

      for (const [collection, spec, options] of indexes) {
        await db.collection(collection).createIndex(spec, options);
        migrationSummary.summary.indexesCreated += 1;
      }

      migrationSummary.endTime = new Date();
      migrationSummary.status = 'completed';
      migrationSummary.duration = migrationSummary.endTime - migrationSummary.startTime;
      const report = generateSummaryReport(migrationSummary);
      console.log(report);

      await completeBackup(db, migrationBackupId, {
        summary: migrationSummary.summary,
        report,
        duration: migrationSummary.duration,
      });
      console.log(`Summary updated in __migrations_backup with _id: ${migrationBackupId}`);
      console.log('Migration completed successfully.');
    } catch (error) {
      await failBackup(db, migrationBackupId, error, migrationSummary.summary);
      console.error('Error during migration:', error);
      throw error;
    } finally {
      await closeConnection();
    }
  },

  async down(db) {
    try {
      await connectWithTLS();
      await removeBackup(db, MIGRATION_ID);
      console.log('Migration backup record removed.');
    } catch (error) {
      console.error('Error during migration down:', error);
      throw error;
    } finally {
      await closeConnection();
    }
  },
};
