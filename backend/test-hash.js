const bcrypt = require('bcryptjs');
const password = 'Password@123';
bcrypt.hash(password, 12, (err, hash) => {
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nRun this SQL:');
  console.log("UPDATE users SET password_hash = '" + hash + "' WHERE email = 'collector.chennai@tn.gov.in';");
});
