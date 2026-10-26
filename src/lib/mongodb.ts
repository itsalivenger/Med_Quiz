// ─────────────────────────────────────────────────────────────
//  MedQuiz — MongoDB Connection & Resilient Database Client
// ─────────────────────────────────────────────────────────────

export interface UserDocument {
  _id?: string;
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  name: string;
  year?: string;
  faculty?: string;
  role: 'student' | 'admin';
  createdAt: string;
  lastLoginAt?: string;
}

export interface AttemptDocument {
  _id?: string;
  id: string;
  userId: string;
  courseId: string;
  score: number;
  total: number;
  mode: 'static' | 'dynamic';
  createdAt: string;
}

export interface QuestionDocument {
  _id?: string;
  id: string;
  itemCode: string;
  year: string;
  matter: string;
  vignette: string;
  status: 'valid' | 'review';
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  author: string;
  createdAt: string;
}

export interface TicketDocument {
  _id?: string;
  id: string;
  date: string;
  student: string;
  subject: string;
  item: string;
  status: 'open' | 'resolved';
  createdAt: string;
}

// In-memory fallback storage in case MongoDB is not yet reached or during initial dev setup
class MemoryDatabase {
  users: Map<string, UserDocument> = new Map();
  attempts: AttemptDocument[] = [];
  questions: QuestionDocument[] = [
    {
      id: 'q-101',
      itemCode: 'ITEM-15-A',
      year: '1ère Année',
      matter: 'Anatomie',
      vignette: 'Rapports anatomiques du nerf axillaire dans l’espace axillaire latéral (quadrilatère de Velpeau).',
      status: 'valid',
      difficulty: 'Moyen',
      author: 'Pr. D. Mercier (Collège Anatomie)',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'q-102',
      itemCode: 'ITEM-224',
      year: '3ème Année',
      matter: 'Cardiologie',
      vignette: 'Diagnostic différentiel d’une élévation du segment ST chez un patient de 24 ans sans facteur de risque.',
      status: 'valid',
      difficulty: 'Difficile',
      author: 'Dr. E. Benali (SFC)',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'q-103',
      itemCode: 'ITEM-88',
      year: '2ème Année',
      matter: 'Pharmacologie',
      vignette: 'Mécanisme d’action et effets indésirables des inhibiteurs de l’enzyme de conversion (IEC).',
      status: 'review',
      difficulty: 'Moyen',
      author: 'Modérateur IA (Revue requise)',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'q-104',
      itemCode: 'ITEM-312',
      year: '4ème Année',
      matter: 'Pédiatrie',
      vignette: 'Prise en charge d’une bronchiolite aiguë du nourrisson de moins de 3 mois fébrile.',
      status: 'valid',
      difficulty: 'Facile',
      author: 'Collège de Pédiatrie',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'q-105',
      itemCode: 'ITEM-142',
      year: '1ère Année',
      matter: 'Biochimie',
      vignette: 'Régulation allostérique de la phosphofructokinase-1 (PFK-1) lors de la glycolyse hépatique.',
      status: 'valid',
      difficulty: 'Difficile',
      author: 'Comité PACES',
      createdAt: new Date().toISOString(),
    },
  ];
  tickets: TicketDocument[] = [
    {
      id: 'tic-1',
      date: new Date().toISOString().split('T')[0],
      student: 's.lemaire@u-paris.fr',
      subject: 'Correction ambiguë ITEM-15-A',
      item: 'ITEM-15-A',
      status: 'open',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tic-2',
      date: new Date().toISOString().split('T')[0],
      student: 'thomas.b@sorbonne.fr',
      subject: 'Signalement explication item 224',
      item: 'ITEM-224',
      status: 'resolved',
      createdAt: new Date().toISOString(),
    },
  ];
}

// Global cached client across hot-reloads
declare global {
  // eslint-disable-next-line no-var
  var __medquiz_mongo_client: unknown;
  // eslint-disable-next-line no-var
  var __medquiz_memory_db: MemoryDatabase | undefined;
}

