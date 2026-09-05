const bcrypt = require('bcryptjs');
const { connectWithTLS, closeConnection } = require('./utils/mongooseConnection.cjs');
const { startBackup, completeBackup, failBackup, removeBackup, getUpdateCounts } = require('./utils/migrationBackup.cjs');

const MIGRATION_ID = '20260828121000-seed-admin-and-store-content';

const defaultSettings = {
  name: 'Ishaq Medical, Surgical & Cosmetics',
  shortName: 'Ishaq Medical',
  legalName: 'Ishaq Medical, Surgical & Cosmetics',
  tagline: 'Medicines, surgical care and skin essentials for Gilgit-Baltistan.',
  description:
    'Ishaq Medical, Surgical & Cosmetics is a healthcare retail store serving Gilgit-Baltistan with medicines, surgical and medical equipment, and cosmetics. Business contact details below are placeholders until verified by the store.',
  region: 'Gilgit-Baltistan, Pakistan',
  address: '[Address to be confirmed — Gilgit-Baltistan]',
  city: 'Gilgit',
  district: 'Gilgit',
  phone: '[Phone number to be confirmed]',
  whatsapp: '[WhatsApp number to be confirmed]',
  email: '[email to be confirmed]',
  openingHours: '[Opening hours to be confirmed]',
  licenseNumber: '[Pharmacy license number to be confirmed]',
  announcement:
    'Serving Gilgit-Baltistan · Authentic medicines, surgical supplies and skin care — details marked as placeholders until confirmed.',
  currency: 'PKR',
  currencySymbol: 'Rs',
  social: {},
  placeholders: {
    address: true,
    phone: true,
    whatsapp: true,
    email: true,
    hours: true,
    map: true,
    license: true,
    social: true,
  },
  seo: {
    title: 'Ishaq Medical, Surgical & Cosmetics | Medical Store in Gilgit',
    description:
      'Medical store in Gilgit-Baltistan for medicines, surgical and medical equipment, and cosmetics.',
    indexable: true,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const generateSummaryReport = (migrationSummary) => {
  const { summary } = migrationSummary;
  return [
    '\n=== MIGRATION SUMMARY REPORT ===',
    `Migration ID: ${MIGRATION_ID}`,
    `Duration: ${Math.round(migrationSummary.duration / 1000)} seconds`,
    `Status: ${migrationSummary.status}`,
    '',
    `Admin users upserted: ${summary.admins}`,
    `Store settings upserted: ${summary.settings}`,
    `Banners inserted: ${summary.banners}`,
    `FAQs inserted: ${summary.faqs}`,
    `Delivery zones inserted: ${summary.zones}`,
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
      summary: { admins: 0, settings: 0, banners: 0, faqs: 0, zones: 0 },
    };
    let migrationBackupId = null;

    try {
      await connectWithTLS();
      const started = await startBackup(db, { migrationId: MIGRATION_ID, type: 'seed-store-content' });
      if (started.skip) {
        console.log('Migration already completed, skipping...');
        return;
      }
      migrationBackupId = started.backupId;

      const email = (process.env.ADMIN_EMAIL || 'admin@ishaq.local').toLowerCase();
      const password = process.env.ADMIN_PASSWORD || 'Admin123!';
      const hash = await bcrypt.hash(password, 10);

      const adminResult = await db.collection('users').updateOne(
        { email },
        {
          $setOnInsert: {
            name: 'Ishaq Admin',
            email,
            password: hash,
            role: 'superAdmin',
            isSuperAdmin: true,
            active: true,
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        { upsert: true },
      );
      migrationSummary.summary.admins = adminResult.upsertedCount || adminResult.modifiedCount || 0;

      const settingsCount = await db.collection('storesettings').countDocuments();
      if (settingsCount === 0) {
        await db.collection('storesettings').insertOne(defaultSettings);
        migrationSummary.summary.settings = 1;
      }

      const bannerCount = await db.collection('banners').countDocuments();
      if (bannerCount === 0) {
        const banners = [
          {
            title: 'Medicines for Gilgit-Baltistan',
            subtitle: 'Prescription and OTC care from a local medical store. Placeholder contact details until confirmed.',
            ctaLabel: 'Shop medicines',
            ctaHref: '/medicines',
            tone: 'teal',
            imageLabel: 'Medicines',
            active: true,
            sortOrder: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            title: 'Surgical & medical equipment',
            subtitle: 'Clinic and home-care supplies. Confirm availability with the store before travel.',
            ctaLabel: 'Browse surgical',
            ctaHref: '/surgical',
            tone: 'navy',
            imageLabel: 'Surgical',
            active: true,
            sortOrder: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            title: 'Skin care & cosmetics',
            subtitle: 'Daily skin essentials. Not personal dermatology advice.',
            ctaLabel: 'Shop cosmetics',
            ctaHref: '/cosmetics',
            tone: 'mint',
            imageLabel: 'Cosmetics',
            active: true,
            sortOrder: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
        const inserted = await db.collection('banners').insertMany(banners);
        migrationSummary.summary.banners = inserted.insertedCount;
      }

      const faqCount = await db.collection('faqs').countDocuments();
      if (faqCount === 0) {
        const faqs = [
          { question: 'Do you deliver in Gilgit-Baltistan?', answer: 'Delivery coverage is listed on the delivery page. Confirm the current area list with the store — some fields are still placeholders.', group: 'delivery', sortOrder: 1, active: true, createdAt: new Date(), updatedAt: new Date() },
          { question: 'How do I send a prescription?', answer: 'Use the prescription upload page. A pharmacist reviews the request before any medicine is prepared. This is not an emergency service.', group: 'prescription', sortOrder: 2, active: true, createdAt: new Date(), updatedAt: new Date() },
          { question: 'Which payment methods are available?', answer: 'Cash on delivery and store pickup are supported in the demo checkout. Other methods can be enabled from admin settings when the store confirms them.', group: 'ordering', sortOrder: 3, active: true, createdAt: new Date(), updatedAt: new Date() },
        ];
        const inserted = await db.collection('faqs').insertMany(faqs);
        migrationSummary.summary.faqs = inserted.insertedCount;
      }

      const zoneCount = await db.collection('deliveryzones').countDocuments();
      if (zoneCount === 0) {
        const zones = [
          { name: 'Gilgit city', district: 'Gilgit', areas: ['Jutial', 'Airport road'], estimatedDays: '1-2', notes: 'Confirm coverage with the store.', active: true, createdAt: new Date(), updatedAt: new Date() },
          { name: 'Hunza', district: 'Hunza', areas: ['Karimabad', 'Aliabad'], estimatedDays: '3-5', notes: 'Weather and road conditions may delay delivery.', active: true, createdAt: new Date(), updatedAt: new Date() },
        ];
        const inserted = await db.collection('deliveryzones').insertMany(zones);
        migrationSummary.summary.zones = inserted.insertedCount;
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
      const email = (process.env.ADMIN_EMAIL || 'admin@ishaq.local').toLowerCase();
      await db.collection('users').deleteOne({ email, role: 'superAdmin' });
      await removeBackup(db, MIGRATION_ID);
      console.log('Seeded admin and backup record removed. Content collections were left in place.');
    } catch (error) {
      console.error('Error during migration down:', error);
      throw error;
    } finally {
      await closeConnection();
    }
  },
};
