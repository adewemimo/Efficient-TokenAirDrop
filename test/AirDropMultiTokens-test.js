var chai = require('chai');  

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised); // // Using Should style and chai as a promise.
var assert = chai.assert;    // Using Assert style
var expect = chai.expect;    // Using Expect style
var should = chai.should();  // Using Should style

contract('AirDropMultiTokens', (Accounts) => {
    let contract;

    console.log(Accounts[0]);
    const eligibleAddressMerkleRoot = 
    "0x66cb6f413da211f8113805b2d8d9415ad9f74dd3ad5225d05e24c22321ead856"
    const path = 32;
    const witnesses = ["0xb1c0184ed8f3a7f4b6d7c545cbb8fa2e82f3e2afa9d6b5f640b75612cad2a7a8","0x98e91bf2fc410908a3ada0c41bcb3124140425e18916951fcbdf3c9072c274da","0xeff77eff776158d84fd4db160e03f3fe10b0e8d841a8837549e07c7a127a7b02","0xe9b6f49e170214802213a32d975c846c4e992f5b74baa48506690615693a7162","0x8f5bdf2b21421368f94f48fe208fd1439f9664dcff0c9021ce69e15a25110f52","0xa0d8f6784ad05ecd6303b7063cd93092607eb01d0f2faebca22438ed985280eb","0x44a220be43bf49fb0169293bf9e98d2a864658dcb5e048f30a50eb92011d4bc7","0x5625940dc1c3836b0569dadc71e14defaba0097fa56ea5c94e9f6cd581baea16","0xb905e30ecac1bebbb292f19b597adb069bd8e63a28ff6ba5dcd10de6b3bfaa6c","0x1a6602ce87a8ad5521dfed76f70eaf29b211c4a098379d8de9ed5a75308a8c9b"];

    const path1 = 52;
    const witnesses1 = ["0x818b0a06638e813e56fb1dd3c832fd2af8c16813fb49c12aa8cc8c1e996f8cee","0xec5cb4949134163e91c7b0be2840de0e4c97cf1d0f12e16bcd5bf03cbc5efa7b","0x4c673df96ee7c84d67ac4daa4630c50649d9d7bb63a1abfa9388a2d16c2a31fd","0xc66b0fa0a52afc1b65203424c1f482284cb795616e2baf6a24d62755acb8c97b","0xa9bdac6751d84dc8ccbdc66ba3831defe29399d1156783616d4b63203a8816ab","0xa0d8f6784ad05ecd6303b7063cd93092607eb01d0f2faebca22438ed985280eb","0x44a220be43bf49fb0169293bf9e98d2a864658dcb5e048f30a50eb92011d4bc7","0x5625940dc1c3836b0569dadc71e14defaba0097fa56ea5c94e9f6cd581baea16","0xb905e30ecac1bebbb292f19b597adb069bd8e63a28ff6ba5dcd10de6b3bfaa6c","0x1a6602ce87a8ad5521dfed76f70eaf29b211c4a098379d8de9ed5a75308a8c9b"];

    let AirDropMultiTokens;
    let airDropMultiTokens; 

    before(async () => {
      AirDropMultiTokens = await ethers.getContractFactory("AirDropMultiTokens");
      airDropMultiTokens = await AirDropMultiTokens.deploy();
      contract = await airDropMultiTokens.deployed();

    })

    describe('deployment', async () => {
        it('MultiTokenAirDrops deploys successfully and check tokens balance', async () => {  
            const address = contract.address;
            console.log(address);
            assert.notEqual(address, '');
            assert.notEqual(address, 0x0);
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);

            
        })
        it("estimate gas used", async () => {
          const transactionGasLimit = await contract.deployTransaction.gasLimit.toString();
          console.log(transactionGasLimit);

          const estimatedGas = await contract.estimateGas.balanceOf(Accounts[0], 0);
          console.log(estimatedGas.toString());

          const transactionResponse = await contract.deployTransaction.wait([ confirms = 1 ]);

          const transactionGasUsed = transactionResponse.gasUsed;
          console.log(transactionGasUsed.toString());

          (transactionGasUsed).should.be.equal(transactionGasLimit);

        })

        it("Check Tokens Balance after Deployment", async() => {
          //confirm that the tokens minted after deployment.
          let balance = await contract.balanceOf(Accounts[0], 0);

          assert.notEqual(balance.toString(), undefined, "Token balance should not be undefined");

          assert.equal(balance.toString(), 1000000000000000000000000000, "amount of GOLDCOIN Token is not correct");
          
        })

    })

    describe("verify user and claim Tokens, Mint a token when not available", async () => {
      
      it("Negative Testing: Create token when token is still available", () => {
          contract.mintMoreItem(
            Accounts[0], 2, 1,"0x00"
            ).should.eventually.throw();
      })

      it("Negative Testing: wrong input to verify address ", () => {
        const amount = 1;

        contract.claimTokenItem(
          Accounts[1], 2, amount, "0x00", 29, witnesses1, eligibleAddressMerkleRoot
        ).should.eventually.throw();

      })

      it ("claim token after verifying", async () => {
        const amount = 1;
        let oldBalance = await contract.balanceOf(Accounts[0], 2);

        assert.equal(oldBalance, 1, "amount of THORS_HAMMER Token is not correct");

        await contract.claimTokenItem(Accounts[1], 2, amount, "0x00", path, witnesses, eligibleAddressMerkleRoot);

        let newBalance = await contract.balanceOf(Accounts[0], 2);

        assert.equal(newBalance, 0, "amount of THORS_HAMMER Token is not correct");

        let claimerBalance = await contract.balanceOf(Accounts[1], 2);

        assert.equal(claimerBalance, 1, "amount of THORS_HAMMER Token is not correct");
      })
      it("Negative Testing: Try to re-claim token again", () => {

        const amount = 1;

        contract.claimTokenItem(
          Accounts[1], 2, amount, "0x00", path, witnesses, eligibleAddressMerkleRoot
        ).should.eventually.throw();
      })

      it ("mint more tokens", async()=>{
        // Mint additional NFT token if not available to allow for another claimer to receive token.
        await contract.mintMoreItem(Accounts[0], 2, 1,"0x01");

        let newNFTBalance = await contract.balanceOf(Accounts[0], 2);

        assert.equal(newNFTBalance, 1, "THORS_HAMMER NFTToken did not mint");
      })

      it ("claim batch tokens", async() => {
        // confirm Account[2] can do batch claim of tokens.
        let balanceBeforeClaim = await contract.balanceOfBatch([Accounts[0], Accounts[0],Accounts[0]],[0,1,2]);

        assert.equal(balanceBeforeClaim.toString(), '1000000000000000000000000000,1000000000,1', "Balance of Multiple Tokens is not correct");

        await contract.claimBatchTokenItem(Accounts[2], [0,1,2], [1000,50,1], "0x00", path1, witnesses1, eligibleAddressMerkleRoot);

        let balanceAfterClaim = await contract.balanceOfBatch([Accounts[0], Accounts[0],Accounts[0]],[0,1,2]);

        assert.equal(balanceAfterClaim.toString(), '999999999999999999999999000,999999950,0', "Balance of Multiple Tokens is not correct");

        ClaimerBalance2 = await contract.balanceOfBatch([Accounts[2], Accounts[2],Accounts[2]],[0,1,2]);

        assert.equal(ClaimerBalance2.toString(), '1000,50,1', "Balance of Multiple Tokens for the claimer is not correct");
      })
      
    })

    describe("Mint Tokens in batch", async() => {
      it("mint token in batch", async() => {
        await contract.mintMoreBatchItems([0,1,2], [1000, 50,1], "0x02");

        balanceAfterBatchToken = await contract.balanceOfBatch([Accounts[0], Accounts[0],Accounts[0]],[0,1,2]);

        assert.equal(balanceAfterBatchToken.toString(), '1000000000000000000000000000,1000000000,1', "Balance of Multiple Tokens is not correct");

      })
    
    })


});



