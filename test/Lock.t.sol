// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/Lock.sol";

contract LockTest is Test {
    uint256 constant ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    uint256 constant ONE_GWEI = 1_000_000_000;

    Lock public lock;

    uint256 unlockTime;
    uint256 lockedAmount;

    function setUp() public {
        unlockTime = 1736478000;
        lockedAmount = ONE_GWEI;
        lock = new Lock{value: lockedAmount}(unlockTime);
    }

    function test_UnlockTime() public {
        lock = new Lock{value: lockedAmount}(unlockTime);

        uint256 time = lock.unlockTime();
        uint256 amount = address(lock).balance;
        address owner = lock.owner();

        assertEq(time, unlockTime);
        assertEq(amount, lockedAmount);
        assertEq(owner, address(this));
    }

    function testFail_InvalidUnlockTime() public {
        new Lock{value: 1}(1);
    }

    // function testFuzz_variousAmount(uint256 value) public {
    //     uint256 num = lock.setTime(value);

    //     assertEq(num, value);
    // }
}
