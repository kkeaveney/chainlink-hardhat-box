const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe('dNFT', async () => {
    let linkToken, apiConsumer, accounts, deployer, feeCollector

    beforeEach(async () => {
        await deployments.fixture()
        accounts =  await getNamedAccounts()
        deployer = accounts.deployer
        feeCollector = accounts.feeCollector
        const LinkToken = await deployments.get('LinkToken');
        linkToken = await ethers.getContractAt('LinkToken', LinkToken.address)
        const APIConsumer = await deployments.get('APIConsumer')
        apiConsumer = await ethers.getContractAt('APIConsumer', APIConsumer.address)
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
        await dNFT.createCollectible()
        await dNFT.transferFrom(deployer, feeCollector, 0)
        expect(await dNFT.ownerOf(0)).to.eq(feeCollector)
        expect(await dNFT.balanceOf(feeCollector)).to.eq(1)
        expect(await dNFT.balanceOf(deployer)).to.eq(0)
    })
})