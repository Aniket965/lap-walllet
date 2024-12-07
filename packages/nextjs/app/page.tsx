"use client";
import React from 'react';
import { Send, Download, CreditCard, Scan } from 'lucide-react';
import { useAccount, useSignMessage,  } from "wagmi";
import {wagmiConfig} from "~~/services/web3/wagmiConfig";
import { encodePacked, keccak256 } from 'viem';
import {toast} from 'react-hot-toast';
import localFont from '@next/font/local';
import { Switch } from '~~/schdn/components/ui/switch';

const matter = localFont({
  src: [
    {
      path: '../public/matter-font/Matter-Regular.otf',
      weight: '400'
    },
    {
      path: '../public/matter-font/Matter-Bold.otf',
      weight: '700'
    }
  ],
  variable: '--font-matter'
})

const WalletCard = () => {
  const { address: connectedAddress } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const handle_sign_message = (checked) => {
    if(!checked) return
    if(!connectedAddress) return
    signMessageAsync({
      account: connectedAddress,
      message: keccak256(encodePacked(['address'], [connectedAddress])),
    }, {
      onSuccess(data, variables, context) {
        console.log({data}, 'animoji success');
        console.log({variables}, 'animoji success');
        console.log({context}, 'animoji success');
      },
      onSettled(data, error, variables, context) {
        post_data(connectedAddress, connectedAddress, '1000', '0x6b175474e89094c44da98b954eedeac495271d0f', data, wagmiConfig.chainId);
      },
    })
  
    const post_data = (userAddress: string, walletAddress: string, amount: string, tokenAddress : string, userSignature: string, chainId: number) => {
      fetch('http://localhost:6969/add-liqudity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress,
          walletAddress,
          amount,
          tokenAddress,
          userSignature,
          chainId
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

    const get_user_data = (userAddress: string) => {
      fetch(`http://localhost:6969/get-liquidity?userAddress=${userAddress}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

    const get_all_data = () => {
      fetch(`http://localhost:6969/all-liquidity`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    
  }
  const data = [
    { token: 'ETHEREUM', amount: 1000, value: '0.79%', img: 'https://media.socket.tech/tokens/all/ETH' },
    { token: 'USDC', amount: 1000, value: '0.79%', img: 'https://media.socket.tech/tokens/all/USDC' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span className={`${matter.variable} font-sans`} style={styles.title}>aniket.eth</span>
          <div style={styles.walletContainer}>
            <span className={`${matter.variable} font-sans`} style={styles.wallet} title={connectedAddress}>
              {connectedAddress?.slice(0,6)}...{connectedAddress?.slice(-4)}
            </span>
            <button 
              style={styles.copyButton}
              onClick={() => {
                navigator.clipboard.writeText(connectedAddress || '');
                toast.success('Address copied to clipboard');
              }}
              title="Copy address"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
        </div>
        <div style={styles.balance}>
          <h1 className={`unbounded-text font-sans`} style={styles.balanceText}>$2000</h1>
        </div>
        <div style={styles.icons}>
          <div style={styles.iconWrapper}>
            <Scan size={24} />
            <span className={`${matter.variable} font-sans`} style={styles.iconLabel}>Scan</span>
          </div>
          <div style={styles.iconWrapper}>
            <Send size={24} />
            <span className={`${matter.variable} font-sans`} style={styles.iconLabel}>Send</span>
          </div>
          <div style={styles.iconWrapper}>
            <Download size={24} />
            <span className={`${matter.variable} font-sans`} style={styles.iconLabel}>Receive</span>
          </div>
          <div style={styles.iconWrapper}>
            <CreditCard size={24} />
            <span className={`${matter.variable} font-sans`} style={styles.iconLabel}>Buy</span>
          </div>
        </div>
        <div style={styles.toggle}>
          <span className={`${matter.variable} font-sans`}>Smart Invest</span>
          <Switch onCheckedChange={handle_sign_message}/>
        </div>
        <div style={styles.tabs}>
          <span className={`${matter.variable} font-sans`} style={styles.tabActive}>Tokens</span>
          <span className={`${matter.variable} font-sans`} style={styles.tab}>Activity</span>
        </div>
        <div style={styles.tokenList}>
          {data.map((item, index) => (
            <div key={index} style={styles.tokenRow}>
              <div style={styles.tokenInfo}>
                <div style={styles.tokenIcon}><img src={item.img}></img></div>
                <div>
                  <p className={`${matter.variable} font-sans`} style={styles.tokenName}>{item.token}</p>
                  <p className={`${matter.variable} font-sans`} style={styles.tokenAmount}>{item.amount} USDC</p>
                </div>
              </div>
              <div style={styles.tokenValue}>
                <p style={styles.tokenPrice}>${item.amount}</p>
                <p style={styles.tokenPercentage}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '85vh',
    backgroundColor: '#f0f2f5',
    padding: '20px',
    overflow: 'hidden'
  },
  card: {
    width: '380px',
    height: '100%',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    fontFamily: 'Inter, sans-serif',
    overflowY: 'auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  title: { 
    fontWeight: '700',
    fontSize: '1.4em',
    color: '#1a1a1a'
  },
  walletContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  wallet: { 
    fontSize: '0.9em',
    color: '#666',
    backgroundColor: '#f5f5f5',
    padding: '4px 8px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  copyButton: {
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    ':hover': {
      backgroundColor: '#f5f5f5'
    }
  },
  balance: { 
    textAlign: 'center' as const,
    margin: '20px 0'
  },
  balanceText: {
    margin: 0,
    fontSize: '2.5em',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  icons: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
  },
  iconWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  iconLabel: {
    fontSize: '0.8em',
    color: '#666',
  },
  toggle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    padding: '12px 16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    fontWeight: '600',
  },
  checkbox: {
    width: '20px',
    height: '20px',
  },
  tabs: {
    display: 'flex',
    gap: '20px',
    borderBottom: '2px solid #eee',
    marginBottom: '15px',
    paddingBottom: '10px',
  },
  tab: {
    color: '#666',
    cursor: 'pointer',
    padding: '8px 4px',
  },
  tabActive: { 
    fontWeight: '600',
    color: '#1a1a1a',
    borderBottom: '2px solid #1a1a1a',
    paddingBottom: '8px',
  },
  tokenList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    overflow: 'auto'
  },
  tokenRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    ':hover': {
      transform: 'scale(1.02)',
    },
  },
  tokenInfo: { 
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  tokenIcon: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: '50%',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  tokenName: {
    margin: 0,
    fontWeight: '600',
    fontSize: '1em',
    color: '#1a1a1a',
  },
  tokenAmount: {
    margin: '4px 0 0 0',
    fontSize: '0.9em',
    color: '#666',
  },
  tokenValue: {
    textAlign: 'right' as const,
  },
  tokenPrice: {
    margin: 0,
    fontWeight: '600',
    fontSize: '1.1em',
    color: '#1a1a1a',
  },
  tokenPercentage: {
    margin: '4px 0 0 0',
    fontSize: '0.9em',
    color: '#22c55e',
    fontWeight: '500',
  },
};

export default WalletCard;
