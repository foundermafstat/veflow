// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./VeFlowAccessControl.sol";

/**
 * @title VeFlowBilling
 * @dev Manages payment accounting and VTHO-based billing
 */
contract VeFlowBilling is VeFlowAccessControl {
    // Billing events
    event Deposit(address indexed payer, uint256 amount);
    event Withdrawal(address indexed payee, uint256 amount);
    event FeeDeducted(address indexed payer, uint256 amount, string reason);
    event StepFeeSet(uint256 indexed blueprintId, uint256 fee);

    // State variables
    mapping(address => uint256) public balances;
    mapping(uint256 => uint256) public stepFees; // blueprintId => fee
    uint256 public totalDeposits;
    uint256 public totalWithdrawals;
    uint256 public totalFees;

    /**
     * @dev Deposit VTHO or equivalent testnet token
     * @param payer Address of the payer
     */
    function deposit(address payer) external payable whenNotPaused nonReentrant {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        
        balances[payer] += msg.value;
        totalDeposits += msg.value;
        
        emit Deposit(payer, msg.value);
    }

    /**
     * @dev Withdraw funds
     * @param amount Amount to withdraw
     */
    function withdraw(uint256 amount) external whenNotPaused nonReentrant {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        totalWithdrawals += amount;
        
        payable(msg.sender).transfer(amount);
        
        emit Withdrawal(msg.sender, amount);
    }

    /**
     * @dev Set fee for a blueprint step
     * @param blueprintId ID of the blueprint
     * @param fee Fee amount
     */
    function setStepFee(uint256 blueprintId, uint256 fee) 
        external 
        onlyRole(BILLING_MANAGER_ROLE) 
    {
        stepFees[blueprintId] = fee;
        emit StepFeeSet(blueprintId, fee);
    }

    /**
     * @dev Deduct fee from payer's balance
     * @param payer Address of the payer
     * @param amount Amount to deduct
     * @param reason Reason for deduction
     */
    function deductFee(address payer, uint256 amount, string calldata reason) 
        external 
        onlyRole(BILLING_MANAGER_ROLE) 
        whenNotPaused 
    {
        require(balances[payer] >= amount, "Insufficient balance for fee deduction");
        
        balances[payer] -= amount;
        totalFees += amount;
        
        emit FeeDeducted(payer, amount, reason);
    }

    /**
     * @dev Get balance of an address
     * @param account Address to check
     * @return balance Current balance
     */
    function getBalance(address account) external view returns (uint256 balance) {
        return balances[account];
    }

    /**
     * @dev Get step fee for a blueprint
     * @param blueprintId ID of the blueprint
     * @return fee Step fee amount
     */
    function getStepFee(uint256 blueprintId) external view returns (uint256 fee) {
        return stepFees[blueprintId];
    }

    /**
     * @dev Check if payer has sufficient balance for fee
     * @param payer Address of the payer
     * @param amount Required amount
     * @return sufficient True if balance is sufficient
     */
    function hasSufficientBalance(address payer, uint256 amount) external view returns (bool sufficient) {
        return balances[payer] >= amount;
    }

    /**
     * @dev Emergency withdrawal by admin
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        require(address(this).balance >= amount, "Insufficient contract balance");
        payable(msg.sender).transfer(amount);
    }
}


