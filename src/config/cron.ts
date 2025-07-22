import { CronJob } from "cron";
import https from "https";
import { ENV } from "./env";

const job = new CronJob("*/14 * * * *", () => {
  if (!ENV.API_URL) {
    console.error("API_URL is not defined in environment variables");
    return;
  }

  https
    .get(`${ENV.API_URL}/api/health`, (res) => {
      if (res.statusCode === 200) {
        console.log("Get Request successful", ENV.API_URL);
      } else {
        console.log("Get Request failed", ENV.API_URL);
      }
    })
    .on("error", (e) => {
      console.error("Error on API call", e);
    });
  https
    .get(ENV.WEB_URL, (res) => {
      if (res.statusCode === 200) {
        console.log("Get Request successful", ENV.WEB_URL);
      } else {
        console.log("Get Request failed",  ENV.WEB_URL);
      }
    })
    .on("error", (e) => {
      console.error("Error on API call", e);
    });

  https
    .get("https://groceryplusstrapicms-1.onrender.com/api/about", (res) => {
      if (res.statusCode === 200) {
        console.log("Get Request successful", "https://groceryplusstrapicms-1.onrender.com/api/about");
      } else {
        console.log("Get Request failed", "https://groceryplusstrapicms-1.onrender.com/api/about");
      }
    })
    .on("error", (e) => {
      console.error("Error on API call", e);
    });
});

export default job;
