// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

/**
 * @title VeFlowProxy
 * @dev Transparent proxy for VeFlow contracts with upgradeability
 */
contract VeFlowProxy is TransparentUpgradeableProxy {
    constructor(
        address _logic,
        address admin_,
        bytes memory _data
    ) TransparentUpgradeableProxy(_logic, admin_, _data) {}
}

/**
 * @title VeFlowProxyAdmin
 * @dev Proxy admin for managing VeFlow contract upgrades
 */
contract VeFlowProxyAdmin is ProxyAdmin {
    constructor() ProxyAdmin() {}
}

