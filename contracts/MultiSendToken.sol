// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
// import "@openzeppelin/contracts/utils/Strings.sol";

contract MultiSendToken {
    using SafeERC20 for IERC20;

    error TransferFailed();
    error NotOwner();
    error SameOwner();
    error InsufficientData();
    error InsufficientValue();
    error NotAllowded();

    // to save the owner of the contract in construction
    address public owner;

    // to save the amount of ethers in the smart-contract
    // uint256 total_value;

    // event for EVM logging
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
    event Withdraw(uint256 amount, address indexed to);
    event Withdraw(uint256 amount);

    // modifier to check if the caller is owner
    modifier onlyOwner() {
        // // If the first argument of 'require' evaluates to 'false', execution terminates and all
        // // changes to the state and to Ether balances are reverted.
        // // This used to consume all gas in old EVM versions, but not anymore.
        // // It is often a good idea to use 'require' to check if functions are called correctly.
        // // As a second argument, you can also provide an explanation about what went wrong.
        // require(msg.sender == owner, "Not owner");
        if (msg.sender == owner) {
            _;
        } else {
            revert NotOwner();
        }
    }

    /**
     * @dev Set contract deployer as owner
     */
    constructor() {
        owner = msg.sender; // 'msg.sender' is sender of current call, contract deployer for a constructor
        emit OwnershipTransferred(address(0), owner);
        // total_value = msg.value; // msg.value is the ethers of the transaction
    }

    // the owner of the smart-contract can chage its owner to whoever
    // he/she wants
    function changeOwner(address newOwner) public onlyOwner {
        // require(newOwner != owner, "same owner");
        if (newOwner != owner) {
            emit OwnershipTransferred(owner, newOwner);
            owner = newOwner;
        } else {
            revert SameOwner();
        }
    }

    // /**
    //  * @dev Return owner address
    //  * @return address of owner
    //  */
    // function getOwner() external view returns (address) {
    //     return owner;
    // }

    // // charge enable the owner to store ether in the smart-contract
    // function charge() public payable onlyOwner {
    //     // adding the message value to the smart contract
    //     total_value += msg.value;
    // }

    // sum adds the different elements of the array and return its sum
    function sum(
        uint256[] memory amounts
    ) private pure returns (uint256 retVal) {
        // the value of message should be exact of total amounts
        uint256 totalAmnt;

        for (uint256 i; i < amounts.length; ) {
            (bool success, uint256 res) = Math.tryAdd(totalAmnt, amounts[i]);
            // require(success, "total amount is not valid");
            if (success) {
                totalAmnt = res;
                // totalAmnt += amounts[i];
                unchecked {
                    ++i;
                }
            } else {
                revert InsufficientData();
            }
        }

        return totalAmnt;
    }

    function withdraw() public payable onlyOwner {
        emit Withdraw(address(this).balance);
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        if (!success) {
            revert TransferFailed();
        }
        // total_value = 0;
    }

    // withdrawals enable to multiple withdraws to different accounts
    // at one call, and decrease the network fee
    function multiSendToken(
        address tokenAddr,
        address payable[] memory addrs,
        uint256[] memory amnts
    ) external {
        // the addresses and amounts should be same in length
        // require(addrs.length == amnts.length, "two array should be the same");
        if (addrs.length != amnts.length) {
            revert InsufficientData();
        }

        // the value of the message in addition to sotred value should be more than total amounts
        uint256 totalAmnt = sum(amnts);

        IERC20 token = IERC20(tokenAddr);

        // require(
        //     totalAmnt < token.balanceOf(msg.sender),
        //     "The valid token is not sufficient"
        // );
        if (totalAmnt > token.balanceOf(msg.sender)) {
            revert InsufficientValue();
        }

        // require(
        //     totalAmnt == token.allowance(msg.sender, address(this)),
        //     "not allowded"
        // );
        if (totalAmnt != token.allowance(msg.sender, address(this))) {
            revert NotAllowded();
        }

        // token.safeTransferFrom(msg.sender, address(this), totalAmnt);
        // for (uint256 i = 0; i < addrs.length; i++) {
        //     // send the specified amount to the recipient
        //     token.safeTransfer(addrs[i], amnts[i]);
        // }
        for (uint256 i; i < addrs.length; ) {
            // send the specified amount to the recipient
            token.safeTransferFrom(msg.sender, addrs[i], amnts[i]);
            unchecked {
                ++i;
            }
        }
    }
}
