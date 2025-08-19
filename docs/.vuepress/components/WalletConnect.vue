<template>
  <div class="wc-card">
    <template v-if="!state.hasProvider">
      <div class="wc-row">
        <span class="wc-badge warn">{{ t.notFound }}</span>
      </div>
      <div class="wc-row">
        <a class="wc-btn primary" href="https://metamask.io/download/" target="_blank" rel="noopener">
          {{ t.install }}
        </a>
      </div>
    </template>

    <template v-else>
      <div class="wc-header">
        <div class="wc-title">Web3 Wallet</div>
        <div class="wc-actions">
          <button v-if="!state.connected" class="wc-btn primary" @click="connect">{{ t.connect }}</button>
          <button v-else class="wc-btn" @click="disconnect">{{ t.disconnect }}</button>
        </div>
      </div>

      <div v-if="state.connected" class="wc-body">
        <div class="wc-row">
          <span class="wc-label">{{ t.account }}</span>
          <span class="wc-val mono">{{ shortAddress }}</span>
          <button class="wc-btn sm" @click="copyAddress">{{ t.copy }}</button>
          <span v-if="copied" class="wc-tip">{{ t.copied }}</span>
        </div>
        <div class="wc-row">
          <span class="wc-label">{{ t.network }}</span>
          <span class="wc-val">{{ chainReadable }}</span>
        </div>
        <div class="wc-row">
          <span class="wc-label">{{ t.balance }}</span>
          <span class="wc-val mono">{{ state.balanceEth || '—' }}</span>
          <button class="wc-btn sm" @click="refreshBalance">{{ t.refresh }}</button>
        </div>
      </div>

      <div v-if="state.error" class="wc-error mono">
        {{ state.error }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount, computed, ref } from 'vue'

type EthLike = {
  request: (args: { method: string; params?: any[] }) => Promise<any>
  on?: (event: string, cb: (...args: any[]) => void) => void
  removeListener?: (event: string, cb: (...args: any[]) => void) => void
}

const state = reactive({
  hasProvider: false,
  connected: false,
  account: '',
  chainId: '',
  balanceEth: '',
  error: '',
})

const copied = ref(false)

const t = computed(() => {
  const lang = (typeof document !== 'undefined' ? document.documentElement.lang : 'zh-CN') || 'zh-CN'
  if (lang.toLowerCase().startsWith('en')) {
    return {
      connect: 'Connect Wallet',
      disconnect: 'Disconnect',
      install: 'Install MetaMask',
      account: 'Account',
      network: 'Network',
      balance: 'Balance',
      copy: 'Copy',
      copied: 'Copied',
      refresh: 'Refresh',
      notFound: 'No Ethereum wallet detected',
    }
  }
  return {
    connect: '连接钱包',
    disconnect: '断开',
    install: '安装 MetaMask',
    account: '账户',
    network: '网络',
    balance: '余额',
    copy: '复制地址',
    copied: '已复制',
    refresh: '刷新',
    notFound: '未检测到以太坊钱包',
  }
})

let ethereum: EthLike | undefined

const shortAddress = computed(() => (state.account ? `${state.account.slice(0, 6)}...${state.account.slice(-4)}` : ''))
const chainReadable = computed(() => chainName(state.chainId))

function chainName(hexId: string): string {
  const map: Record<string, string> = {
    '0x1': 'Ethereum',
    '0xaa36a7': 'Sepolia',
    '0x5': 'Goerli',
    '0x89': 'Polygon',
    '0x38': 'BSC',
    '0xa86a': 'Avalanche C-Chain',
    '0x2105': 'Base',
    '0x64': 'Gnosis',
  }
  return map[hexId] || hexId
}

function weiHexToEthString(hex: string): string {
  try {
    const wei = BigInt(hex)
    const ether = wei / BigInt(1e18)
    const frac = (wei % BigInt(1e18)).toString().padStart(18, '0').slice(0, 4)
    return `${ether}.${frac} ETH`
  } catch {
    return '0 ETH'
  }
}

