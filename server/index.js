const express = require('express');
const verifyProof = require('../utils/verifyProof');
const crypto = require('crypto');
const niceListData = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const port = 1225;

const app = express();
app.use(express.json());

const leaves = niceListData.map(name => {
  const hash = crypto.createHash('sha256');
  hash.update(name);
  return hash.digest('hex');
});

// Function to calculate the Merkle root
function calculateMerkleRoot(leaves) {
  if (leaves.length === 1) {
    return leaves[0];
  }
  const layer = [];

  for (let i = 0; i < leaves.length; i += 2) {
    const left = leaves[i];
    const right = leaves[i + 1] || left;

    const combinedHash = crypto.createHash('sha256');
    combinedHash.update(left + right);
    layer.push(combinedHash.digest('hex'));
  }
  return calculateMerkleRoot(layer);
}

const MERKLE_ROOT = calculateMerkleRoot(leaves);

app.post('/gift', (req, res) => {
  const body = req.body;
  const proof = body.proof;
if (!Array.isArray(proof)) {
  res.status(400).send('Invalid proof format.');
  return;
}
  const nameToVerify = body.name;

  console.log('Server: Name to Verify:', nameToVerify); // Server-side debugging
  console.log('Server: MERKLE_ROOT:', MERKLE_ROOT); // Server-side debugging



  // Ensure that proof is an array
  if (!Array.isArray(proof)) {
    res.status(400).send('Invalid proof format.');
    return;
  }

  const isInTheList = verifyProof(nameToVerify, proof, MERKLE_ROOT);
  console.log('Server: Name to Verify:', nameToVerify);
  console.log('Server: MERKLE_ROOT:', MERKLE_ROOT);
  console.log('Server: Proof:', proof);
  if (isInTheList) {
    res.send('You got a toy robot!');
  } else {
    res.send('You are not on the list :(');
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
