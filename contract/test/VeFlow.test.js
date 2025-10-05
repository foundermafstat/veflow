const { expect } = require("chai");
const { ethers } = require("hardhat");
const { thor } = require("@vechain/sdk-core");

describe("VeFlow System", function () {
  let accessControl, registry, billing, executor, orchestrator;
  let owner, author, executorUser, billingManager;
  let addresses;

  beforeEach(async function () {
    // Get signers from hardhat network
    try {
      const signers = await ethers.getSigners();
      [owner, author, executorUser, billingManager] = signers;
    } catch (error) {
      // Fallback for VeChain SDK plugin
      const accounts = await ethers.getSigners();
      [owner, author, executorUser, billingManager] = accounts;
    }
    addresses = { owner, author, executorUser, billingManager };

    // Deploy contracts
    const VeFlowAccessControl = await ethers.getContractFactory("VeFlowAccessControl");
    accessControl = await VeFlowAccessControl.deploy();
    await accessControl.waitForDeployment();

    const VeFlowRegistry = await ethers.getContractFactory("VeFlowRegistry");
    registry = await VeFlowRegistry.deploy();
    await registry.waitForDeployment();

    const VeFlowBilling = await ethers.getContractFactory("VeFlowBilling");
    billing = await VeFlowBilling.deploy();
    await billing.waitForDeployment();

    const VeFlowExecutor = await ethers.getContractFactory("VeFlowExecutor");
    executor = await VeFlowExecutor.deploy();
    await executor.waitForDeployment();

    const registryAddress = await registry.getAddress();
    const billingAddress = await billing.getAddress();

    const VeFlowOrchestrator = await ethers.getContractFactory("VeFlowOrchestrator");
    orchestrator = await VeFlowOrchestrator.deploy(registryAddress, billingAddress);
    await orchestrator.waitForDeployment();

    // Setup roles
    const AUTHOR_ROLE = await registry.AUTHOR_ROLE();
    const EXECUTOR_ROLE = await registry.EXECUTOR_ROLE();
    const BILLING_MANAGER_ROLE = await billing.BILLING_MANAGER_ROLE();

    await registry.grantRole(AUTHOR_ROLE, author.address);
    await registry.grantRole(EXECUTOR_ROLE, executorUser.address);
    await billing.grantRole(BILLING_MANAGER_ROLE, billingManager.address);
  });

  describe("VeFlowRegistry", function () {
    it("Should register a blueprint", async function () {
      const metadataURI = "https://example.com/blueprint.json";
      
      const tx = await registry.connect(author).registerBlueprint(metadataURI);
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(log => {
        try {
          const parsed = registry.interface.parseLog(log);
          return parsed.name === "BlueprintRegistered";
        } catch (e) {
          return false;
        }
      });

      expect(event).to.not.be.undefined;
      
      const blueprint = await registry.getBlueprint(1);
      expect(blueprint.id).to.equal(1);
      expect(blueprint.author).to.equal(author.address);
      expect(blueprint.metadataURI).to.equal(metadataURI);
      expect(blueprint.version).to.equal(1);
      expect(blueprint.active).to.be.true;
    });

    it("Should update a blueprint", async function () {
      // First register a blueprint
      await registry.connect(author).registerBlueprint("https://example.com/blueprint.json");
      
      const newMetadataURI = "https://example.com/updated-blueprint.json";
      
      const tx = await registry.connect(author).updateBlueprint(1, newMetadataURI);
      const receipt = await tx.wait();
      
      const blueprint = await registry.getBlueprint(1);
      expect(blueprint.metadataURI).to.equal(newMetadataURI);
      expect(blueprint.version).to.equal(2);
    });

    it("Should deactivate a blueprint", async function () {
      await registry.connect(author).registerBlueprint("https://example.com/blueprint.json");
      
      await registry.connect(author).deactivateBlueprint(1);
      
      const blueprint = await registry.getBlueprint(1);
      expect(blueprint.active).to.be.false;
    });

    it("Should reject unauthorized blueprint operations", async function () {
      await expect(
        registry.connect(executorUser).registerBlueprint("https://example.com/blueprint.json")
      ).to.be.revertedWithCustomError(registry, "AccessControlUnauthorizedAccount");
    });
  });

  describe("VeFlowBilling", function () {
    it("Should handle deposits and withdrawals", async function () {
      const depositAmount = ethers.parseEther("1.0");
      
      // Deposit
      const depositTx = await billing.deposit(owner.address, { value: depositAmount });
      await depositTx.wait();
      
      const balance = await billing.getBalance(owner.address);
      expect(balance).to.equal(depositAmount);
      
      // Withdraw
      const withdrawAmount = ethers.parseEther("0.5");
      const withdrawTx = await billing.withdraw(withdrawAmount);
      await withdrawTx.wait();
      
      const newBalance = await billing.getBalance(owner.address);
      expect(newBalance).to.equal(depositAmount - withdrawAmount);
    });

    it("Should set step fees", async function () {
      const fee = ethers.parseEther("0.01");
      
      await billing.connect(billingManager).setStepFee(1, fee);
      
      const stepFee = await billing.getStepFee(1);
      expect(stepFee).to.equal(fee);
    });

    it("Should deduct fees", async function () {
      const depositAmount = ethers.parseEther("1.0");
      await billing.deposit(owner.address, { value: depositAmount });
      
      const fee = ethers.parseEther("0.1");
      await billing.connect(billingManager).deductFee(owner.address, fee, "Test fee");
      
      const balance = await billing.getBalance(owner.address);
      expect(balance).to.equal(depositAmount - fee);
    });
  });

  describe("VeFlowOrchestrator", function () {
    beforeEach(async function () {
      // Register a blueprint first
      await registry.connect(author).registerBlueprint("https://example.com/blueprint.json");
    });

    it("Should create a flow", async function () {
      const tx = await orchestrator.connect(author).linkBlueprints([1]);
      const receipt = await tx.wait();
      
      const blueprints = await orchestrator.getFlowBlueprints(1);
      expect(blueprints).to.deep.equal([1]);
    });

    it("Should start flow execution", async function () {
      await orchestrator.connect(author).linkBlueprints([1]);
      
      const inputData = ethers.toUtf8Bytes("test input");
      const payment = ethers.parseEther("0.1");
      
      const tx = await orchestrator.connect(owner).startFlow(1, inputData, { value: payment });
      const receipt = await tx.wait();
      
      const execution = await orchestrator.getFlowExecution(1);
      expect(execution.flowId).to.equal(1);
      expect(execution.executor).to.equal(owner.address);
      expect(execution.currentStep).to.equal(0);
      expect(execution.completed).to.be.false;
    });

    it("Should execute flow steps", async function () {
      await orchestrator.connect(author).linkBlueprints([1]);
      
      const inputData = ethers.toUtf8Bytes("test input");
      const payment = ethers.parseEther("0.1");
      await orchestrator.connect(owner).startFlow(1, inputData, { value: payment });
      
      const stepOutput = ethers.toUtf8Bytes("step output");
      const executorSig = "0x"; // Empty signature for test
      
      const tx = await orchestrator.connect(executorUser).executeStep(1, 0, stepOutput, executorSig);
      const receipt = await tx.wait();
      
      const execution = await orchestrator.getFlowExecution(1);
      expect(execution.currentStep).to.equal(1);
      expect(execution.completed).to.be.true;
    });
  });

  describe("VeFlowExecutor", function () {
    it("Should register endpoints", async function () {
      const endpointId = ethers.keccak256(ethers.toUtf8Bytes("test-endpoint"));
      const targetAddress = owner.address;
      const selector = "0x12345678";
      
      await executor.registerEndpoint(endpointId, targetAddress, selector);
      
      const endpoint = await executor.getEndpoint(endpointId);
      expect(endpoint.target).to.equal(targetAddress);
      expect(endpoint.selector).to.equal(selector);
      expect(endpoint.active).to.be.true;
    });

    it("Should deactivate endpoints", async function () {
      const endpointId = ethers.keccak256(ethers.toUtf8Bytes("test-endpoint"));
      const targetAddress = owner.address;
      const selector = "0x12345678";
      
      await executor.registerEndpoint(endpointId, targetAddress, selector);
      await executor.deactivateEndpoint(endpointId);
      
      const endpoint = await executor.getEndpoint(endpointId);
      expect(endpoint.active).to.be.false;
    });
  });

  describe("Access Control", function () {
    it("Should pause and unpause contracts", async function () {
      await registry.pause();
      expect(await registry.paused()).to.be.true;
      
      await registry.unpause();
      expect(await registry.paused()).to.be.false;
    });

    it("Should check role permissions", async function () {
      expect(await registry.isAuthor(author.address)).to.be.true;
      expect(await registry.isAuthor(executorUser.address)).to.be.false;
      
      expect(await registry.isExecutor(executorUser.address)).to.be.true;
      expect(await registry.isExecutor(author.address)).to.be.false;
    });
  });
});
