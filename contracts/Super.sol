// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "hardhat/console.sol";

abstract contract L1 {
    event L1Contract(uint256 num);
    function _su(uint256 a, uint256 b) internal virtual {
        if (a > b) {
            console.log("L1 a is larger than b");
            emit L1Contract(a + 0x1);
            return;
        }
        console.log("L1 a is smaller than b");
        emit L1Contract(b + 0x1);
    }
}

abstract contract L2 is L1 {
    event L2Contract(uint256 num);
    function _su(uint256 a, uint256 b) internal virtual override {
        if (a == b) {
            console.log("L2 a is b");
            emit L2Contract(a + 0x10);
            return;
        }
        console.log("L2 a is not b");
        emit L2Contract(b + 0x10);
        super._su(a, b + 0x10);
    }
}

abstract contract L3 is L1 {
    event L3Contract(uint256 num);
    function _su(uint256 a, uint256 b) internal virtual override {
        if (a == b) {
            console.log("L3 a is b");
            emit L3Contract(a + 0x100);
            return;
        }
        console.log("L3 a is not b");
        emit L3Contract(b + 0x100);
        super._su(a, b + 0x100);
    }
}

contract L4 is L1, L3, L2 {
    event L4Contract(string msg);
    function _su(uint256 a, uint256 b) internal override(L3, L2, L1) {
        super._su(a, b);
    }

    function suTest(uint256 a, uint256 b) public {
        console.log("This is suTest");
        _su(a, b);
        emit L4Contract("After super");
    }
}
