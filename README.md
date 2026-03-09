# SMC × CRT Trading Dashboard（PWA版）

## ファイル構成

```
trading-app-pwa/
├── package.json
├── public/
│   ├── index.html        ← PWA対応済み
│   ├── manifest.json     ← アプリ情報（NEW）
│   ├── service-worker.js ← オフライン対応（NEW）
│   ├── icon-192.png      ← アプリアイコン（自分で用意）
│   └── icon-512.png      ← アプリアイコン（自分で用意）
└── src/
    ├── index.js          ← Service Worker登録済み
    └── App.js            ← メインアプリ
```

---

## アイコン画像について

`public/` フォルダに以下の2つの画像を追加してください：
- `icon-192.png`（192×192px）
- `icon-512.png`（512×512px）

※ なければ仮の画像でもOK。アイコンがないとインストール時に表示されないだけで動作はします。

---

## Vercelにデプロイしてアプリとしてインストールする手順

### 1. Vercelにデプロイ
1. github.com でリポジトリ作成
2. このフォルダをアップロード
3. vercel.com でGitHubと連携 → 自動デプロイ
4. https://あなたのアプリ.vercel.app というURLが発行される

### 2. スマホにインストール（iPhone）
1. Safariで上記URLを開く
2. 下の共有ボタン（四角に矢印）をタップ
3. 「ホーム画面に追加」をタップ
4. アプリとしてインストール完了！

### 3. スマホにインストール（Android）
1. Chromeで上記URLを開く
2. 「ホーム画面に追加」のバナーが出る or メニューから選択
3. インストール完了！

### 4. PCにインストール（Chrome）
1. ChromeでURLを開く
2. アドレスバーの右端にインストールアイコンが出る
3. クリックしてインストール！
