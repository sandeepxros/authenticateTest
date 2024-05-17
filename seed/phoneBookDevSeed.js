const { DataSource } = require('typeorm');
const { faker } = require('@faker-js/faker');

// Create a new data source
const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'shoppy',
  synchronize: true,
});

async function populatePhoneBook() {
  // Initialize the data source
  await AppDataSource.initialize();

  // Create 100 dummy data entries
  const phoneBookEntries = [];
  for (let i = 0; i < 100; i++) {
    phoneBookEntries.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phoneNumber: faker.phone.number('+1##########'),
      email: faker.internet.email(),
      addedBy: '1',
    });
  }

  // Insert dummy data into the database
  for (const entry of phoneBookEntries) {
    await AppDataSource.query(
      `INSERT INTO phone_book (firstName, lastName, phoneNumber, email, addedBy) VALUES ($1, $2, $3, $4, $5)`,
      [entry.firstName, entry.lastName, entry.phoneNumber, entry.email, entry.addedBy]
    );
  }

  console.log('100 dummy data entries have been inserted.');

  // Close the data source connection
  await AppDataSource.destroy();
}

populatePhoneBook().catch((error) => console.log(error));
