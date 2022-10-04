
import { loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers} from "hardhat";
import {ContractReceipt} from "ethers";


describe("EngraveNFT1155", function () {

  async function deployFixture() {
    const [owner, accountOne, accountTwo, accountThree] = await ethers.getSigners();;
    const factory = await ethers.getContractFactory("EngraveNFT1155");
    const EngraveNFT1155 = await factory.deploy();

    return { EngraveNFT1155, owner, accountOne, accountTwo, accountThree};
  }

  async function retrievePackId(tx: any) {
    let receipt: ContractReceipt = await tx.wait();
    let event: any = receipt.events?.find((x) => {return x.event == "NewPack"});
    let packId = event ? ethers.BigNumber.from(event.data) : "";
    return packId;
  }

  describe("MVP Functionality", function () {
    it("A user can create a pack", async function () {
      const { EngraveNFT1155} = await loadFixture(deployFixture);
      // become an engraver
      let tx = await EngraveNFT1155.createPack("Noom");
      // capture the event of emitted engraver id
      let packIdfromReceipt = await retrievePackId(tx)
      // check the address in packs storage, which should be set up to match engraver id
      let retrieveSetpackId = (await EngraveNFT1155.packs(tx.from))._packId;
       expect(retrieveSetpackId).to.equal(packIdfromReceipt)
    });

    it("A pack owner can engrave other addresses", async function () {
      const { EngraveNFT1155, accountOne } = await loadFixture(deployFixture);
      // expect(await lock.unlockTime()).to.equal(unlockTime);
      let tx = await EngraveNFT1155.createPack("Noom");

      let packIdfromReceipt = await retrievePackId(tx);
      let tx1 = await EngraveNFT1155.engraveToPack(accountOne.address, packIdfromReceipt);
      let receipt: ContractReceipt = await tx1.wait();

      // collect the relationship id from the event captured in the engrave tx
      let event: any = receipt.events?.find((x) => {return x.event == "NewRelationship"});
      let relationshipId = ethers.BigNumber.from(event.args[0])
    
      // check the balance based on accountOne.address, should be 1, with a relationship id
      let balance =  (await EngraveNFT1155.balanceOf(accountOne.address, relationshipId)).toString()
      expect(balance).to.equal("1")
      // to equal pack id
      let packIdAddressInMap = await EngraveNFT1155.Relationships(accountOne.address, relationshipId);
      expect(ethers.BigNumber.from(event.args[1])).to.equal(packIdAddressInMap);
    });

    it("An Engraver can remove or transfer an engraving", async function (){
      const { EngraveNFT1155, accountOne, accountTwo, accountThree } = await loadFixture(deployFixture);

      let tx = await EngraveNFT1155.createPack("Noom");
      let packIdfromReceipt = await retrievePackId(tx);

      let tx1 = await EngraveNFT1155.engraveToPack(accountTwo.address,  packIdfromReceipt);
      let receipt1: ContractReceipt = await tx1.wait();

      // collect the relationship id from the event captured in the engrave tx
      // collect the relationship id from the event captured in the engrave tx
      let event: any = receipt1.events?.find((x) => {return x.event == "NewRelationship"});
      let relationshipId1Str = ethers.BigNumber.from(event.args[0])

    // Transfer from accountTwo to accountOne
    // transfer relationship for accountTwo to account three
     const transfer1 =  await EngraveNFT1155.safeTransferFrom(
        accountTwo.address,
        accountOne.address,
        relationshipId1Str,
        1,
        []
      )
      let curBal =  (await EngraveNFT1155.balanceOf(accountOne.address, ethers.BigNumber.from(relationshipId1Str))).toString()
      let previousOwnerBal = (await EngraveNFT1155.balanceOf(accountTwo.address, ethers.BigNumber.from(relationshipId1Str))).toString()
      expect(curBal).to.equal("1")
      expect(previousOwnerBal).to.equal("0")
    })
    
  });

  xdescribe("Error Logic", function () {
    xit("An Engraved person can't send their engraving to another addresses - Sender isn't an active group owner", async function () {
      const { EngraveNFT1155, owner, accountOne, accountTwo } = await loadFixture(deployFixture);

      await EngraveNFT1155.createPack("Noom");

      let tx1 = await EngraveNFT1155.engraveToPack(accountOne.address,  "");
      let receipt1: ContractReceipt = await tx1.wait();

      // collect the relationship id from the event captured in the engrave tx
      let relationshipId1 = receipt1.events?.filter((x) => {return x.event == "NewRelationship"});
      let relationshipId1Str: string = relationshipId1 ? relationshipId1[0].data : "";

      const newSignerNFT1155 = await EngraveNFT1155.connect(accountOne);
      let error;
      try {
        // should fail since accountOne isnt the owner at the relationship id
       await newSignerNFT1155.safeTransferFrom(
          accountOne.address,
          accountTwo.address,
          relationshipId1Str,
          1,
          []
        )
      } catch (err){
        error = err;
  
      }

      expect(error).to.exist;

    });

    xit("An Engraved person can't send their engraving to another addresses - Sender isn't owner for relationship Id", async function () {
      const { EngraveNFT1155, owner, accountOne, accountTwo } = await loadFixture(deployFixture);

      // engraver needs to be active but not matching the address

      await EngraveNFT1155.createPack("Noom");
      let tx1 = await EngraveNFT1155.engraveToPack(accountOne.address,  "");
      let receipt1: ContractReceipt = await tx1.wait();
      // collect the relationship id from the event captured in the engrave tx
      let relationshipId1 = receipt1.events?.filter((x) => {return x.event == "NewRelationship"});
      let relationshipId1Str: string = relationshipId1 ? relationshipId1[0].data : "";

      const newSigner1NFT1155 = await EngraveNFT1155.connect(accountOne);
      await newSigner1NFT1155.createPack("Noom2");
      let error;
      try {
        // should fail since accountOne isnt the owner at the relationship id
        await newSigner1NFT1155.safeTransferFrom(
          accountOne.address,
          accountTwo.address,
          relationshipId1Str,
          1,
          []
        )
      } catch (err){
        error = err;
      }
      expect(error).to.exist;

    });

    xit("Can't engrave unless already an active engraver", async function () {
      const { EngraveNFT1155, accountOne, accountTwo } = await loadFixture(deployFixture);
      EngraveNFT1155.connect(accountOne);
      // should fail since accountOne isn't an owner
      let error;
      try {
        await EngraveNFT1155.engraveToPack(accountTwo.address, "")
      } catch (err){
        error = err;
      }
      expect(error).to.exist;
    });

  });

});