const { keccak256 } = require("ethereum-cryptography/keccak");
const { hexToBytes, bytesToHex } = require("ethereum-cryptography/utils");

const concat = (left, right) => keccak256(Buffer.concat([left, right]));

function verifyProof(proof, leaf, root) {
  console.log('Debug - Proof:', proof);

  // Check if proof is an array
  if (!Array.isArray(proof)) {
    // If it's not an array, you can handle it accordingly
    console.error('Proof is not an array.');
    return false; // Or handle the error in a way that suits your application
  }

  proof = proof.map(({ data, left }) => ({
    left,
    data: hexToBytes(data),
  }));

  let data = keccak256(Buffer.from(leaf));

  for (let i = 0; i < proof.length; i++) {
    if (proof[i].left) {
      data = concat(proof[i].data, data);
    } else {
      data = concat(data, proof[i].data);
    }
  }

  return bytesToHex(data);
}
module.exports = verifyProof;