/**
 * OPfun — OP_20 Token Template for Bitcoin L1 (OP_NET)
 *
 * This is the deployable smart contract template that OPfun uses
 * to launch custom OP_20 tokens on Bitcoin L1 via the OP_NET runtime.
 *
 * Framework: @btc-vision/op-20
 * Standard: OP_20 (ERC-20 equivalent for Bitcoin)
 * Runtime: OP_NET (Bitcoin L1 smart contract layer)
 */

import {
  Address,
  Blockchain,
  BytesWriter,
  Calldata,
  encodeSelector,
  Map,
  OP_20,
  Selector,
  u256,
} from '@btc-vision/op-20'

@final
export class SatForgeToken extends OP_20 {
  // ── Token metadata (set during deployment via constructor calldata) ──
  private _name: string = 'OPfun Token'
  private _symbol: string = 'OPFUN'
  private _decimals: u8 = 18
  private _maxSupply: u256 = u256.fromU64(1_000_000) * (u256.fromU64(10) ** u256.fromU64(18))

  // ── Storage maps ──
  private _balances: Map<Address, u256> = new Map<Address, u256>()
  private _allowances: Map<Address, Map<Address, u256>> = new Map<Address, Map<Address, u256>>()
  private _totalSupply: u256 = u256.Zero

  constructor() {
    super()

    // Read deployment parameters from calldata
    const calldata = Blockchain.getCalldata()
    if (calldata.length >= 3) {
      this._name = calldata.readStringWithLength()
      this._symbol = calldata.readStringWithLength()
      const supplyRaw = calldata.readU256()
      this._maxSupply = supplyRaw * (u256.fromU64(10) ** u256.fromU64(this._decimals))
    }

    // Mint entire supply to deployer on construction
    this._mint(Blockchain.tx.sender, this._maxSupply)
  }

  // ══════════════════════════════════════════════════════════
  //  OP_20 Standard — View Functions
  // ══════════════════════════════════════════════════════════

  /** Returns the token name */
  public name(): string {
    return this._name
  }

  /** Returns the token symbol/ticker */
  public symbol(): string {
    return this._symbol
  }

  /** Returns the number of decimals */
  public decimals(): u8 {
    return this._decimals
  }

  /** Returns the total supply of tokens in circulation */
  public totalSupply(): u256 {
    return this._totalSupply
  }

  /** Returns the balance of the given address */
  public balanceOf(owner: Address): u256 {
    if (this._balances.has(owner)) {
      return this._balances.get(owner)
    }
    return u256.Zero
  }

  /** Returns the allowance granted by `owner` to `spender` */
  public allowance(owner: Address, spender: Address): u256 {
    if (this._allowances.has(owner)) {
      const ownerAllowances = this._allowances.get(owner)
      if (ownerAllowances.has(spender)) {
        return ownerAllowances.get(spender)
      }
    }
    return u256.Zero
  }

  // ══════════════════════════════════════════════════════════
  //  OP_20 Standard — State-Changing Functions
  // ══════════════════════════════════════════════════════════

  /**
   * Transfer tokens from caller to `recipient`.
   * @param recipient - The address receiving tokens
   * @param amount    - The amount of tokens to send
   * @returns true on success
   */
  public transfer(recipient: Address, amount: u256): bool {
    const sender = Blockchain.tx.sender

    assert(recipient != Address.zero(), 'OP20: transfer to zero address')
    assert(this.balanceOf(sender) >= amount, 'OP20: insufficient balance')

    this._balances.set(sender, this.balanceOf(sender) - amount)
    this._balances.set(recipient, this.balanceOf(recipient) + amount)

    this.emitTransferEvent(sender, recipient, amount)
    return true
  }

  /**
   * Approve `spender` to spend up to `amount` of caller's tokens.
   */
  public approve(spender: Address, amount: u256): bool {
    const owner = Blockchain.tx.sender

    assert(spender != Address.zero(), 'OP20: approve to zero address')

    if (!this._allowances.has(owner)) {
      this._allowances.set(owner, new Map<Address, u256>())
    }
    this._allowances.get(owner).set(spender, amount)

    this.emitApprovalEvent(owner, spender, amount)
    return true
  }

