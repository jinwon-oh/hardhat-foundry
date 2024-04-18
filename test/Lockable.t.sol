// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/LockableTemplateV1.sol";

contract LockableTest is Test {
    uint256 constant ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    uint256 constant ONE_GWEI = 1_000_000_000;

    LockableTemplateV1 public lock;

    string name;
    string symbol;
    uint256 unlockTime;
    uint256 lockedAmount;

    function setUp() public {
        unlockTime = ONE_YEAR_IN_SECS;
        lockedAmount = ONE_GWEI;
        name = "Lockable Template";
        symbol = "LT";
        // lock = new LockableTemplateV1(name, symbol, address(this));
        lock = new LockableTemplateV1();
    }

    function test_Mint() public {
        uint256 total = lock.totalSupply();
        assertEq(total, 0);
        lock.mint(address(this), ONE_GWEI);
        total = lock.totalSupply();
        assertEq(total, 0);
    }

    // function test_UnlockTime() public {
    //     lock = new Lock{value: lockedAmount}(unlockTime);

    //     uint256 time = lock.unlockTime();
    //     uint256 amount = address(lock).balance;
    //     address owner = lock.owner();

    //     assertEq(time, unlockTime);
    //     assertEq(amount, lockedAmount);
    //     assertEq(owner, address(this));
    // }

    // function testFail_InvalidUnlockTime() public {
    //     new Lock{value: 1}(1);
    // }

    // function testFuzz_variousAmount(uint256 value) public {
    //     uint256 num = lock.setTime(value);

    //     assertEq(num, value);
    // }
}
