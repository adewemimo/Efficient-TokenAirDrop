# Project Theme: Efficient Token AirDrop Using Merkle Trees

This project is centred around how to efficiently airdropped tokens into accounts. The idea is to eliminate littering accounts with tokens whether these tokens are wanted or not, and in many cases, whether the owners of the accounts can make use of them.

The tokens to be airdropped in this project are a mixture of fungible and non-fungible hence the decision to use the ERC1155 standard. ERC1155 allows the creation of several fungible and non-fungible assets in the same smart contract. Also, more than one non-fungible token can be minted with this standard.

The Merkle tree concept is utilized to verify a user is qualified to claim some of these tokens. The address of the user's account is verified. Once certified okay, the user can claim the token.

A Merkle tree is a way to show that a subset of data for example a transaction, a set of transactions or an address is part of a bigger dataset. The advantage of using the Merkle tree is that if there is a need to prove a set of data or transaction is part of a Merkle root, all that is needed is a small amount of data (generated hashes of the larger dataset). Our subset of data in the program is the addresses of the accounts that would want to claim tokens.  

## Offchain Aspect of the Project
The off-chain aspect contains the list of addresses qualified to claim the tokens. This list is outside of the smart contract to allow for scalability and efficiency as the list grows. The address list will be encoded as a Merkle tree. Claimer will need to provide a Merkle proof of their eligibility to claim the tokens.

The off-chain folder contains a detailed description of how to run the code to generate the root, path and witnesses for use in the claim solidity program.

## Steps to run the project.
This project is developed using hardhat. It is integrated with truffle and ethers.js to generate the tests for the code.
To deploy and run:

* Clone this repo. 
* `npm install` to install openzeppeli and other dependencies.
* `npx hardhat compile`  to compile the program. 
* `npx hardhat run scripts/deploy.js` would deploy the program  
* `npx hardhat test` would run the test for the code.
* `npx hardhat node` to run hardhat network which will also provide the list the accouts with their private keys. You can also run `npx hardhat accounts` to provide a list of the accounts.
* `npx hardhat coverage` this command was use to check the test coverage of AirDropMultiTokens.sol smart contract



## Gas Optimization and Smart Contract Efficiency
*   Tokens are not automatically airdropped into accounts. The user would have to claim or redeem the tokens if interested. Users will pay the transaction costs when claiming the tokens. This mechanism saves gas. More ethers and gas are burned when accounts are automatically credited.
*   The use of the ERC1155 standard allows the creations of multiple tokens from one smart contract. The ERC1155 standard takes the best from previous standards to create a fungibility-agnostic and gas-efficient token contract.
* The addresses of the accounts are maintained off-chain. This method of maintaining the address list reduces on-chain storage usage. A factor that is considered for gas optimization when deploying the contract.

## Security Consideration
* **Avoidance of Denial of Service (DOS) with gas limit -**  The code was developed to eliminate the automatic forwarding of tokens to accounts, thereby reducing the possible occurrence of denial of service due to the maximum gas limit. The maximum gas limit would be reached if a transaction is to credit many accounts and this would result in a failed transaction. Also, the address array could grow very large hence, the resolution to handled it off-chain. This solves the use of a large array which is discouraged when developing smart contracts. The use of a large array consumes a lot of gas and, if the maximum gas limit is reached, it can result in denial of service.

* **Consideration to use pull payment instead of push payment to avoid Denial of Service -** accounts are to claim tokens from the smart contract if interested(pull method) instead of automatic crediting from the accounts (push method).

* **implemented Check Effect Interaction (CEI) to prevent re-entrancy attack -** This was implemented in claimTokenItem() and claimBatchTokenItem() function

* **Proper permission checking -** This is to ensure there is enough token to claim and that an address does not claim token twice

## Future Considerations
Some of the considerations that would be nice to implement in the nearest future is to make the offchain program available to generate the merkle proof, path and witnesses to users after they have registered interest in claiming tokens. Both registeration of interest and the merkle proof code could be made available through the front end.

