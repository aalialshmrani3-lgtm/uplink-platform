// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title UplinkContract
 * @dev Smart Contract for UPLINK3 Innovation Projects
 */
contract UplinkContract is Ownable, ReentrancyGuard {
    
    enum ContractStatus { DRAFT, ACTIVE, COMPLETED, CANCELLED, DISPUTED }
    enum MilestoneStatus { PENDING, IN_PROGRESS, COMPLETED, REJECTED }
    
    struct Milestone {
        string description;
        uint256 amount;
        uint256 deadline;
        MilestoneStatus status;
        bool fundsReleased;
    }
    
    struct Contract {
        uint256 id;
        address innovator;
        address investor;
        string projectTitle;
        string projectDescription;
        uint256 totalAmount;
        uint256 createdAt;
        ContractStatus status;
        Milestone[] milestones;
    }
    
    uint256 private contractCounter;
    mapping(uint256 => Contract) public contracts;
    mapping(uint256 => uint256) public escrowBalances;
    
    event ContractCreated(uint256 indexed contractId, address indexed innovator, address indexed investor);
    event MilestoneAdded(uint256 indexed contractId, uint256 milestoneIndex);
    event MilestoneCompleted(uint256 indexed contractId, uint256 milestoneIndex);
    event FundsDeposited(uint256 indexed contractId, uint256 amount);
    event FundsReleased(uint256 indexed contractId, uint256 milestoneIndex, uint256 amount);
    event ContractCancelled(uint256 indexed contractId);
    event DisputeRaised(uint256 indexed contractId);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Create a new contract
     */
    function createContract(
        address _innovator,
        address _investor,
        string memory _projectTitle,
        string memory _projectDescription,
        uint256 _totalAmount
    ) external returns (uint256) {
        require(_innovator != address(0) && _investor != address(0), "Invalid addresses");
        require(_totalAmount > 0, "Amount must be greater than 0");
        
        contractCounter++;
        uint256 newContractId = contractCounter;
        
        Contract storage newContract = contracts[newContractId];
        newContract.id = newContractId;
        newContract.innovator = _innovator;
        newContract.investor = _investor;
        newContract.projectTitle = _projectTitle;
        newContract.projectDescription = _projectDescription;
        newContract.totalAmount = _totalAmount;
        newContract.createdAt = block.timestamp;
        newContract.status = ContractStatus.DRAFT;
        
        emit ContractCreated(newContractId, _innovator, _investor);
        return newContractId;
    }
    
    /**
     * @dev Add milestone to contract
     */
    function addMilestone(
        uint256 _contractId,
        string memory _description,
        uint256 _amount,
        uint256 _deadline
    ) external {
        Contract storage c = contracts[_contractId];
        require(c.status == ContractStatus.DRAFT, "Contract not in draft status");
        require(msg.sender == c.innovator || msg.sender == c.investor, "Not authorized");
        
        c.milestones.push(Milestone({
            description: _description,
            amount: _amount,
            deadline: _deadline,
            status: MilestoneStatus.PENDING,
            fundsReleased: false
        }));
        
        emit MilestoneAdded(_contractId, c.milestones.length - 1);
    }
    
    /**
     * @dev Activate contract (both parties must sign)
     */
    function activateContract(uint256 _contractId) external {
        Contract storage c = contracts[_contractId];
        require(c.status == ContractStatus.DRAFT, "Contract not in draft status");
        require(msg.sender == c.innovator || msg.sender == c.investor, "Not authorized");
        require(c.milestones.length > 0, "No milestones defined");
        
        c.status = ContractStatus.ACTIVE;
    }
    
    /**
     * @dev Deposit funds to escrow
     */
    function depositFunds(uint256 _contractId) external payable nonReentrant {
        Contract storage c = contracts[_contractId];
        require(c.status == ContractStatus.ACTIVE, "Contract not active");
        require(msg.sender == c.investor, "Only investor can deposit");
        require(msg.value > 0, "Must send funds");
        
        escrowBalances[_contractId] += msg.value;
        emit FundsDeposited(_contractId, msg.value);
    }
    
    /**
     * @dev Complete milestone and request fund release
     */
    function completeMilestone(uint256 _contractId, uint256 _milestoneIndex) external {
        Contract storage c = contracts[_contractId];
        require(c.status == ContractStatus.ACTIVE, "Contract not active");
        require(msg.sender == c.innovator, "Only innovator can complete milestone");
        require(_milestoneIndex < c.milestones.length, "Invalid milestone");
        
        Milestone storage milestone = c.milestones[_milestoneIndex];
        require(milestone.status == MilestoneStatus.IN_PROGRESS, "Milestone not in progress");
        
        milestone.status = MilestoneStatus.COMPLETED;
        emit MilestoneCompleted(_contractId, _milestoneIndex);
    }
    
    /**
     * @dev Approve milestone and release funds
     */
    function approveMilestone(uint256 _contractId, uint256 _milestoneIndex) external nonReentrant {
        Contract storage c = contracts[_contractId];
        require(c.status == ContractStatus.ACTIVE, "Contract not active");
        require(msg.sender == c.investor, "Only investor can approve");
        require(_milestoneIndex < c.milestones.length, "Invalid milestone");
        
        Milestone storage milestone = c.milestones[_milestoneIndex];
        require(milestone.status == MilestoneStatus.COMPLETED, "Milestone not completed");
        require(!milestone.fundsReleased, "Funds already released");
        require(escrowBalances[_contractId] >= milestone.amount, "Insufficient escrow balance");
        
        milestone.fundsReleased = true;
        escrowBalances[_contractId] -= milestone.amount;
        
        (bool success, ) = c.innovator.call{value: milestone.amount}("");
        require(success, "Transfer failed");
        
        emit FundsReleased(_contractId, _milestoneIndex, milestone.amount);
        
        // Check if all milestones completed
        bool allCompleted = true;
        for (uint256 i = 0; i < c.milestones.length; i++) {
            if (!c.milestones[i].fundsReleased) {
                allCompleted = false;
                break;
            }
        }
        
        if (allCompleted) {
            c.status = ContractStatus.COMPLETED;
        }
    }
    
    /**
     * @dev Cancel contract
     */
    function cancelContract(uint256 _contractId) external nonReentrant {
        Contract storage c = contracts[_contractId];
        require(c.status == ContractStatus.DRAFT || c.status == ContractStatus.ACTIVE, "Cannot cancel");
        require(msg.sender == c.innovator || msg.sender == c.investor, "Not authorized");
        
        c.status = ContractStatus.CANCELLED;
        
        // Refund escrow to investor
        uint256 balance = escrowBalances[_contractId];
        if (balance > 0) {
            escrowBalances[_contractId] = 0;
            (bool success, ) = c.investor.call{value: balance}("");
            require(success, "Refund failed");
        }
        
        emit ContractCancelled(_contractId);
    }
    
    /**
     * @dev Raise dispute
     */
    function raiseDispute(uint256 _contractId) external {
        Contract storage c = contracts[_contractId];
        require(c.status == ContractStatus.ACTIVE, "Contract not active");
        require(msg.sender == c.innovator || msg.sender == c.investor, "Not authorized");
        
        c.status = ContractStatus.DISPUTED;
        emit DisputeRaised(_contractId);
    }
    
    /**
     * @dev Get contract details
     */
    function getContract(uint256 _contractId) external view returns (
        address innovator,
        address investor,
        string memory projectTitle,
        uint256 totalAmount,
        ContractStatus status,
        uint256 milestoneCount
    ) {
        Contract storage c = contracts[_contractId];
        return (
            c.innovator,
            c.investor,
            c.projectTitle,
            c.totalAmount,
            c.status,
            c.milestones.length
        );
    }
    
    /**
     * @dev Get milestone details
     */
    function getMilestone(uint256 _contractId, uint256 _milestoneIndex) external view returns (
        string memory description,
        uint256 amount,
        uint256 deadline,
        MilestoneStatus status,
        bool fundsReleased
    ) {
        Contract storage c = contracts[_contractId];
        require(_milestoneIndex < c.milestones.length, "Invalid milestone");
        
        Milestone storage milestone = c.milestones[_milestoneIndex];
        return (
            milestone.description,
            milestone.amount,
            milestone.deadline,
            milestone.status,
            milestone.fundsReleased
        );
    }
    
    /**
     * @dev Get escrow balance
     */
    function getEscrowBalance(uint256 _contractId) external view returns (uint256) {
        return escrowBalances[_contractId];
    }
}
