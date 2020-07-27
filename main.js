#!/usr/bin/env node

// reference : https://www.sitepoint.com/javascript-command-line-interface-cli-node-js/

"use strict";

const files = require("./lib/file");
const clear = require("clear");
const chalk= require('chalk');
const figlet = require('figlet');
const github = require('./lib/github');
const repo = require("./lib/repository");


clear();

console.log(chalk.yellow(
    figlet.textSync('GitCLI',{horizontalLayout:'full'})
));

if(files.directoryExists('.git')){
    console.log(chalk.red('❌ Already a git repository'));
    process.exit();
}

const getGithubToken = async ()=>{
    // fetching token from configstore
    let token = github.getStoredGitHubToken();
    if(token){
        return token;
    }
    // no token found, use credentials to access github account
    token = await github.getPersonalAccessToken();
    return token;
};

const run = async()=>{
    try{
        const token = await getGithubToken();
        github.githubAuth(token);
        const url = await repo.createRemoteRepo();
        await repo.createGitIgnore();
        await repo.setupRepo(url);
        console.log(chalk.green('✔️ All done'));
    }catch(err){
        console.log('error',err);
        if(err){
            switch(err.status){
                case 401:
                    console.log(chalk.red('❌ Couldn\'t log you in. Please provide correct credentials/token.'));
                    break;
                case 422:
                    console.log(chalk.red('❌ There is already a remote repository or token with the same name'));
                    break;
                default:
                    console.log(chalk.red('❌'+err));
            }
        }
    }
};


if(require.main === module){
    run();
}