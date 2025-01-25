require("dotenv").config();
const { TwitterApi } = require("twitter-api-v2");

async function monitorTwitterMentions() {
  try {
    // Create client using app-only authentication
    const twitterClient = new TwitterApi({
        appKey: "qf4WGw4d0ohuyUnSu7swX54N6",
        appSecret: "pRbTYqrsVp8N45wEDY3ccfa7NAK2f73P2iNHJvoF2o6j2hfpbB",
      });
  

    // Authenticate using app-only context
    const appOnlyClient = await twitterClient.appLogin();

    // Use app-only client for stream rules and fetching tweets
    const stream = await appOnlyClient.v2.searchStream({
      "tweet.fields": ["referenced_tweets", "author_id", "text"],
      "user.fields": ["username"],
    });

    console.log("🤖 Bot is now monitoring mentions...");

    stream.on("data", async (tweet) => {
      try {
        const tweetText = tweet.data.text;
        const tokenName = parseTweetInstructions(tweetText);

        if (tokenName) {
          // Process the tweet and create a Whop store
          const result = await createEnhancedWhop(tokenName);

          // Log the result or handle it as needed
          console.log(`Whop store created for $${tokenName}:`, result);
        } else {
          console.log("No valid token name found in tweet.");
        }
      } catch (error) {
        console.error("Error processing tweet:", error);
      }
    });

    stream.on("error", (error) => {
      console.error("Stream error:", error);
    });
  } catch (error) {
    console.error("Twitter bot error:", error);
    throw error;
  }
}

// Start the bot
monitorTwitterMentions().catch(console.error);
