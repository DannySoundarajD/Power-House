const bcrypt = require('bcryptjs');
const pool = require('./db/pool');

async function testLogin() {
  try {
    const email = 'collector.chennai@tn.gov.in';
    const password = 'Password@123';
    
    console.log('Testing login for:', email);
    console.log('Password:', password);
    
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = TRUE',
      [email.toLowerCase().trim()]
    );
    
    if (result.rows.length === 0) {
      console.log('❌ User not found or inactive');
      process.exit(1);
    }
    
    const user = result.rows[0];
    console.log('\n✅ User found:', user.name);
    console.log('Role:', user.role);
    console.log('Hash from DB:', user.password_hash);
    
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (validPassword) {
      console.log('\n✅ Password matches! Login should work.');
    } else {
      console.log('\n❌ Password does NOT match!');
      console.log('Testing hash generation...');
      const newHash = await bcrypt.hash(password, 12);
      console.log('New hash would be:', newHash);
      console.log('\nRun this SQL to fix:');
      console.log(`UPDATE users SET password_hash = '${newHash}' WHERE email = '${email}';`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testLogin();
