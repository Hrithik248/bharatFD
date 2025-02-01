const mongoose = require("mongoose");
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(`mongodb://localhost:27017/bharatFD`, { family: 4 });
  console.log("db connected");
}
