

"use strict";

const clui = require('clui');
const fs = require('fs');
const simpleGit = require('simple-git');
const git = simpleGit();
const Spinner = clui.Spinner;
const touch = require('touch');
const _ = require("lodash");

const inquirer = require("./inquirer");
const gh = require("./github");


module.exports = Object.freeze({
    createRemoteRepo : async()=>{
        const github = gh.getInstance();
        const answers = await inquirer.askRepoDetails();
        const data = {
            name:answers.name,
            description:answers.description,
            private:(answers.visibility === "private")
        };
        const status = new Spinner('creating remote repository...');
        status.start();
        try{
            const response = await github.repos.createForAuthenticatedUser(data);
            return response.data.clone_url;
        }finally{
            status.stop();
        }
    },
    createGitIgnore: async ()=>{
        const filelist = _.without(fs.readdirSync('.'),'.git','.gitignore');
        if(filelist.length){
            const answers = await inquirer.askIgnoreFiles(filelist);
            if(answers.ignore.length){
                fs.writeFileSync('.gitignore',answers.ignore.join('\n'));
            }else{
                touch('.gitignore');
            }
        }else{
            touch('.gitignore');
        }
    },
    setupRepo: (url)=>{
        const status = new Spinner('Initializing local repository and pushing it to remote...');
        status.start();
        try{

            return git.init()
                .add('.gitignore')
                .add('./*')
                .commit('Initial commit')
                .addRemote('origin', url)
                .push('origin', 'master');
            // await git.init();
            // await git.add('.gitignore');
            // await git.add('./*');
            // await git.commit('Initial Commit');
            // await git.addRemote('origin',url);
            // await git.push('origin','master','-u');
        }finally{
            status.stop();
        }
    }
});