// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

// import "@openzeppelin/contracts-upgradeable-4/token/ERC20/ERC20Upgradeable.sol";
// import "@openzeppelin/contracts-upgradeable-4/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable-4/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable-4/access/OwnableUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable-4/proxy/utils/Initializable.sol";

// import "./ERC20LockableV4.sol";

// @author Franncesco Sullo <francesco@sullo.co>
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./ERC20Lockable.sol";

// import {console} from "hardhat/console.sol";

contract LockableTemplateV1 is
    Initializable,
    ERC20Upgradeable,
    ERC20Lockable,
    ERC20BurnableUpgradeable,
    ERC20PausableUpgradeable,
    OwnableUpgradeable
{
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory name,
        string memory symbol,
        address initialOwner,
        uint256 maxLockTime_
    ) public initializer {
        __ERC20_init(name, symbol);
        // __ERC20_init("LockableTemplate", "LKT");
        __ERC20Lockable_init(maxLockTime_);
        // __ERC20Lockable_init(name, symbol, 365 * 24 * 60 * 60);
        __ERC20Burnable_init();
        __ERC20Pausable_init();
        // _transferOwnership(initialOwner);
        __Ownable_init(initialOwner);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // The following functions are overrides required by Solidity.
    // function _beforeTokenTransfer(
    //     address from,
    //     address to,
    //     uint256 amount
    // )
    //     internal
    //     override(ERC20LockableV4, ERC20PausableUpgradeable, ERC20Upgradeable)
    // {
    //     super._beforeTokenTransfer(from, to, amount);
    // }
    function _update(
        address from,
        address to,
        uint256 value
    )
        internal
        override(ERC20Upgradeable, ERC20PausableUpgradeable, ERC20Lockable)
    {
        super._update(from, to, value);
    }
}
