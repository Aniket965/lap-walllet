//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "forge-std/console.sol";


contract LiquidityAuctionProtocol {
  // State Variables
  address public immutable owner;
  string public version = "1.0.0";
  constructor(address _owner) {
    owner = _owner;
  }

  // Modifier: used to define a set of rules that must be met before or after a function is executed
  // Check the withdraw() function
  modifier isOwner() {
    // msg.sender: predefined variable that represents address of the account that called the current function
    require(msg.sender == owner, "Not the Owner");
    _;
  }


  /**
   * Function that allows the contract to receive ETH
   */
  receive() external payable { }

   
}