const memoryDb: MemoryDatabase = global.__medquiz_memory_db || new MemoryDatabase();
if (process.env.NODE_ENV !== 'production') {
  global.__medquiz_memory_db = memoryDb;
}

export async function getDb() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'medquiz';

  const isConfigured =
    uri &&
    uri.trim().length > 0 &&
    !uri.includes('<username>') &&
    !uri.includes('<password>');

  if (!isConfigured) {
    // Return memory adapter
    return {
      isMemory: true,
      users: {
        async findOne(query: { email?: string; id?: string }) {
          for (const u of memoryDb.users.values()) {
            if (query.email && u.email.toLowerCase() === query.email.toLowerCase()) return u;
            if (query.id && u.id === query.id) return u;
          }
          return null;
        },
        async insertOne(doc: UserDocument) {
          memoryDb.users.set(doc.id, doc);
          return { insertedId: doc.id };
        },
        async updateOne(query: { id: string }, update: { $set: Partial<UserDocument> }) {
          const user = memoryDb.users.get(query.id);
          if (user && update.$set) {
            Object.assign(user, update.$set);
          }
          return { modifiedCount: user ? 1 : 0 };
        },
        async countDocuments() {
          return memoryDb.users.size;
        },
      },
      attempts: {
        async find(query: { userId?: string }) {
          let list = memoryDb.attempts;
          if (query.userId) {
            list = list.filter((a) => a.userId === query.userId);
          }
          return {
            async toArray() {
              return [...list].reverse();
            },
          };
        },
        async insertOne(doc: AttemptDocument) {
          memoryDb.attempts.push(doc);
          return { insertedId: doc.id };
        },
        async insertMany(docs: AttemptDocument[]) {
          memoryDb.attempts.push(...docs);
          return { insertedCount: docs.length };
        },
        async countDocuments() {
          return memoryDb.attempts.length;
        },
      },
      questions: {
        async find() {
          return {
            async toArray() {
              return [...memoryDb.questions];
            },
          };
        },
        async insertOne(doc: QuestionDocument) {
          memoryDb.questions.unshift(doc);
          return { insertedId: doc.id };
        },
        async deleteOne(query: { id: string }) {
          const prevLen = memoryDb.questions.length;
          memoryDb.questions = memoryDb.questions.filter((q) => q.id !== query.id);
          return { deletedCount: prevLen - memoryDb.questions.length };
        },
        async updateOne(query: { id: string }, update: { $set: Partial<QuestionDocument> }) {
          const q = memoryDb.questions.find((x) => x.id === query.id);
          if (q && update.$set) {
            Object.assign(q, update.$set);
          }
          return { modifiedCount: q ? 1 : 0 };
        },
        async countDocuments(query?: { status?: string }) {
          if (query?.status) {
            return memoryDb.questions.filter((q) => q.status === query.status).length;
          }
          return memoryDb.questions.length;
        },
      },
      tickets: {
        async find() {
          return {
            async toArray() {
              return [...memoryDb.tickets];
            },
          };
        },
        async insertOne(doc: TicketDocument) {
          memoryDb.tickets.unshift(doc);
          return { insertedId: doc.id };
        },
        async updateOne(query: { id: string }, update: { $set: Partial<TicketDocument> }) {
          const t = memoryDb.tickets.find((x) => x.id === query.id);
          if (t && update.$set) {
            Object.assign(t, update.$set);
          }
          return { modifiedCount: t ? 1 : 0 };
        },
        async countDocuments(query?: { status?: string }) {
          if (query?.status) {
            return memoryDb.tickets.filter((t) => t.status === query.status).length;
          }
          return memoryDb.tickets.length;
        },
      },
    };
  }

  // Attempt real MongoDB connection
  try {
    // Dynamic import to prevent build crash if driver is still installing
    const { MongoClient } = await import('mongodb');

    let client: InstanceType<typeof MongoClient>;
    if (global.__medquiz_mongo_client) {
      client = global.__medquiz_mongo_client as InstanceType<typeof MongoClient>;
    } else {
      client = new MongoClient(uri);
      await client.connect();
      if (process.env.NODE_ENV !== 'production') {
        global.__medquiz_mongo_client = client;
      }
    }

    const db = client.db(dbName);

    return {
      isMemory: false,
      users: db.collection<UserDocument>('users'),
      attempts: db.collection<AttemptDocument>('attempts'),
      questions: db.collection<QuestionDocument>('questions'),
      tickets: db.collection<TicketDocument>('tickets'),
    };
  } catch (error) {
    console.warn('[MedQuiz MongoDB] Could not connect to MongoDB URI. Using resilient memory fallback.', error);
    // Fall back to memory database
    return {
      isMemory: true,
      users: {
        async findOne(query: { email?: string; id?: string }) {
          for (const u of memoryDb.users.values()) {
            if (query.email && u.email.toLowerCase() === query.email.toLowerCase()) return u;
            if (query.id && u.id === query.id) return u;
          }
          return null;
        },
        async insertOne(doc: UserDocument) {
          memoryDb.users.set(doc.id, doc);
          return { insertedId: doc.id };
        },
        async updateOne(query: { id: string }, update: { $set: Partial<UserDocument> }) {
          const user = memoryDb.users.get(query.id);
          if (user && update.$set) {
            Object.assign(user, update.$set);
          }
          return { modifiedCount: user ? 1 : 0 };
        },
        async countDocuments() {
          return memoryDb.users.size;
        },
      },
      attempts: {
        async find(query: { userId?: string }) {
          let list = memoryDb.attempts;
          if (query.userId) {
            list = list.filter((a) => a.userId === query.userId);
          }
          return {
            async toArray() {
              return [...list].reverse();
            },
          };
        },
        async insertOne(doc: AttemptDocument) {
          memoryDb.attempts.push(doc);
          return { insertedId: doc.id };
        },
        async insertMany(docs: AttemptDocument[]) {
          memoryDb.attempts.push(...docs);
          return { insertedCount: docs.length };
        },
        async countDocuments() {
          return memoryDb.attempts.length;
        },
      },
      questions: {
        async find() {
          return {
            async toArray() {
              return [...memoryDb.questions];
            },
          };
        },
        async insertOne(doc: QuestionDocument) {
          memoryDb.questions.unshift(doc);
          return { insertedId: doc.id };
        },
        async deleteOne(query: { id: string }) {
          const prevLen = memoryDb.questions.length;
          memoryDb.questions = memoryDb.questions.filter((q) => q.id !== query.id);
          return { deletedCount: prevLen - memoryDb.questions.length };
        },
        async updateOne(query: { id: string }, update: { $set: Partial<QuestionDocument> }) {
          const q = memoryDb.questions.find((x) => x.id === query.id);
          if (q && update.$set) {
            Object.assign(q, update.$set);
          }
          return { modifiedCount: q ? 1 : 0 };
        },
        async countDocuments(query?: { status?: string }) {
          if (query?.status) {
            return memoryDb.questions.filter((q) => q.status === query.status).length;
          }
          return memoryDb.questions.length;
        },
      },
      tickets: {
        async find() {
          return {
            async toArray() {
              return [...memoryDb.tickets];
            },
          };
        },
        async insertOne(doc: TicketDocument) {
          memoryDb.tickets.unshift(doc);
          return { insertedId: doc.id };
        },
        async updateOne(query: { id: string }, update: { $set: Partial<TicketDocument> }) {
          const t = memoryDb.tickets.find((x) => x.id === query.id);
          if (t && update.$set) {
            Object.assign(t, update.$set);
          }
          return { modifiedCount: t ? 1 : 0 };
        },
        async countDocuments(query?: { status?: string }) {
          if (query?.status) {
            return memoryDb.tickets.filter((t) => t.status === query.status).length;
          }
          return memoryDb.tickets.length;
        },
      },
    };
  }
}
