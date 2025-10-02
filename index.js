import { faker } from "@faker-js/faker";
import fs from "fs";

const total = 500_000;
const data = [];

for (let i = 0; i < total; i++) {
  data.push({
    id: i + 1,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    phone: faker.phone.number(),
    createdAt: faker.date.past().toISOString(),
  });
}

fs.writeFileSync("CurrentPopulationSurvey.json", JSON.stringify(data, null, 2));
console.log(`Generated ${total} records to CurrentPopulationSurvey.json`);
