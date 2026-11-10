window.__ModuleLoader__.load({
  id: '@local/dsh-balance-ui',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    /** Locale namespace owned by this bundle. */
    const NS = 'dsh.balance';

    /** Same-origin channel used to fan a manual refresh out to other tabs/windows. */
    const BALANCE_CHANNEL = 'dsh-balance-ui:account-balance:v1';

    /** Estimated DeepSeek CNY rates per one million tokens. */
    const RATES = {
      input: 2.0,
      cacheHit: 0.2,
      output: 3.0,
    };

    const EN = {
      sessionCost: 'This session',
      sessionCostDialog: 'Session spend',
      inputTokens: 'Input tokens',
      outputTokens: 'Output tokens',
      cacheHit: 'Cache hit',
      cacheSaved: 'Cache saved',
      costNote: 'Estimated with the current model rates; actual billing may differ.',
      openCostDetails: 'Open spend details',
      accountBalance: 'Balance',
      rechargeBalance: 'Recharge',
      bonusBalance: 'Bonus',
      refreshBalance: 'Refresh balance',
      refreshing: 'Refreshing…',
      refreshFailed: 'Refresh failed; click to retry',
      balanceLoading: '…',
      balanceUnavailable: '--',
    };

    const ZH = {
      sessionCost: '本次会话',
      sessionCostDialog: '本次会话消耗',
      inputTokens: '输入 Token',
      outputTokens: '输出 Token',
      cacheHit: '缓存命中',
      cacheSaved: '缓存节省',
      costNote: '按当前模型价格估算，实际以账单为准。',
      openCostDetails: '查看消耗明细',
      accountBalance: '余额',
      rechargeBalance: '充值',
      bonusBalance: '赠送',
      refreshBalance: '刷新余额',
      refreshing: '刷新中…',
      refreshFailed: '刷新失败，点击重试',
      balanceLoading: '…',
      balanceUnavailable: '--',
    };

    const CSS = `
      .dsh-bal-cost-wrap { position: relative; display: inline-flex; min-width: 0; }
      .dsh-bal-cost {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        box-sizing: border-box;
        max-width: 100%;
        margin: 0;
        padding: 1px 8px;
        border: 0;
        border-radius: 8px;
        background: transparent;
        color: var(--dsw-alias-label-tertiary);
        font: inherit;
        font-size: 13px;
        line-height: 20px;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        cursor: pointer;
        transition: background-color .16s cubic-bezier(.4, 0, .2, 1), color .16s cubic-bezier(.4, 0, .2, 1);
      }
      .dsh-bal-cost:hover,
      .dsh-bal-cost.is-open { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-secondary); }
      .dsh-bal-cost:focus-visible {
        outline: 2px solid color-mix(in srgb, var(--dsw-alias-brand-primary-new-colorprimary-new-color) 48%, transparent);
        outline-offset: 2px;
      }
      .dsh-bal-cost svg { width: 14px; height: 14px; flex: none; }
      .dsh-bal-cost-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
      .dsh-bal-cost-value { color: var(--dsw-alias-label-secondary); font-weight: 500; }
      .dsh-bal-panel {
        position: absolute;
        bottom: calc(100% + 10px);
        left: 0;
        z-index: 60;
        box-sizing: border-box;
        width: 302px;
        max-width: calc(100vw - 24px);
        padding: 15px 16px 14px;
        border-radius: 16px;
        background: var(--dsw-specific-menu, var(--dsw-alias-bg-overlay));
        box-shadow: var(--dsw-elevation-prominent, 0 0 0 .5px var(--dsw-alias-border-l2), 0 12px 32px rgba(0, 0, 0, .12));
        backdrop-filter: blur(40px) saturate(150%);
        color: var(--dsw-alias-label-secondary);
        font-size: 12px;
        line-height: 18px;
        cursor: default;
        animation: dsh-bal-panel-in .16s cubic-bezier(.4, 0, .2, 1);
      }
      .dsh-bal-panel::after {
        content: "";
        position: absolute;
        bottom: -5px;
        left: 24px;
        width: 9px;
        height: 9px;
        border-radius: 1px;
        background: var(--dsw-specific-menu, var(--dsw-alias-bg-overlay));
        transform: rotate(45deg);
      }
      .dsh-bal-panel-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        color: var(--dsw-alias-label-primary);
        font-weight: 500;
      }
      .dsh-bal-panel-title { display: inline-flex; align-items: center; gap: 6px; min-width: 0; }
      .dsh-bal-panel-title svg { width: 14px; height: 14px; flex: none; color: var(--dsw-alias-label-tertiary); }
      .dsh-bal-panel-total { flex: none; font-variant-numeric: tabular-nums; }
      .dsh-bal-panel-rule { margin: 9px 0 10px; border-top: .5px solid var(--dsw-alias-border-l2); }
      .dsh-bal-panel-list {
        display: grid;
        grid-template-columns: minmax(72px, auto) minmax(0, 1fr);
        gap: 6px 16px;
        margin: 0;
        color: var(--dsw-alias-label-tertiary);
      }
      .dsh-bal-panel-list dt,
      .dsh-bal-panel-list dd { min-width: 0; margin: 0; }
      .dsh-bal-panel-list dd {
        color: var(--dsw-alias-label-secondary);
        font-variant-numeric: tabular-nums;
        text-align: right;
      }
      .dsh-bal-panel-note {
        margin-top: 11px;
        color: var(--dsw-alias-label-caption);
        font-size: 11px;
        line-height: 16px;
      }
      @keyframes dsh-bal-panel-in {
        from { opacity: 0; transform: translateY(4px) scale(.985); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      .dsh-bal-account {
        display: flex;
        align-items: center;
        gap: 5px;
        box-sizing: border-box;
        flex: 1 1 auto;
        min-width: 0;
        height: 26px;
        margin: 0 0 2px;
        padding: 0 4px 0 38px;
        color: var(--dsw-alias-label-tertiary);
        font-size: 11px;
        line-height: 16px;
      }
      .dsh-bal-label { flex: none; color: var(--dsw-alias-label-tertiary); }
      .dsh-bal-amount {
        min-width: 0;
        overflow: hidden;
        color: var(--dsw-alias-label-secondary);
        font-size: 13px;
        font-weight: 500;
        line-height: 16px;
        font-variant-numeric: tabular-nums;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dsh-bal-fresh {
        width: 5px;
        height: 5px;
        flex: none;
        border-radius: 50%;
        background: var(--dsw-alias-state-success-primary);
        opacity: 0;
        transform: scale(.45);
        transition: opacity .18s cubic-bezier(.4, 0, .2, 1), transform .24s cubic-bezier(.4, 0, .2, 1);
      }
      .dsh-bal-fresh.is-on { opacity: 1; transform: scale(1); }
      .dsh-bal-refresh {
        display: grid;
        place-items: center;
        width: 24px;
        height: 24px;
        flex: none;
        margin-left: auto;
        padding: 0;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: var(--dsw-alias-label-tertiary);
        cursor: pointer;
        transition: background-color .16s cubic-bezier(.4, 0, .2, 1), color .16s cubic-bezier(.4, 0, .2, 1);
      }
      .dsh-bal-refresh svg { width: 14px; height: 14px; }
      .dsh-bal-refresh:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-secondary); }
      .dsh-bal-refresh:focus-visible { outline: 2px solid color-mix(in srgb, var(--dsw-alias-brand-primary-new-colorprimary-new-color) 48%, transparent); outline-offset: 2px; }
      .dsh-bal-refresh:disabled { cursor: progress; }
      .dsh-bal-refresh.is-busy svg { animation: dsh-bal-spin .8s linear infinite; }
      @keyframes dsh-bal-spin { to { transform: rotate(360deg); } }
      @media (prefers-reduced-motion: reduce) {
        .dsh-bal-refresh.is-busy svg { animation: none; opacity: .5; }
        .dsh-bal-fresh { transition: none; }
        .dsh-bal-panel { animation: none; }
      }
    `;

    /** Wallet arrow used by both surfaces. */
    function RefreshIcon() {
      return h('svg', {
        viewBox: '0 0 16 16',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.4,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
      },
      h('path', { d: 'M14.5 8a6.5 6.5 0 1 1-1.9-4.6' }),
      h('path', { d: 'M14.5 2.5V6H11' }));
    }

    /** Yen-in-circle glyph for the session estimate. */
    function WalletYenIcon() {
      return h('svg', {
        viewBox: '0 0 16 16',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.4,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
      },
      h('circle', { cx: 8, cy: 8, r: 6.4 }),
      h('path', { d: 'M5.4 5.2 8 8.4l2.6-3.2M8 8.4V13M5.6 9.8h4.8M5.6 11.4h4.8' }));
    }

    /** Integer token formatting with grouping. */
    function formatInt(value) {
      const number = Number(value);
      return Number.isFinite(number) ? number.toLocaleString('zh-CN') : '0';
    }

    /** Adaptive CNY display: larger values need fewer decimals. */
    function formatCost(value) {
      if (!Number.isFinite(value) || value <= 0) return '¥0.00';
      if (value >= 1) return '¥' + value.toFixed(2);
      if (value >= 0.01) return '¥' + value.toFixed(3);
      return '¥' + value.toFixed(4);
    }

    /** Sum the four provider-reported usage buckets into an estimate. */
    function estimateCost(usage) {
      const uncached = Number(usage.uncachedInputTokens) || 0;
      const cacheRead = Number(usage.cacheReadTokens) || 0;
      const cacheWrite = Number(usage.cacheWriteTokens) || 0;
      const output = Number(usage.outputTokens) || 0;
      return (uncached * RATES.input
        + cacheRead * RATES.cacheHit
        + cacheWrite * RATES.input
        + output * RATES.output) / 1_000_000;
    }

    /** Total provider-reported tokens, used only to decide whether to render. */
    function totalTokens(usage) {
      return (Number(usage.uncachedInputTokens) || 0)
        + (Number(usage.cacheReadTokens) || 0)
        + (Number(usage.cacheWriteTokens) || 0)
        + (Number(usage.outputTokens) || 0);
    }

    /** Share of prompt-side tokens served from the provider cache. */
    function cacheHitPercent(usage) {
      const input = (Number(usage.uncachedInputTokens) || 0)
        + (Number(usage.cacheReadTokens) || 0)
        + (Number(usage.cacheWriteTokens) || 0);
      return input > 0 ? Math.round(((Number(usage.cacheReadTokens) || 0) / input) * 100) : 0;
    }

    /** Money not charged because cache hits replace full-price input. */
    function cacheSavings(usage) {
      return ((Number(usage.cacheReadTokens) || 0) * (RATES.input - RATES.cacheHit)) / 1_000_000;
    }

    /** Integer token count with the unit used by the detail panel. */
    function tokenText(value) {
      return formatInt(value) + ' tok';
    }

    /** Currency text for one wallet, preserving server precision when non-numeric. */
    function walletText(wallet) {
      const symbol = wallet.currency === 'CNY' ? '¥' : wallet.currency === 'USD' ? '$' : wallet.currency + ' ';
      const number = Number(wallet.balance);
      return symbol + (Number.isFinite(number)
        ? number.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : wallet.balance);
    }

    /** Sum recharge and bonus wallets per currency. */
    function combinedWallets(details) {
      if (!details || details.status !== 'ready') return [];
      const totals = new Map();
      const add = (wallets) => {
        if (!Array.isArray(wallets)) return;
        for (const wallet of wallets) {
          const number = Number(wallet.balance);
          if (!Number.isFinite(number)) continue;
          totals.set(wallet.currency, (totals.get(wallet.currency) || 0) + number);
        }
      };
      add(details.value);
      add(details.bonusWallets);
      return [...totals.entries()].map(([currency, balance]) => ({ currency, balance: String(balance) }));
    }

    /** Primary combined CNY wallet, falling back to the first available currency. */
    function primaryWallet(details) {
      const wallets = combinedWallets(details);
      return wallets.find((wallet) => wallet.currency === 'CNY') || wallets[0] || null;
    }

    /** Compose the hover text for a ready balance, keeping recharge and bonus separate. */
    function balanceDetail(details, t) {
      if (!details || details.status !== 'ready') return '';
      const recharge = Array.isArray(details.value) ? details.value : [];
      const bonus = Array.isArray(details.bonusWallets)
        ? details.bonusWallets.filter((wallet) => Number(wallet.balance) > 0)
        : [];
      const parts = [];
      if (recharge.length > 0) parts.push(t('rechargeBalance') + ' ' + recharge.map(walletText).join(' · '));
      if (bonus.length > 0) parts.push(t('bonusBalance') + ' ' + bonus.map(walletText).join(' · '));
      return parts.join(' · ');
    }

    /** Composer statistics entry: session-level spend estimate with its detail card. */
    function SessionCost({ useProjection, t }) {
      const [open, setOpen] = React.useState(false);
      const rootRef = React.useRef(null);
      const panelId = React.useId();
      const usage = useProjection('tokenUsage');

      React.useEffect(() => {
        if (!open) return undefined;
        const onPointerDown = (event) => {
          if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
        };
        const onKeyDown = (event) => {
          if (event.key === 'Escape') setOpen(false);
        };
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
          document.removeEventListener('pointerdown', onPointerDown);
          document.removeEventListener('keydown', onKeyDown);
        };
      }, [open]);

      if (!usage || totalTokens(usage) <= 0) return null;
      const cost = estimateCost(usage);
      const percent = cacheHitPercent(usage);
      const saved = cacheSavings(usage);
      const buttonLabel = t('sessionCost') + ' ' + formatCost(cost);

      return h(React.Fragment, null,
        h('style', null, CSS),
        h('span', { ref: rootRef, className: 'dsh-bal-cost-wrap' },
          h('button', {
            type: 'button',
            className: 'dsh-bal-cost' + (open ? ' is-open' : ''),
            'data-composer-stat': 'session-cost',
            'aria-haspopup': 'dialog',
            'aria-expanded': open,
            'aria-controls': panelId,
            'aria-label': buttonLabel + '. ' + t('openCostDetails'),
            onClick: (event) => {
              event.stopPropagation();
              setOpen((value) => !value);
            },
          },
          h(WalletYenIcon),
          h('span', { className: 'dsh-bal-cost-label' }, t('sessionCost')),
          h('strong', { className: 'dsh-bal-cost-value' }, formatCost(cost))),
          open && h('div', {
            id: panelId,
            className: 'dsh-bal-panel',
            role: 'dialog',
            'aria-label': t('sessionCostDialog'),
          },
          h('div', { className: 'dsh-bal-panel-head' },
            h('span', { className: 'dsh-bal-panel-title' }, h(WalletYenIcon), t('sessionCostDialog')),
            h('span', { className: 'dsh-bal-panel-total' }, formatCost(cost))),
          h('div', { className: 'dsh-bal-panel-rule', 'aria-hidden': true }),
          h('dl', { className: 'dsh-bal-panel-list' },
            h('dt', null, t('inputTokens')),
            h('dd', null, tokenText(usage.uncachedInputTokens)),
            h('dt', null, t('outputTokens')),
            h('dd', null, tokenText(usage.outputTokens)),
            h('dt', null, t('cacheHit')),
            h('dd', null, percent + '%'),
            h('dt', null, t('cacheSaved')),
            h('dd', null, formatCost(saved))),
          h('div', { className: 'dsh-bal-panel-note' }, t('costNote')))));
    }

    /** Sidebar footer entry: account balance plus a refresh action. */
    function AccountBalance({ wide, t, fetchBalance }) {
      const [details, setDetails] = React.useState(undefined);
      const [busy, setBusy] = React.useState(true);
      const [failed, setFailed] = React.useState(false);
      const [fresh, setFresh] = React.useState(false);
      const alive = React.useRef(true);
      const busyRef = React.useRef(false);
      const freshTimer = React.useRef(0);
      const channelRef = React.useRef(null);
      const remoteStamp = React.useRef(0);

      const flashFresh = React.useCallback(() => {
        window.clearTimeout(freshTimer.current);
        setFresh(true);
        freshTimer.current = window.setTimeout(() => {
          if (alive.current) setFresh(false);
        }, 1500);
      }, []);

      const load = React.useCallback(async (manual) => {
        if (typeof fetchBalance !== 'function' || busyRef.current) return;
        busyRef.current = true;
        setBusy(true);
        try {
          const value = await fetchBalance();
          if (!alive.current) return;
          setDetails(value);
          setFailed(false);
          if (manual) {
            flashFresh();
            if (value && value.status === 'ready' && channelRef.current) {
              const at = Date.now();
              remoteStamp.current = at;
              channelRef.current.postMessage({
                type: 'account-balance',
                version: 1,
                at,
                details: value,
              });
            }
          }
        } catch (error) {
          if (alive.current) {
            setFailed(true);
            console.error('[dsh-balance] account balance read failed', error);
          }
        } finally {
          busyRef.current = false;
          if (alive.current) setBusy(false);
        }
      }, [fetchBalance, flashFresh]);

      React.useEffect(() => {
        alive.current = true;
        void load(false);
        return () => {
          alive.current = false;
          window.clearTimeout(freshTimer.current);
        };
      }, [load]);

      React.useEffect(() => {
        if (typeof BroadcastChannel === 'undefined') return undefined;
        const channel = new BroadcastChannel(BALANCE_CHANNEL);
        channelRef.current = channel;
        const onMessage = (event) => {
          const message = event.data;
          if (!message || message.type !== 'account-balance' || message.version !== 1) return;
          if (!Number.isFinite(message.at) || message.at <= remoteStamp.current) return;
          if (!message.details || message.details.status !== 'ready') return;
          remoteStamp.current = message.at;
          setDetails(message.details);
          setFailed(false);
          flashFresh();
        };
        channel.addEventListener('message', onMessage);
        return () => {
          channel.removeEventListener('message', onMessage);
          channel.close();
          if (channelRef.current === channel) channelRef.current = null;
        };
      }, [flashFresh]);

      React.useEffect(() => {
        const onVisibility = () => {
          if (document.visibilityState === 'visible') void load(false);
        };
        document.addEventListener('visibilitychange', onVisibility);
        return () => { document.removeEventListener('visibilitychange', onVisibility); };
      }, [load]);

      if (!wide) return null;
      if (details === null) return null;

      const wallet = primaryWallet(details);
      const amount = wallet
        ? walletText(wallet)
        : busy ? t('balanceLoading') : t('balanceUnavailable');
      const detail = balanceDetail(details, t);
      const tooltip = failed
        ? t('refreshFailed')
        : [t('accountBalance') + ' ' + amount, detail].filter(Boolean).join(' · ');
      const refreshLabel = busy ? t('refreshing') : failed ? t('refreshFailed') : t('refreshBalance');

      return h(React.Fragment, null,
        h('style', null, CSS),
        h('div', {
          className: 'dsh-bal-account',
          title: tooltip,
        },
        h('span', { className: 'dsh-bal-label' }, t('accountBalance')),
        h('span', {
          className: 'dsh-bal-amount',
          'aria-live': 'polite',
          'aria-busy': busy ? 'true' : 'false',
        }, amount),
        h('span', { className: 'dsh-bal-fresh' + (fresh ? ' is-on' : ''), 'aria-hidden': true }),
        h('button', {
          type: 'button',
          className: 'dsh-bal-refresh' + (busy ? ' is-busy' : ''),
          disabled: busy,
          'aria-label': refreshLabel,
          'aria-busy': busy ? 'true' : 'false',
          title: refreshLabel,
          onClick: (event) => {
            event.preventDefault();
            event.stopPropagation();
            void load(true);
          },
        }, h(RefreshIcon))));
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, 'en', EN), 'dsh-balance: en dictionary');
        ctx.effect(() => ctx.locale.register(NS, 'zh', ZH), 'dsh-balance: zh dictionary');

        ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
          name: 'conversation.composer.dock',
          id: 'session-cost',
          order: -1,
          locale: NS,
          label: () => ctx.locale.bind(NS)('sessionCost'),
        }, SessionCost));

        // The sidebar footer is additive; replacing settings.launcher would remove the
        // existing account menu, so the balance strip sits directly above that entry.
        ctx.inject(['remote', 'remote.account', 'remoteAccess'], (accountCtx) => {
          const fetchBalance = async () => {
            // The plain-JS client half cannot rely on a build-time env replacement;
            // fall back to this profile's release badge when process is absent.
            const version = (typeof process !== 'undefined' && process.env && process.env.DSH_CLIENT_VERSION)
              || '0.2.2-rc.1-fcc0a4';
            const result = await accountCtx.remote.account.getBalance({
              version,
              locale: accountCtx.locale.getSnapshot().active,
              timezoneOffsetSeconds: -new Date().getTimezoneOffset() * 60,
            });
            if (!result.ok) throw new Error('dsh-balance: account balance read failed');
            return result.value;
          };

          accountCtx.remoteAccess.whenAccess('account/watch', () =>
            accountCtx.slots.inject('sidebar.footer.action', () => accountCtx.slots.register({
              name: 'sidebar.footer.action',
              id: 'account-balance',
              order: 100,
              locale: NS,
              label: () => accountCtx.locale.bind(NS)('accountBalance'),
              inject: () => ({ fetchBalance }),
            }, AccountBalance)));
        });
      },
    };
  },
});
