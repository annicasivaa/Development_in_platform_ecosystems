# How to run the app

1. Install the DHIS2 CLI.
We are installing it globally because we will use the CLI commands from our terminal and not in a specific project.
Run following in terminal:
```
yarn global add @dhis2/cli
```

3. Initialize a new app

Create a new empty folder for your application and open it in your code editor of choice.

Then, using your terminal, navigate to your new folder and run the DHIS2 CLI init command.

```
npx d2 app scripts init myfirstapp
```
*If you are running windows and your terminal doesn't recognize the d2 command - try following this guide:*
https://www.sung.codes/blog/2017/yarn-global-add-command-not-work-windows


The init command runs a modified create-react-app script that creates a new DHIS2 application with DHIS2 packages pre-installed.

Before running, we want to start the proxy in a new terminal window. 
*This should always be running when starting the app.*
```
yarn global add dhis-portal
npx dhis-portal --target=https://data.research.dhis2.org/in5320/
```

After the setup is complete navigate to the new folder and start the application.
```
cd myfirstapp
yarn start
```
When you visit http://localhost:3000 you should see the DHIS2 log-in screen. Log in with:
server: http://localhost:9999
username : admin
password: district


