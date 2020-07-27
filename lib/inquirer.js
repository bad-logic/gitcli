

"use strict";

const inquirer = require('inquirer');
const files = require("./file");

module.exports = Object.freeze({
    askGitHubCredentials : ()=>{
        const questions = [
            {
                name:'username',
                type:'input',
                message:'Enter your github username or E-mail:',
                validate: (value)=>{
                    if(value.length){
                        return true;
                    }
                    return 'Please enter your username or E-mail:'
                }
            },
            {
                name:'password',
                type:'password',
                message:'Enter Your Password:',
                validate:(value)=>{
                    if(value.length){
                        return true;
                    }
                    return 'Please Enter Your Password:'
                }
            }
        ];
        return inquirer.prompt(questions);
    },
    getTwoFactorAuthenticationCode:()=>{
        return inquirer.prompt({
            name:'twoFactorAuthenticationCode',
                type:'input',
                message:'Enter your two-factor authentication code:',
                validate:(value)=>{
                    if(value.length){
                        return true;
                    }
                    return 'Please Enter your two-factor authentication code:'
                }
        });
    },
    askRepoDetails: () => {
        const argv = require('minimist')(process.argv.slice(2));
    
        const questions = [
          {
            type: 'input',
            name: 'name',
            message: 'Enter a name for the repository:',
            default: argv._[0] || files.getCurrentDirectoryBase(),
            validate: function( value ) {
              if (value.length) {
                return true;
              } else {
                return 'Please enter a name for the repository.';
              }
            }
          },
          {
            type: 'input',
            name: 'description',
            default: argv._[1] || null,
            message: 'Optionally enter a description of the repository:'
          },
          {
            type: 'list',
            name: 'visibility',
            message: 'Public or private:',
            choices: [ 'public', 'private' ],
            default: 'public'
          }
        ];
        return inquirer.prompt(questions);
      },
      askIgnoreFiles:(filelist)=>{
          const questions = [
              {
                  type:'checkbox',
                  name:'ignore',
                  message:'Select the file and/or folders you wish to ignore:',
                  choices:filelist,
                  default:['node_modules','bower_components']
              }
          ];
          return inquirer.prompt(questions);

      }
});