# MYTY -

## Developer Guide

The Myty Web Application is Following MERN Stack that stands for MongoDB + ExpressJS + ReactJS + NodeJS.
So to Install, develop, test and deployment you Need to have to install everything required.
We will now walk you through the whole process of Installing and setting up the project.

### Starting with Prerequisites

You have to have [Node](https://nodejs.org/en/) installed on your machine.
Download and Install from [here](https://nodejs.org/en/download/) depending on your current operating system.
Node comes with its own default package manager called [npm](https://www.npmjs.com/).
`npm` would be a thing that will be coming up more often.

Next is [Git](https://git-scm.com/) that you need to download and have installed on your system because we will be using git to manage our repository in our local machine and remote server(github).
Download and Install the correct version required for your system and follow the Installation wizard.

After install make sure `node`, `npm` and `git` is accessible from command line i.e., **CMD** or **PowerShell** for Windows, **bash** for linux and **terminal** for Mac.
If not you need to add the installation paths to Environment Variable called **PATH** for Windows.

_By default if the node and npm install directory not changed during installation you can skip this last step_

### Setting up the project

To Download the project Click the Code button at top-right of the file view. You can either download as zip or copy the link. We will be using git so copy the link.
Open your command line tool like cmd or bash in a directory where you want to install the project then,

```
git clone https://github.com/doions-team/myty.git
```

This will download the project on your local machine and you can now install required packages and start working on it.
So go ahead and install required packages, remember these packages installation may take a while to install.
To install

```
npm install
```

It will install required packages for both server and client. As this finishes successfully project will be ready to run.

#### Start development server

At this point we have installed the required packages to start the project. So lets start the project in Development mode.

```
npm run dev
```

By default your react app development server will run at **http://localhost:3000** and backend express server will run at **http://localhost:8080/**.

#### Navigating to different branch

To navigate to different branch first we fetch the branch by its remote name and checkout to that branch locally.

Start by listing all the branches

```
git branch --remote
```

will give a list of remote branches that we can fetch. Then

```
git fetch origin <branch-name>
git checkout <branch-name>
```

Then navigate to `myty/` i.e., root of your project and run `npm run dev`.

#### Make production build

To make the production build in Local Machine or Cloud Hosted Server we need to make a production build of the `myty-client` react app and
serve it through the express application.

Make sure you are inside `myty-client`, or try `cd myty-client`, then run

```
npm run build
```

Then come back to root(`myty`) and run

```
npm run server
```

The by default app will be served from **http://localhost:8080/**.
