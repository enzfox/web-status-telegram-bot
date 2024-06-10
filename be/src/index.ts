import { WebsiteService } from "./WebsiteService";
import { secondsToMs } from "./utils/timeUtils";
import { WebsiteRepository } from "./WebsiteRepository";

class App {
  websiteServices: WebsiteService[] = [];
  websiteRepository: WebsiteRepository = new WebsiteRepository();

  async init() {
    // Get websites from the database
    await this.updateWebsitesData();

    // Check the websites
    this.checkWebsites();

    // Set an interval to check website status every minute
    setInterval(() => this.checkWebsites(), secondsToMs(60));

    // Set an interval to update website data every hour
    setInterval(() => this.updateWebsitesData(), secondsToMs(3600));
  }

  async updateWebsitesData() {
    // Get websites from the database and create a WebsiteService instance for each website
    const websitesData = await this.websiteRepository.getWebsites();

    this.websiteServices = websitesData.map(
      (website) => new WebsiteService(website),
    );
  }

  checkWebsites() {
    console.log("Checking websites...");

    // Run the checkWebsite method for each website
    this.websiteServices.forEach((website) => {
      website.checkWebsite().then();
    });
  }
}

new App().init().then(
  () => console.log("App running..."),
  (error) => console.error("Failed to initialize app", error),
);
