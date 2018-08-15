var fs = require('fs');
var readline = require('readline');
var phonebookFile = './phonebook.json';
var phonebookCurrent = {};
var menu = '\nElectronic Phone Book\n=====================\n1. Look up an entry\n2. Set an entry\n3. Delete an entry\n4. List all entries\n5. Quit\nWhat do you want to do (1-5)? ';

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

var main = function () {
    fs.readFile(phonebookFile, 'utf8', function(error, data) {
        if (error) {
            console.log('Error: invalid file')
        }
        else {
            phonebookCurrent = JSON.parse(data);
        }
    });
    rl.question(menu, function(answer) {
        if (answer === '5') {
            rl.close();
        }
        else if (answer === '1') {
            var lookupEntry = function () {
                rl.question('Name to look up: ', function(name) {
                    if (phonebookCurrent.hasOwnProperty(name)) {
                        console.log(`\n${name}: ${phonebookCurrent[name]}`);
                    }
                    else {
                        console.log('Error: name not found');
                        rl.question(`1. Try another name\n2. Go to main menu\nWhat do you want to do (1-2)? `, function(answer) {
                            if (answer === '1') {
                                lookupEntry();
                            }
                            else {
                                main();
                            }
                        });
                    }
                    main();
                });
            };
            lookupEntry();
        }
        else if (answer === '2') {
            rl.question('Name: ', function(name) {
                rl.question('Phone Number: ', function(number) {
                    phonebookCurrent[name] = number;
                    fs.writeFile(phonebookFile, JSON.stringify(phonebookCurrent), function() {
                        console.log(`Entry added.`);
                        main();
                    });
                });
            });
        }
        else if (answer === '3') {
            var deleteEntry = function () {
                rl.question('Name to delete: ', function(name) {
                    if (phonebookCurrent.hasOwnProperty(name)) {
                        delete phonebookCurrent[name];
                        fs.writeFile(phonebookFile, JSON.stringify(phonebookCurrent), function() {
                            console.log(`Entry deleted.`);
                            main();
                        });
                    } else { 
                        console.log('Error: name not found');
                        rl.question(`1. Try another name\n2. Go to main menu\nWhat do you want to do (1-2)? `, function(answer) {
                            if (answer === '1') {
                                deleteEntry();
                            }
                            else {
                                main();
                            }
                        });
                    }
                });
            };
            deleteEntry();
        }
        else if (answer === '4') {
            var keys = Object.keys(phonebookCurrent);
            var printEntry = function (contact) {
                console.log(`${contact}: ${phonebookCurrent[contact]}`)
            };
            keys.forEach(printEntry);
            main();
        } else {
            console.log('Error: invalid command');
            main();
        }
    });
};

main();
