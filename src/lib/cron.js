import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", function () {
  https
    .get("https://react-native-acepoint-backend.onrender.com", (res) => {
      if (res.statusCode === 200) console.log("GET request sent succesfully");
      else console.log("GET request failed", res.statusCode);
    })
    .on("error", (e) => console.log("error while sending request", e));
});

export default job;
