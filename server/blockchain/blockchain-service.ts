import { ethers } from 'ethers';

// Contract ABI (Application Binary Interface)
const UPLINK_CONTRACT_ABI = [
  "function createContract(address _innovator, address _investor, string _projectTitle, string _projectDescription, uint256 _totalAmount) returns (uint256)",
  "function addMilestone(uint256 _contractId, string _description, uint256 _amount, uint256 _deadline)",
  "function activateContract(uint256 _contractId)",
  "function depositFunds(uint256 _contractId) payable",
  "function completeMilestone(uint256 _contractId, uint256 _milestoneIndex)",
  "function approveMilestone(uint256 _contractId, uint256 _milestoneIndex)",
  "function cancelContract(uint256 _contractId)",
  "function raiseDispute(uint256 _contractId)",
  "function getContract(uint256 _contractId) view returns (address, address, string, uint256, uint8, uint256)",
  "function getMilestone(uint256 _contractId, uint256 _milestoneIndex) view returns (string, uint256, uint256, uint8, bool)",
  "function getEscrowBalance(uint256 _contractId) view returns (uint256)",
  "event ContractCreated(uint256 indexed contractId, address indexed innovator, address indexed investor)",
  "event MilestoneCompleted(uint256 indexed contractId, uint256 milestoneIndex)",
  "event FundsReleased(uint256 indexed contractId, uint256 milestoneIndex, uint256 amount)"
];

// Blockchain Configuration
const BLOCKCHAIN_CONFIG = {
  // Polygon Mumbai Testnet
  rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'https://rpc-mumbai.maticvigil.com',
  chainId: 80001,
  contractAddress: process.env.UPLINK_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  // For production, use Polygon Mainnet
  // rpcUrl: 'https://polygon-rpc.com',
  // chainId: 137,
};

