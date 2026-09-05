const COLLECTION = '__migrations_backup';

async function ensureBackupCollection(db) {
  await db.createCollection(COLLECTION).catch((e) => {
    if (e.code !== 48 && e.codeName !== 'NamespaceExists') throw e;
  });
}

async function startBackup(db, { migrationId, type }) {
  await ensureBackupCollection(db);

  const existing = await db.collection(COLLECTION).findOne({
    migrationId,
    status: 'completed',
  });

  if (existing) {
    return { skip: true, existing, backupId: existing._id };
  }

  const inserted = await db.collection(COLLECTION).insertOne({
    migrationId,
    status: 'in_progress',
    type,
    startTime: new Date(),
    createdAt: new Date(),
  });

  return { skip: false, backupId: inserted.insertedId };
}

async function completeBackup(db, backupId, { summary, report, duration, extra = {} }) {
  await db.collection(COLLECTION).updateOne(
    { _id: backupId },
    {
      $set: {
        status: 'completed',
        endTime: new Date(),
        duration,
        summary,
        report,
        completedAt: new Date(),
        ...extra,
      },
    },
  );
}

async function failBackup(db, backupId, error, summary) {
  if (!backupId) return;
  await db.collection(COLLECTION).updateOne(
    { _id: backupId },
    {
      $set: {
        status: 'failed',
        endTime: new Date(),
        error: error.message,
        summary,
      },
    },
  );
}

async function removeBackup(db, migrationId) {
  await db.collection(COLLECTION).deleteMany({ migrationId });
}

function getUpdateCounts(result = {}) {
  return {
    matched: result.matchedCount ?? result.n ?? 0,
    modified: result.modifiedCount ?? result.nModified ?? 0,
  };
}

module.exports = {
  COLLECTION,
  startBackup,
  completeBackup,
  failBackup,
  removeBackup,
  getUpdateCounts,
  ensureBackupCollection,
};
