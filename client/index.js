const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';

async function main() {
  const nameToVerify = 'Rachel Nikolaus';

  console.log('Client: Name to Verify:', nameToVerify); // Client-side debugging

  // Check if the name exists in niceList
  if (!niceList.includes(nameToVerify)) {
    console.error('Client: Name not found in the list.');
    return;
  }

  const merkleTree = new MerkleTree(niceList.map(name => name.toLowerCase()));
  const proof = merkleTree.getProof(nameToVerify.toLowerCase());

  const requestBody = {
    name: nameToVerify,
    proof: proof,
  };
  console.log('Client: Proof:', proof);

  try {
    const response = await axios.post(`${serverUrl}/gift`, requestBody);

    // Print the server's response
    console.log('Client: Server Response:', response.data); // Client-side debugging
  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Client: Error:', error.message);
  }
}

main();
