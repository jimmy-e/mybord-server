// Sources:
// * https://www.nodegit.org/guides/cloning/ssh-with-agent/
// * https://radek.io/2015/10/27/nodegit/

// todo: change to import statement
const nodegit = require('nodegit');
const path = require('path');
const fs = require('fs');

// ----- 1. SET CLONE URL ----- //

const cloneUrl = 'git@github.com:jimmy-e/mybord.git';

// ----- 2. SET FOLDER THAT STORES CLONED REPOSITORY ----- //

const localPath = path.join(__dirname, 'tmp');

// ----- 3. SET CLONE OPTIONS ----- //

const sshFolder = path.join(__dirname, '../../../', '.ssh/');
const id_rsa_file = path.join(sshFolder, 'id_rsa');
const id_rsa_pub_file = path.join(sshFolder, 'id_rsa.pub');

const certificateCheck = (): number => 0;

const credentials = (url, username): object => nodegit.Cred.sshKeyNew(
  username,
  id_rsa_pub_file,
  id_rsa_file,
  'foo', // it does not seem to care what the passphrase is
);

const cloneOptions = {
  fetchOpts: {
    callbacks: {
      certificateCheck,
      credentials,
    },
  },
};

// ----- 4. CLONE THE REPOSITORY ----- //

const cloneRepository = async (): Promise<void> => {
  try {
    await nodegit.Clone(cloneUrl, localPath, cloneOptions);
  } catch (error) {
    throw new Error(error);
  }
};

// ----- 5. COPY THE CONTENTS OF THE REPOSITORY'S DIST FOLDER INTO THE CLIENT FOLDER ----- //

// const foopath = path.join(__dirname, 'pages');
// console.log(foopath);
// fs.rmdirSync(foopath, { recursive: true });
//

// ----- 6. DELETE THE TMP REPOSITORY FOLDER ----- //

const deleteRepository = (): void => fs.rmdirSync(localPath, { recursive: true });

// ----- 7. INVOKE 4, 5, AND 6 SYNCHRONOUSLY ----- //

const getClient = async (): Promise<void> => {
  try {
    await cloneRepository();
    deleteRepository();
  } catch (error) {
    throw new Error(error);
  }
};

getClient();
