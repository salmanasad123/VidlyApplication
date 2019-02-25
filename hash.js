const bcrypt = require('bcrypt');

// salt is a random string added before and after our hash password which is different depending on the salt we use 

async function run() {
    const salt = await bcrypt.genSalt(10);
    // we can use salt to hash our passsword
    const hashedPassword = await bcrypt.hash('1234', salt);
    console.log(salt);
    console.log(hashedPassword);
}

run();