  /**
   * Transfer tokens on behalf of `sender` using an allowance.
   */
  public transferFrom(sender: Address, recipient: Address, amount: u256): bool {
    assert(recipient != Address.zero(), 'OP20: transfer to zero address')
    assert(this.balanceOf(sender) >= amount, 'OP20: insufficient balance')

    const currentAllowance = this.allowance(sender, Blockchain.tx.sender)
    assert(currentAllowance >= amount, 'OP20: allowance exceeded')

    // Deduct allowance
    this._allowances.get(sender).set(Blockchain.tx.sender, currentAllowance - amount)

    // Move tokens
    this._balances.set(sender, this.balanceOf(sender) - amount)
    this._balances.set(recipient, this.balanceOf(recipient) + amount)

    this.emitTransferEvent(sender, recipient, amount)
    return true
  }

  // ══════════════════════════════════════════════════════════
  //  Internal Helpers
  // ══════════════════════════════════════════════════════════

  /** Mint tokens to an address (internal only) */
  private _mint(to: Address, amount: u256): void {
    assert(to != Address.zero(), 'OP20: mint to zero address')

    this._totalSupply = this._totalSupply + amount
    this._balances.set(to, this.balanceOf(to) + amount)

    this.emitTransferEvent(Address.zero(), to, amount)
  }

  // ── Events (OP_NET event emitters) ──

  private emitTransferEvent(from: Address, to: Address, amount: u256): void {
    const writer = new BytesWriter(96)
    writer.writeAddress(from)
    writer.writeAddress(to)
    writer.writeU256(amount)
    this.emitEvent('Transfer', writer.getBuffer())
  }

  private emitApprovalEvent(owner: Address, spender: Address, amount: u256): void {
    const writer = new BytesWriter(96)
    writer.writeAddress(owner)
    writer.writeAddress(spender)
    writer.writeU256(amount)
    this.emitEvent('Approval', writer.getBuffer())
  }

  // ══════════════════════════════════════════════════════════
  //  OP_NET Selector Router
  // ══════════════════════════════════════════════════════════

  public callMethod(selector: Selector, calldata: Calldata): BytesWriter {
    switch (selector) {
      case encodeSelector('name'):
        return this._encodeName()
      case encodeSelector('symbol'):
        return this._encodeSymbol()
      case encodeSelector('decimals'):
        return this._encodeDecimals()
      case encodeSelector('totalSupply'):
        return this._encodeTotalSupply()
      case encodeSelector('balanceOf'):
        return this._encodeBalanceOf(calldata)
      case encodeSelector('transfer'):
        return this._encodeTransfer(calldata)
      case encodeSelector('approve'):
        return this._encodeApprove(calldata)
      case encodeSelector('transferFrom'):
        return this._encodeTransferFrom(calldata)
      case encodeSelector('allowance'):
        return this._encodeAllowance(calldata)
      default:
        return super.callMethod(selector, calldata)
    }
  }

  // ── ABI Encoders ──

  private _encodeName(): BytesWriter {
    const writer = new BytesWriter(64)
    writer.writeStringWithLength(this._name)
    return writer
  }

  private _encodeSymbol(): BytesWriter {
    const writer = new BytesWriter(64)
    writer.writeStringWithLength(this._symbol)
    return writer
  }

  private _encodeDecimals(): BytesWriter {
    const writer = new BytesWriter(1)
    writer.writeU8(this._decimals)
    return writer
  }

  private _encodeTotalSupply(): BytesWriter {
    const writer = new BytesWriter(32)
    writer.writeU256(this._totalSupply)
    return writer
  }

  private _encodeBalanceOf(calldata: Calldata): BytesWriter {
    const owner = calldata.readAddress()
    const writer = new BytesWriter(32)
    writer.writeU256(this.balanceOf(owner))
    return writer
  }

  private _encodeTransfer(calldata: Calldata): BytesWriter {
    const to = calldata.readAddress()
    const amount = calldata.readU256()
    const success = this.transfer(to, amount)
    const writer = new BytesWriter(1)
    writer.writeBool(success)
    return writer
  }

  private _encodeApprove(calldata: Calldata): BytesWriter {
    const spender = calldata.readAddress()
    const amount = calldata.readU256()
    const success = this.approve(spender, amount)
    const writer = new BytesWriter(1)
    writer.writeBool(success)
    return writer
  }

  private _encodeTransferFrom(calldata: Calldata): BytesWriter {
    const from = calldata.readAddress()
    const to = calldata.readAddress()
    const amount = calldata.readU256()
    const success = this.transferFrom(from, to, amount)
    const writer = new BytesWriter(1)
    writer.writeBool(success)
    return writer
  }

  private _encodeAllowance(calldata: Calldata): BytesWriter {
    const owner = calldata.readAddress()
    const spender = calldata.readAddress()
    const writer = new BytesWriter(32)
    writer.writeU256(this.allowance(owner, spender))
    return writer
  }
}
