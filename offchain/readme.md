## Merkle Root Functionality 
This is an off-chain aspect that contains the list of addresses that are qualified to claim the tokens. The address list is placed outside of the smart contract as it may get large. The address list will be encoded as a Merkle tree. Claimer will need to provide a Merkle proof of their eligibility to claim the tokens.

### To run the merkle root/proof Program to determine eligibility
* Make sure your terminal is in the offchain directory.
* run dependencies with `npm install`
* Copy the account address to be verified after running hardhart network.
* Add the account address to any line in the addresses.txt
* Generate the merkle root for the addresses.txt file by running the following command:
`node claimerAddressesTree.js root addresses.txt`
* Generate a proof for your address by running the following command (replace the address with your own):
`node claimerAddressesTree.js proof addresses.txt < account address>`
* Use the proof and path genreated as input to the fucntions - verifyAddress(), claimTokenItem() or claimBatchTokenItem() of the solidity program - AirDropMultiTokens.sol.

Please note that adding more addresses to the address.txt will change the root and witnesses already used in the test. If this is the case, Replay the **root, witnesses and witnesses1** in the test file to make sure the test runs successfully.