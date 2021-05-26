const { expect } = 'chai'

describe('dNFT', async () => {
    let linkToken, apiConsumer, dNFT

    beforeEach(async () => {
        await deployments.fixture()
        const LinkToken = await deployments.get('LinkToken');
        linkToken = await ethers.getContractAt('LinkToken', LinkToken.address)
        const APIConsumer = await deployments.get('APIConsumer')
        apiConsumer = await ethers.getContractAt('APIConsumer', APIConsumer.address)
        const DNFT = await deployments.get("dNFT")
        dNFT = await ethers.getContractAt('dNFT', DNFT.address)

    })

    it('should successfully deploy', async () => {
        await linkToken.transfer(apiConsumer.address, '2000000000000000000')
        console.log(dNFT)
    })
})