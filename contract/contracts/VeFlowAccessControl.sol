// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title VeFlowAccessControl
 * @dev Role-based access control for VeFlow system
 */
contract VeFlowAccessControl is AccessControl, Pausable, ReentrancyGuard {
    // Role definitions
    bytes32 public constant AUTHOR_ROLE = keccak256("AUTHOR_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    bytes32 public constant BILLING_MANAGER_ROLE = keccak256("BILLING_MANAGER_ROLE");

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(AUTHOR_ROLE, msg.sender);
        _grantRole(EXECUTOR_ROLE, msg.sender);
        _grantRole(BILLING_MANAGER_ROLE, msg.sender);
    }

    /**
     * @dev Pause the contract
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Check if address has executor role
     */
    function isExecutor(address account) external view returns (bool) {
        return hasRole(EXECUTOR_ROLE, account);
    }

    /**
     * @dev Check if address has author role
     */
    function isAuthor(address account) external view returns (bool) {
        return hasRole(AUTHOR_ROLE, account);
    }
}


