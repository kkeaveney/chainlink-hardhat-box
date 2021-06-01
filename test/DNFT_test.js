const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe('dNFT', async () => {
    let linkToken, accounts, deployer, feeCollector, vrfCoordinatorMock

    beforeEach(async () => {
        seed = 123;
        await deployments.fixture(['mocks', 'vrf', 'dnft'])
        accounts =  await getNamedAccounts()
        deployer = accounts.deployer
        feeCollector = accounts.feeCollector
        const LinkToken = await deployments.get('LinkToken');
        linkToken = await ethers.getContractAt('LinkToken', LinkToken.address)
        const VRFCoordinatorMock = await deployments.get('VRFCoordinatorMock')
        vrfCoordinatorMock = await ethers.getContractAt('VRFCoordinatorMock', VRFCoordinatorMock.address)
        const DNFT = await deployments.get("dNFT")
        dNFT = await ethers.getContractAt('dNFT', DNFT.address)
        await linkToken.transfer(dNFT.address, parseEther('1000'))

    })

    it('transfers LINK to NTF contract', async () => {
        expect(await linkToken.balanceOf(dNFT.address)).to.eq(parseEther('1000'))
    })

    it('creates collectible', async () => {
        await dNFT.createCollectible()
        expect(await dNFT.tokenCounter()).to.eq(1)
        expect(await dNFT.ownerOf(0)).to.eq(deployer)
        expect(await dNFT.balanceOf(deployer)).to.eq(1)
    })
    
    it('transfers NFT to another account', async () => {
        const expected = '777'
        await dNFT.createCollectible()
        const transaction = await dNFT.transferFrom(deployer, feeCollector, 0)
        expect(await dNFT.ownerOf(0)).to.eq(feeCollector)
        expect(await dNFT.balanceOf(feeCollector)).to.eq(1)
        expect(await dNFT.balanceOf(deployer)).to.eq(0)
        
        
        const tx_receipt = await transaction.wait()
        const requestId = tx_receipt.events[2].topics[0]
        
        // Test the result of the random number request
        let result = await vrfCoordinatorMock.callBackWithRandomness(requestId, expected, dNFT.address)
        expect(await dNFT.randomResult()).to.equal(expected)
        


     })

   
})