async function refreshBalance() {
  if (!ethereum || !state.account) return
  try {
    const bal = await ethereum.request({ method: 'eth_getBalance', params: [state.account, 'latest'] })
    state.balanceEth = weiHexToEthString(bal)
  } catch (e: any) {
    state.error = e?.message || String(e)
  }
}

async function connect() {
  state.error = ''
  if (!ethereum) {
    window.open('https://metamask.io/download/', '_blank')
    return
  }
  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    state.account = accounts?.[0] || ''
    state.connected = !!state.account
    state.chainId = await ethereum.request({ method: 'eth_chainId' })
    await refreshBalance()
  } catch (e: any) {
    state.error = e?.message || String(e)
  }
}

function disconnect() {
  // 无法从 DApp 主动断开注入钱包，仅清理本地状态
  state.connected = false
  state.account = ''
  state.balanceEth = ''
  state.error = ''
}

function handleAccountsChanged(accs: string[]) {
  if (!accs || accs.length === 0) {
    disconnect()
  } else {
    state.account = accs[0]
    state.connected = true
    refreshBalance()
  }
}

function handleChainChanged(cid: string) {
  state.chainId = cid
  refreshBalance()
}

async function copyAddress() {
  if (!state.account) return
  try {
    await navigator.clipboard?.writeText(state.account)
    copied.value = true
    setTimeout(() => (copied.value = false), 1200)
  } catch (e) {
    // ignore
  }
}

onMounted(async () => {
  ethereum = (window as any).ethereum as EthLike
  state.hasProvider = !!ethereum

  if (ethereum?.on) {
    ethereum.on('accountsChanged', handleAccountsChanged)
    ethereum.on('chainChanged', handleChainChanged)
  }

  // 尝试静默恢复
  try {
    if (ethereum) {
      const accs = await ethereum.request({ method: 'eth_accounts' })
      if (accs && accs[0]) {
        state.account = accs[0]
        state.connected = true
        state.chainId = await ethereum.request({ method: 'eth_chainId' })
        await refreshBalance()
      }
    }
  } catch {
    // ignore
  }
})

onBeforeUnmount(() => {
  if (ethereum?.removeListener) {
    ethereum.removeListener('accountsChanged', handleAccountsChanged)
    ethereum.removeListener('chainChanged', handleChainChanged)
  }
})
</script>

<style scoped>
.wc-card {
  border: 1px solid var(--vp-c-divider, #e5e7eb);
  border-radius: 12px;
  padding: 14px;
  background: var(--vp-c-bg, #fff);
}
.wc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.wc-title {
  font-weight: 600;
  font-size: 16px;
}
.wc-actions {
  display: flex;
  gap: 8px;
}
.wc-body {
  margin-top: 10px;
  display: grid;
  gap: 8px;
}
.wc-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.wc-label {
  min-width: 56px;
  color: var(--vp-c-text-2, #6b7280);
}
.wc-val {
  font-weight: 500;
}
.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
}
.wc-btn {
  border: 1px solid var(--vp-c-divider, #e5e7eb);
  background: var(--vp-c-bg-soft, #f8fafc);
  color: var(--vp-c-text-1, #111827);
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all .15s ease;
}
.wc-btn:hover { filter: brightness(0.98); }
.wc-btn.primary {
  background: var(--vp-c-brand, #3b82f6);
  color: #fff;
  border-color: var(--vp-c-brand, #3b82f6);
}
.wc-btn.sm { padding: 4px 8px; font-size: 12px; }
.wc-badge.warn {
  background: #fff7ed;
  color: #c2410c;
  border: 1px solid #fdba74;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
}
.wc-error {
  margin-top: 12px;
  color: #b91c1c;
  font-size: 12px;
  word-break: break-all;
}
.wc-tip {
  color: var(--vp-c-text-2, #6b7280);
  font-size: 12px;
}
</style>