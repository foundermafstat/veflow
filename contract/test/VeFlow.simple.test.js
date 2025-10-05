const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VeFlow System - Simple Tests", function () {
  it("Should compile contracts successfully", async function () {
    // This test just verifies that contracts can be compiled
    const VeFlowAccessControl = await ethers.getContractFactory("VeFlowAccessControl");
    expect(VeFlowAccessControl).to.not.be.undefined;
    
    const VeFlowRegistry = await ethers.getContractFactory("VeFlowRegistry");
    expect(VeFlowRegistry).to.not.be.undefined;
    
    const VeFlowBilling = await ethers.getContractFactory("VeFlowBilling");
    expect(VeFlowBilling).to.not.be.undefined;
    
    const VeFlowExecutor = await ethers.getContractFactory("VeFlowExecutor");
    expect(VeFlowExecutor).to.not.be.undefined;
    
    const VeFlowOrchestrator = await ethers.getContractFactory("VeFlowOrchestrator");
    expect(VeFlowOrchestrator).to.not.be.undefined;
  });

  it("Should deploy VeFlowAccessControl", async function () {
    const VeFlowAccessControl = await ethers.getContractFactory("VeFlowAccessControl");
    const accessControl = await VeFlowAccessControl.deploy();
    await accessControl.waitForDeployment();
    
    const address = await accessControl.getAddress();
    expect(address).to.not.be.undefined;
    expect(address).to.not.equal("0x0000000000000000000000000000000000000000");
  });

  it("Should deploy VeFlowRegistry", async function () {
    const VeFlowRegistry = await ethers.getContractFactory("VeFlowRegistry");
    const registry = await VeFlowRegistry.deploy();
    await registry.waitForDeployment();
    
    const address = await registry.getAddress();
    expect(address).to.not.be.undefined;
    expect(address).to.not.equal("0x0000000000000000000000000000000000000000");
  });

  it("Should deploy VeFlowBilling", async function () {
    const VeFlowBilling = await ethers.getContractFactory("VeFlowBilling");
    const billing = await VeFlowBilling.deploy();
    await billing.waitForDeployment();
    
    const address = await billing.getAddress();
    expect(address).to.not.be.undefined;
    expect(address).to.not.equal("0x0000000000000000000000000000000000000000");
  });

  it("Should deploy VeFlowExecutor", async function () {
    const VeFlowExecutor = await ethers.getContractFactory("VeFlowExecutor");
    const executor = await VeFlowExecutor.deploy();
    await executor.waitForDeployment();
    
    const address = await executor.getAddress();
    expect(address).to.not.be.undefined;
    expect(address).to.not.equal("0x0000000000000000000000000000000000000000");
  });

  it("Should deploy VeFlowOrchestrator with dependencies", async function () {
    // Deploy dependencies first
    const VeFlowRegistry = await ethers.getContractFactory("VeFlowRegistry");
    const registry = await VeFlowRegistry.deploy();
    await registry.waitForDeployment();
    const registryAddress = await registry.getAddress();

    const VeFlowBilling = await ethers.getContractFactory("VeFlowBilling");
    const billing = await VeFlowBilling.deploy();
    await billing.waitForDeployment();
    const billingAddress = await billing.getAddress();

    // Deploy orchestrator with dependencies
    const VeFlowOrchestrator = await ethers.getContractFactory("VeFlowOrchestrator");
    const orchestrator = await VeFlowOrchestrator.deploy(registryAddress, billingAddress);
    await orchestrator.waitForDeployment();
    
    const address = await orchestrator.getAddress();
    expect(address).to.not.be.undefined;
    expect(address).to.not.equal("0x0000000000000000000000000000000000000000");
  });
});
