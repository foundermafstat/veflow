// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./VeFlowAccessControl.sol";

/**
 * @title VeFlowRegistry
 * @dev Manages registration and versioning of Blueprints
 */
contract VeFlowRegistry is VeFlowAccessControl {
    // Blueprint structure
    struct Blueprint {
        uint256 id;
        address author;
        string metadataURI;
        uint16 version;
        bool active;
        uint256 createdAt;
    }

    // State variables
    uint256 private _nextBlueprintId = 1;
    mapping(uint256 => Blueprint) public blueprints;
    mapping(address => uint256[]) public authorBlueprints;
    mapping(uint256 => uint16) public blueprintVersions;

    // Events
    event BlueprintRegistered(uint256 indexed id, address indexed author, uint16 version);
    event BlueprintUpdated(uint256 indexed id, uint16 newVersion);
    event BlueprintDeactivated(uint256 indexed id);

    /**
     * @dev Register a new blueprint
     * @param metadataURI URI containing blueprint metadata
     * @return blueprintId The ID of the registered blueprint
     */
    function registerBlueprint(string calldata metadataURI) 
        external 
        whenNotPaused 
        onlyRole(AUTHOR_ROLE) 
        returns (uint256 blueprintId) 
    {
        require(bytes(metadataURI).length > 0, "Metadata URI cannot be empty");

        blueprintId = _nextBlueprintId++;
        
        Blueprint storage blueprint = blueprints[blueprintId];
        blueprint.id = blueprintId;
        blueprint.author = msg.sender;
        blueprint.metadataURI = metadataURI;
        blueprint.version = 1;
        blueprint.active = true;
        blueprint.createdAt = block.timestamp;

        authorBlueprints[msg.sender].push(blueprintId);
        blueprintVersions[blueprintId] = 1;

        emit BlueprintRegistered(blueprintId, msg.sender, 1);
    }

    /**
     * @dev Update an existing blueprint
     * @param blueprintId ID of the blueprint to update
     * @param metadataURI New metadata URI
     */
    function updateBlueprint(uint256 blueprintId, string calldata metadataURI) 
        external 
        whenNotPaused 
        onlyRole(AUTHOR_ROLE) 
    {
        require(blueprints[blueprintId].id != 0, "Blueprint does not exist");
        require(blueprints[blueprintId].author == msg.sender || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not authorized");
        require(bytes(metadataURI).length > 0, "Metadata URI cannot be empty");

        blueprints[blueprintId].metadataURI = metadataURI;
        blueprints[blueprintId].version++;
        blueprintVersions[blueprintId]++;

        emit BlueprintUpdated(blueprintId, blueprints[blueprintId].version);
    }

    /**
     * @dev Deactivate a blueprint
     * @param blueprintId ID of the blueprint to deactivate
     */
    function deactivateBlueprint(uint256 blueprintId) 
        external 
        whenNotPaused 
        onlyRole(AUTHOR_ROLE) 
    {
        require(blueprints[blueprintId].id != 0, "Blueprint does not exist");
        require(blueprints[blueprintId].author == msg.sender || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not authorized");

        blueprints[blueprintId].active = false;
        emit BlueprintDeactivated(blueprintId);
    }

    /**
     * @dev Get blueprint information
     * @param blueprintId ID of the blueprint
     * @return blueprint The blueprint struct
     */
    function getBlueprint(uint256 blueprintId) external view returns (Blueprint memory blueprint) {
        require(blueprints[blueprintId].id != 0, "Blueprint does not exist");
        return blueprints[blueprintId];
    }

    /**
     * @dev Get blueprints by author
     * @param author Address of the author
     * @return blueprintIds Array of blueprint IDs
     */
    function getBlueprintsByAuthor(address author) external view returns (uint256[] memory blueprintIds) {
        return authorBlueprints[author];
    }

    /**
     * @dev Check if blueprint exists and is active
     * @param blueprintId ID of the blueprint
     * @return exists True if blueprint exists
     * @return active True if blueprint is active
     */
    function isBlueprintValid(uint256 blueprintId) external view returns (bool exists, bool active) {
        exists = blueprints[blueprintId].id != 0;
        active = exists && blueprints[blueprintId].active;
    }

    /**
     * @dev Get total number of blueprints
     * @return count Total number of registered blueprints
     */
    function getBlueprintCount() external view returns (uint256 count) {
        return _nextBlueprintId - 1;
    }
}


