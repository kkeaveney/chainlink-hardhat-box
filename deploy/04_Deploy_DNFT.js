module.exports = async ({
    getNamedAccounts,
    deployments,
    getChainId,
    getUnnamedAccounts,
  }) => {
    const { deploy, get } = deployments;
    const { deployer } = await getNamedAccounts();

    const vrfConsumerBase = await get('VRFConsumerBase')
    const linkToken = await get('LinkToken')
   
    const VRF_KEYHASH =
      "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311";
    const VRF_FEE = "100000000000000000";
  
    console.log("----------------------------------------------------");
    console.log("Deploying dNFT");
    const dNFT = await deploy("dNFT", {
      from: deployer,
      gasLimit: 4000000,
      args: [vrfConsumerBase.address, linkToken.address, VRF_KEYHASH, VRF_FEE],
    });
  
    // console.log("dNFT deployed to: ", dNFT.address);
    // console.log("Run the following command to fund contract with LINK:");
    // console.log("npx hardhat fund-link --contract ", dNFT.address);
    // console.log("Then create a dNFT with the following command:");
    // console.log("npx hardhat create-collectible --contract ", dNFT.address);
    // console.log("----------------------------------------------------");
  };