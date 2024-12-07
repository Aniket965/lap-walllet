// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {WalletDeployer} from "../contracts/SmartWalletDeployer.sol";

contract DeploySmartWallet is Script {
    function run() public {
        string memory rpc = vm.envString("SOCKET_RPC");
        vm.createSelectFork(rpc);

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        WalletDeployer myWalletDeployer = WalletDeployer(0x803953FF16FC3944e1799B58bd62638382890b4C);

        // bytes32 walletId = keccak256(abi.encode("wallet", 0x7554d18FBfebcd4bFF4Df97479262715a2203C8a));
        myWalletDeployer.deployContracts(84532);
        // myWalletDeployer.deployContracts(11155420, walletId);
        // myWalletDeployer.deployContracts(421614, walletId);
    }
}