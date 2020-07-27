

"use strict";

const clui = require('clui');
const Configstore = require('configstore');
const {Octokit} = require('@octokit/rest');
const { createBasicAuth } = require('@octokit/auth-basic');
const spinner = clui.Spinner;

const inquirer = require('./inquirer');
const pkg = require("../package.json");


const conf = new Configstore(pkg.name);

let octokit;

module.exports = Object.freeze({
    getInstance : ()=>octokit,
    getStoredGitHubToken : ()=> conf.get('github.token'),
    getPersonalAccessToken : async() =>{
        const cred = await inquirer.askGitHubCredentials();
        const status = new spinner('Authenticating...');
        
        status.start();

        const auth = createBasicAuth({
            username:cred.username,
            password:cred.password,
            async on2Fa(){
                status.stop();
                const res = await inquirer.getTwoFactorAuthenticationCode();
                status.start();
                return res.twoFactorAuthenticationCode;
            },
            token:{
                scopes:['user','public_repo','repo', 'repo:status'],
                note: 'gitCLI, the command line tool for initialising git repos',
            }
        });
        try{
            const res = await auth();
            if(res.token){
                conf.set('github.token',res.token);
                return res.token;
            } else{
                throw new Error('Github token was not found in the response');
            }
        }finally{
            status.stop();
        }
    },
    githubAuth:(token)=>{
        octokit= new Octokit({auth:token});
    }
});