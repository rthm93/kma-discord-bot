# KMA Discord Chatbot

This is a Discord chatbot that will send a message in the configured text channel when Epic Games have new free games.

## Prerequisite

1. Make sure Node.js is installed.
2. Make changes in `src/config.json`, replace your Discord Bot Token and Channel Id of the text channel that the should send a message to whenever there are new games.

## Running the Chatbot

1. Open command prompt and navigate to this folder.

```
cd "LOCATION OF THIS FOLDER"
```

2. Run this command in command prompt to start the chatbot. The warnings can be ignored.

```
npm run start
```

## Configurations
The main configuration file is `src/config.json`. Make sure to restart the chatbot after you made changes to this file.

|Key|Description|
|---|---|
|channelId|Channel ID of the text channel that you want the message to be sent to when there are new free games in Epic Games.| 
|botToken|Discord Bot Token, obtain this from Discord settings|
|checkInterval|What is the interval that this chatbot should check Epic Games for new free games. Defaults to 30 minutes|
