import { eq } from 'drizzle-orm';
import { db, pool } from './db.js';
import { demoUsers } from './schema.js';

async function main() {
  try {
    console.log('⚡ Performing CRUD operations using Neon WebSocket...');

    // CREATE: Insert a new user
    const [newUser] = await db
      .insert(demoUsers)
      .values({ 
        name: 'Harsh Verma', 
        email: `harsh-${Date.now()}@example.com` 
      })
      .returning();

    if (!newUser) {
      throw new Error('Failed to create user');
    }
    console.log('✅ CREATE: New user created:', newUser);

    // READ: Select the user by ID
    const foundUser = await db
      .select()
      .from(demoUsers)
      .where(eq(demoUsers.id, newUser.id));
    console.log('✅ READ: Found user:', foundUser[0]);

    // UPDATE: Change user details
    const [updatedUser] = await db
      .update(demoUsers)
      .set({ name: 'Harsh (Updated)' })
      .where(eq(demoUsers.id, newUser.id))
      .returning();

    if (!updatedUser) {
      throw new Error('Failed to update user');
    }
    console.log('✅ UPDATE: User updated:', updatedUser);

    // DELETE: Remove user
    await db.delete(demoUsers).where(eq(demoUsers.id, newUser.id));
    console.log('✅ DELETE: User deleted successfully.');

    console.log('\n🎉 All CRUD operations completed!');
  } catch (error) {
    console.error('❌ Error executing operations:', error);
    process.exit(1);
  } finally {
    // Persistent WebSocket pool ko clean up karna
    if (pool) {
      await pool.end();
      console.log('🔌 Connection pool closed.');
    }
  }
}

main();