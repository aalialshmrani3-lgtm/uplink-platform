import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface BlockchainConnectProps {
  onConnect?: (address: string, provider: ethers.BrowserProvider) => void;
}

export function BlockchainConnect({ onConnect }: BlockchainConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [chainId, setChainId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  // Using toast from sonner (imported above)

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const balance = await provider.getBalance(address);
          const network = await provider.getNetwork();
          
          setAddress(address);
          setBalance(ethers.formatEther(balance));
          setChainId(Number(network.chainId));
          setIsConnected(true);
          
          if (onConnect) {
            onConnect(address, provider);
          }
        }
      } catch (error: any) {
        console.error('Check connection error:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask غير مثبت. يرجى تثبيت MetaMask للمتابعة');
      return;
    }

    setIsLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      await provider.send('eth_requestAccounts', []);
      
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      const network = await provider.getNetwork();
      
      setAddress(address);
      setBalance(ethers.formatEther(balance));
      setChainId(Number(network.chainId));
      setIsConnected(true);
      
      toast.success(`تم الاتصال بنجاح! العنوان: ${address.slice(0, 6)}...${address.slice(-4)}`);
      
      if (onConnect) {
        onConnect(address, provider);
      }
    } catch (error: any) {
      console.error('Connect wallet error:', error);
      toast.error(error.message || 'حدث خطأ أثناء الاتصال بالمحفظة');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress('');
    setBalance('0');
    setChainId(0);
    
    toast.success('تم قطع الاتصال بالمحفظة بنجاح');
  };

  const switchNetwork = async () => {
    try {
      // Switch to Polygon Mumbai Testnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }], // 80001 in hex
      });
      
      toast.success('تم التبديل إلى Polygon Mumbai Testnet');
      
      await checkConnection();
    } catch (error: any) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x13881',
                chainName: 'Polygon Mumbai Testnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
                blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
              },
            ],
          });
          
          toast.success('تمت إضافة Polygon Mumbai Testnet بنجاح');
        } catch (addError: any) {
          console.error('Add network error:', addError);
          toast.error('فشل إضافة الشبكة: ' + addError.message);
        }
      } else {
        console.error('Switch network error:', error);
        toast.error('فشل تبديل الشبكة: ' + error.message);
      }
    }
  };

  const getNetworkName = (chainId: number): string => {
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet';
      case 137:
        return 'Polygon Mainnet';
      case 80001:
        return 'Polygon Mumbai';
      case 11155111:
        return 'Sepolia Testnet';
      default:
        return `Chain ${chainId}`;
    }
  };

  const isCorrectNetwork = chainId === 80001; // Polygon Mumbai

  if (!isConnected) {
    return (
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2">
        <div className="flex flex-col items-center text-center space-y-4">
          <Wallet className="w-16 h-16 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="text-xl font-bold mb-2">اربط محفظتك</h3>
            <p className="text-sm text-muted-foreground mb-4">
              قم بربط محفظة MetaMask الخاصة بك للتفاعل مع العقود الذكية
            </p>
          </div>
          <Button
            onClick={connectWallet}
            disabled={isLoading}
            size="lg"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الاتصال...
              </>
            ) : (
              <>
                <Wallet className="ml-2 h-4 w-4" />
                اربط المحفظة
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="font-semibold">متصل</span>
        </div>
        <Button variant="ghost" size="sm" onClick={disconnectWallet}>
          قطع الاتصال
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">العنوان</p>
          <p className="font-mono text-sm">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1">الرصيد</p>
          <p className="font-semibold">{parseFloat(balance).toFixed(4)} MATIC</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1">الشبكة</p>
          <div className="flex items-center gap-2">
            <Badge variant={isCorrectNetwork ? 'default' : 'destructive'}>
              {getNetworkName(chainId)}
            </Badge>
            {!isCorrectNetwork && (
              <Button variant="outline" size="sm" onClick={switchNetwork}>
                تبديل إلى Mumbai
              </Button>
            )}
          </div>
        </div>
      </div>

      {!isCorrectNetwork && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              يرجى التبديل إلى Polygon Mumbai Testnet للمتابعة
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
