//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "socket-protocol/contracts/base/AppDeployerBase.sol";
import "./SmartWallet.sol";

contract WalletDeployer is AppDeployerBase  {
    bytes32 walletId = _createContractId("wallet");
    constructor(
        address addressResolver_,
        FeesData memory feesData_,
        address userAddress
    ) AppDeployerBase(addressResolver_) {
        creationCodeWithArgs[walletId] = abi.encodePacked(
            type(SmartWallet).creationCode,
            abi.encode(userAddress)
        );
        _setFeesData(feesData_);
    }

    // function deployContracts(uint32 chainSlug, bytes32 walletId ) external async {
    //     _deploy(walletId, chainSlug);
    // }

    function deployContracts(uint32 chainSlug ) external async {
        _deploy(walletId, chainSlug);
    }

    function initialize(uint32 chainSlug) public override async {}

}