/**
 * Blockchain Service for UPLINK3 Smart Contracts
 */
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(BLOCKCHAIN_CONFIG.rpcUrl);
    this.contract = new ethers.Contract(
      BLOCKCHAIN_CONFIG.contractAddress,
      UPLINK_CONTRACT_ABI,
      this.provider
    );
  }

  /**
   * Create a new smart contract on blockchain
   */
  async createContract(params: {
    innovatorAddress: string;
    investorAddress: string;
    projectTitle: string;
    projectDescription: string;
    totalAmount: string; // in ETH/MATIC
    privateKey: string; // Signer's private key
  }): Promise<{ contractId: number; transactionHash: string }> {
    try {
      const wallet = new ethers.Wallet(params.privateKey, this.provider);
      const contractWithSigner = this.contract.connect(wallet);

      const amountInWei = ethers.parseEther(params.totalAmount);

      const tx = await contractWithSigner.createContract(
        params.innovatorAddress,
        params.investorAddress,
        params.projectTitle,
        params.projectDescription,
        amountInWei
      );

      const receipt = await tx.wait();

      // Extract contractId from event logs
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = this.contract.interface.parseLog(log);
          return parsed?.name === 'ContractCreated';
        } catch {
          return false;
        }
      });

      const parsedEvent = this.contract.interface.parseLog(event);
      const contractId = Number(parsedEvent?.args[0]);

      return {
        contractId,
        transactionHash: receipt.hash,
      };
    } catch (error: any) {
      console.error('[Blockchain] Create contract error:', error);
      throw new Error(`Failed to create contract: ${error.message}`);
    }
  }

  /**
   * Add milestone to contract
   */
  async addMilestone(params: {
    contractId: number;
    description: string;
    amount: string; // in ETH/MATIC
    deadline: number; // Unix timestamp
    privateKey: string;
  }): Promise<{ transactionHash: string }> {
    try {
      const wallet = new ethers.Wallet(params.privateKey, this.provider);
      const contractWithSigner = this.contract.connect(wallet);

      const amountInWei = ethers.parseEther(params.amount);

      const tx = await contractWithSigner.addMilestone(
        params.contractId,
        params.description,
        amountInWei,
        params.deadline
      );

      const receipt = await tx.wait();

      return { transactionHash: receipt.hash };
    } catch (error: any) {
      console.error('[Blockchain] Add milestone error:', error);
      throw new Error(`Failed to add milestone: ${error.message}`);
    }
  }

  /**
   * Activate contract
   */
  async activateContract(params: {
    contractId: number;
    privateKey: string;
  }): Promise<{ transactionHash: string }> {
    try {
      const wallet = new ethers.Wallet(params.privateKey, this.provider);
      const contractWithSigner = this.contract.connect(wallet);

      const tx = await contractWithSigner.activateContract(params.contractId);
      const receipt = await tx.wait();

      return { transactionHash: receipt.hash };
    } catch (error: any) {
      console.error('[Blockchain] Activate contract error:', error);
      throw new Error(`Failed to activate contract: ${error.message}`);
    }
  }

  /**
   * Deposit funds to escrow
   */
  async depositFunds(params: {
    contractId: number;
    amount: string; // in ETH/MATIC
    privateKey: string;
  }): Promise<{ transactionHash: string }> {
    try {
      const wallet = new ethers.Wallet(params.privateKey, this.provider);
      const contractWithSigner = this.contract.connect(wallet);

      const amountInWei = ethers.parseEther(params.amount);

      const tx = await contractWithSigner.depositFunds(params.contractId, {
        value: amountInWei,
      });

      const receipt = await tx.wait();

      return { transactionHash: receipt.hash };
    } catch (error: any) {
      console.error('[Blockchain] Deposit funds error:', error);
      throw new Error(`Failed to deposit funds: ${error.message}`);
    }
  }

  /**
   * Complete milestone
   */
  async completeMilestone(params: {
    contractId: number;
    milestoneIndex: number;
    privateKey: string;
  }): Promise<{ transactionHash: string }> {
    try {
      const wallet = new ethers.Wallet(params.privateKey, this.provider);
      const contractWithSigner = this.contract.connect(wallet);

      const tx = await contractWithSigner.completeMilestone(
        params.contractId,
        params.milestoneIndex
      );

      const receipt = await tx.wait();

      return { transactionHash: receipt.hash };
    } catch (error: any) {
      console.error('[Blockchain] Complete milestone error:', error);
      throw new Error(`Failed to complete milestone: ${error.message}`);
    }
  }

  /**
   * Approve milestone and release funds
   */
  async approveMilestone(params: {
    contractId: number;
    milestoneIndex: number;
    privateKey: string;
  }): Promise<{ transactionHash: string }> {
    try {
      const wallet = new ethers.Wallet(params.privateKey, this.provider);
      const contractWithSigner = this.contract.connect(wallet);

      const tx = await contractWithSigner.approveMilestone(
        params.contractId,
        params.milestoneIndex
      );

      const receipt = await tx.wait();

      return { transactionHash: receipt.hash };
    } catch (error: any) {
      console.error('[Blockchain] Approve milestone error:', error);
      throw new Error(`Failed to approve milestone: ${error.message}`);
    }
  }

  /**
   * Get contract details from blockchain
   */
  async getContract(contractId: number): Promise<{
    innovator: string;
    investor: string;
    projectTitle: string;
    totalAmount: string;
    status: number;
    milestoneCount: number;
  }> {
    try {
      const result = await this.contract.getContract(contractId);

      return {
        innovator: result[0],
        investor: result[1],
        projectTitle: result[2],
        totalAmount: ethers.formatEther(result[3]),
        status: Number(result[4]),
        milestoneCount: Number(result[5]),
      };
    } catch (error: any) {
      console.error('[Blockchain] Get contract error:', error);
      throw new Error(`Failed to get contract: ${error.message}`);
    }
  }

  /**
   * Get milestone details from blockchain
   */
  async getMilestone(
    contractId: number,
    milestoneIndex: number
  ): Promise<{
    description: string;
    amount: string;
    deadline: number;
    status: number;
    fundsReleased: boolean;
  }> {
    try {
      const result = await this.contract.getMilestone(contractId, milestoneIndex);

      return {
        description: result[0],
        amount: ethers.formatEther(result[1]),
        deadline: Number(result[2]),
        status: Number(result[3]),
        fundsReleased: result[4],
      };
    } catch (error: any) {
      console.error('[Blockchain] Get milestone error:', error);
      throw new Error(`Failed to get milestone: ${error.message}`);
    }
  }

  /**
   * Get escrow balance
   */
  async getEscrowBalance(contractId: number): Promise<string> {
    try {
      const balance = await this.contract.getEscrowBalance(contractId);
      return ethers.formatEther(balance);
    } catch (error: any) {
      console.error('[Blockchain] Get escrow balance error:', error);
      throw new Error(`Failed to get escrow balance: ${error.message}`);
    }
  }

  /**
   * Estimate gas fee for transaction
   */
  async estimateGasFee(method: string, params: any[]): Promise<string> {
    try {
      const gasEstimate = await this.contract[method].estimateGas(...params);
      const gasPrice = await this.provider.getFeeData();
      const gasCost = gasEstimate * (gasPrice.gasPrice || BigInt(0));
      return ethers.formatEther(gasCost);
    } catch (error: any) {
      console.error('[Blockchain] Estimate gas error:', error);
      return '0.01'; // Default estimate
    }
  }

  /**
   * Listen to contract events
   */
  listenToEvents(callback: (event: any) => void) {
    this.contract.on('ContractCreated', (contractId, innovator, investor, event) => {
      callback({
        type: 'ContractCreated',
        contractId: Number(contractId),
        innovator,
        investor,
        transactionHash: event.log.transactionHash,
      });
    });

    this.contract.on('MilestoneCompleted', (contractId, milestoneIndex, event) => {
      callback({
        type: 'MilestoneCompleted',
        contractId: Number(contractId),
        milestoneIndex: Number(milestoneIndex),
        transactionHash: event.log.transactionHash,
      });
    });

    this.contract.on('FundsReleased', (contractId, milestoneIndex, amount, event) => {
      callback({
        type: 'FundsReleased',
        contractId: Number(contractId),
        milestoneIndex: Number(milestoneIndex),
        amount: ethers.formatEther(amount),
        transactionHash: event.log.transactionHash,
      });
    });
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();
