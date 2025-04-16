# 📦 GraphQL QA App

GraphQL ハンズオン学習のための「シンプルな質問箱アプリ」です。
フロントエンドとバックエンドを GraphQL で完全に接続し、基本的なクエリ・ミューテーションの流れを学べます。

---

## 🛠 技術スタック

| 項目            | 使用技術                         |
|----------------|----------------------------------|
| フロントエンド  | Next.js / TypeScript / Apollo Client |
| バックエンド    | Ruby on Rails / graphql-ruby / GraphiQL |
| データベース    | SQLite（開発環境）または MySQL        |

---

## 📌 機能一覧

| 機能                          | 内容                                                                 |
|-----------------------------|----------------------------------------------------------------------|
| ✅ 質問投稿機能（Mutation）     | 任意の質問を投稿できます（文字数制限あり）                              |
| ✅ 質問一覧の取得（Query）       | 全ての質問を取得し、投稿日時も表示                                     |
| ✅ 回答登録（Mutation）         | 未回答の質問に対し、フォームで回答を送信可能                             |
| ✅ 回答修正（Mutation）         | 回答済みの質問に対して「修正」ボタンから再編集が可能                     |
| ✅ 未回答のみフィルター（Query） | チェックボックスにより未回答の質問のみ表示できる                         |
| ✅ GraphiQL UI                  | `/graphiql` にアクセスすることで GraphQL スキーマと実行環境を確認可能      |

---

## 🚀 起動方法

### 1. リポジトリをクローン

```bash
git clone git@github.com:YOUR_NAME/graphql-qa.git
cd graphql-qa
```

### 2. バックエンド（Rails）

```bash
cd backend
bundle install
bin/rails db:create db:migrate db:seed
bin/rails s
```

- 開発サーバー: http://localhost:3000
- GraphiQL UI: http://localhost:3000/graphiql

### 3. フロントエンド（Next.js）

```bash
cd frontend
npm install
npm run dev
```

- アプリ画面: http://localhost:3001（ポートは被っていなければ 3000）

---

## ✍ 使い方

1. **質問を投稿**
   → フォームに入力し「送信」

2. **回答を入力**
   → 未回答の質問に表示されるフォームから回答

3. **回答の修正**
   → 回答済みの質問に「修正」ボタンが表示

4. **未回答のみ表示**
   → チェックボックスで切り替え

---

## 📂 ディレクトリ構成

```txt
graphql-qa/
├── backend/       # Rails + GraphQL サーバー
├── frontend/      # Next.js + Apollo フロントエンド
└── README.md
```

---

## ✨ 学べること

- GraphQL の基礎（Query / Mutation / 型定義）
- Next.js + Apollo Client の統合
- GraphQL スキーマ設計と resolver 実装
- UI と GraphQL の連携（フォーム送信 / フィルター）
- GraphiQL を使ったスキーマ確認と動作確認

---

## 📸 スクリーンショット

https://github.com/Tatsuki-Otake/graphql-qa/raw/main/frontend/public/screenshot.png

---

## 🔗 参考

- [graphql-ruby](https://graphql-ruby.org/)
- [Apollo Client Docs](https://www.apollographql.com/docs/react/)
- [Next.js App Router](https://nextjs.org/docs/app)

---

## 📄 ライセンス

MIT

## 公開URL

- フロントエンド： https://graphql-qa.vercel.app/
- バックエンド（API）： https://graphql-qa-backend.onrender.com/graphql
