---
title: Web3 Wallet Connect
permalink: /en/web3/
---

# Web3 Wallet Connect

This page demonstrates basic Web3.0 features in a static site: detect wallet, connect account, read current network and balance, and listen to account/network changes.

Requirements:
- MetaMask (or any EIP-1193 compatible wallet) installed
- Works on GitHub Pages (pure client-side)

Component:

<WalletConnect />

Notes:
- The wallet will prompt for permission on first connect
- Balance is read via `eth_getBalance` and shown in ETH
- A DApp cannot truly "disconnect" an injected wallet; we only clear local state