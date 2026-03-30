# 会議室を照会する

## 概要

広さ・価格・機能性・評価で会議室を検索する

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["View\n会議室検索画面"]
    FE_State["State\n会議室を照会するState"]
    FE_API["API Client\nGET /api/v1/rooms"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\n会議室を照会するRequest"]
    BE_UC["usecase\n会議室を照会するUseCase"]
    BE_Domain["domain\n会議室情報"]
    BE_GW["gateway\nroomsRepository"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("rooms")]
  end
  FE_API -->|"GET /api/v1/rooms"| BE_Pres
  BE_GW -->|"SQL"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP 200/201"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 会議室検索画面の入力/表示内容 | ユーザー操作をState/API呼び出しに変換 |
| BE presentation | 会議室を照会するRequest(会議室情報, 会議室評価) | 入力バリデーション + UseCase呼び出し |
| BE gateway | rooms テーブル操作 | レコード取得 |
| Response | 一覧/詳細データ | 画面表示用データ |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as 利用者

  box rgb(230,240,255) tier-frontend
    participant View as View/会議室検索画面
    participant State as State Management
    participant APIClient as API Client
  end

  box rgb(240,255,240) tier-backend-api
    participant Pres as presentation
    participant UC as usecase
    participant Domain as domain
    participant GW as gateway
  end

  participant DB as RDB

  User->>View: 画面を表示
  View->>State: dispatch 会議室を照会するAction
  State->>APIClient: GET /api/v1/rooms
  APIClient->>Pres: GET /api/v1/rooms
  Pres->>Pres: 入力バリデーション
  Pres->>UC: 会議室を照会するCommand
  UC->>Domain: ビジネスルール検証
  UC->>GW: find
  GW->>DB: SELECT
  DB-->>GW: 結果
  GW-->>UC: ドメインモデル
  UC-->>Pres: 結果
  Pres-->>APIClient: HTTP 200
  APIClient-->>State: レスポンス
  State-->>View: 状態更新
  View-->>User: 画面更新
```

## バリエーション一覧

| バリエーション名 | 値 | 処理内容 | 適用 tier | 適用箇所 |
|----------------|---|---------|----------|---------|
| 貸出可否 | (バリエーション.tsvの値) | 表示切替/フィルター | tier-frontend | 会議室検索画面 |
| 評価種別 | (バリエーション.tsvの値) | 表示切替/フィルター | tier-frontend | 会議室検索画面 |


## 状態遷移一覧

| 状態モデル | 遷移元 | 遷移先 | トリガー | 事前条件 | 事後処理 | 適用 tier |
|-----------|--------|--------|---------|---------|---------|----------|
| - | - | - | - | - | - | - |

## 関連 RDRA モデル

| モデル種別 | 要素名 | 関連 |
|-----------|--------|------|
| 業務 | 予約業務 | このUCが属する業務 |
| BUC | 会議室予約フロー | このUCを含むBUC |
| アクター | 利用者 | 操作するアクター |
| 情報 | 会議室情報 | 参照する情報 |
| 情報 | 会議室評価 | 参照する情報 |




## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 会議室を照会する

  Scenario: 会議室を照会するの正常実行
    Given 利用者「田中太郎」がログイン済みである
    When 会議室検索画面でデータを表示する
    Then データが正常に表示される
```

### 異常系

```gherkin
  Scenario: 認証エラー
    Given 未ログイン状態である
    When 会議室検索画面にアクセスする
    Then ログイン画面にリダイレクトされる

```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../_cross-cutting/api/openapi.yaml)
