# Set up

To set this thing up, you'll need a few things:

- A Google Cloud Compute account
- A Discord account
- Nodejs
- Yarn
- Git

Once you have those, you can continue with the following instructions.

### Step 1: Creating a Cloud Compute project.

Visit your [Google Cloud Compute console](https://console.cloud.google.com) and create a new project. The project can be named whatever you want.

Now we need to add the translate API to our new project.

To do this, click on the navigation bar, and click on "APIs and services". From there click on "Library" and search for "translate". Click on the first result and then click on "enable".

Nice! Now the translate API is enabled for our project. Next is to make an API key.

Press the back button until your back to the APIs and services page. From there, click on "credentials". Once the page loads, click on "create credentials" and select "API key". Copy the text it gives you, and note it down somewhere.

### Step 2: Creating a Discord bot.

Visit the [discord developer portal](https://discord.com/developers/applications) and create a new "application".

Once you've made the new "application" click on the bot tab, and then "add bot". It'll warn you that this application cannot be deleted once a bot is made, you can click "ok" on this.

Now under "token" click "reveal" and copy the token down somewhere.

### Step 3: Installing and compiling this repo

Clone and compile this repo with the following commands:
```
git clone https://github.com/K4rakara/discord-translator.git
cd discord-translator
yarn
yarn tsc
```

### Step 4: Set up the repo

For the repo to work, you need a few config files.

First, make a file called "gapi.key". Paste the Google cloud compute project key in this file.

Second, make a file called "discord.key". Paste the Discord bot token into this file.

Finally, edit config.json and set the "master" value to your discord accounts id (you can get the id by enabling discord developer mode and right clicking on your profile picture.)

If everything was done correctly, you should be able to run the following command to start the bot with no issues:
```
node ./bin/index.js
```

### Step 5: Adding the bot to a server

Go back to the bot on the discord dev portal and click on the "oauth2" tab.

From there, select the "bot" scope and then "copy".

Paste the copied url into your browser and choose a server that you moderate to add the bot to. Voila.
