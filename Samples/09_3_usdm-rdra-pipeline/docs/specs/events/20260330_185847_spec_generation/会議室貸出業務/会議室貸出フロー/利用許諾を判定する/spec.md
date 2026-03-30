# 利用許諾を判定する

## 概要

利用者の過去評価を確認し使用許諾する

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["View\n利用許諾画面"]
    FE_State["State\n利用許諾を判定するState"]
    FE_API["API Client\nPOST /api/v1/reservations/{reservation_id}/actions/approve"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\n利用許諾を判定するRequest"]
    BE_UC["usecase\n利用許諾を判定するUseCase"]
    BE_Domain["domain\n利用者評価"]
    BE_GW["gateway\nuser_reviewsRepository"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("user_reviews")]
  end
  FE_API -->|"POST /api/v1/reservations/{reservation_id}/actions/approve"| BE_Pres
  BE_GW -->|"SQL"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP 200/201"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 利用許諾画面の入力/表示内容 | ユーザー操作をState/API呼び出しに変換 |
| BE presentation | 利用許諾を判定するRequest(利用者評価, 予約情報) | 入力バリデーション + UseCase呼び出し |
| BE gateway | user_reviews テーブル操作 | レコード作成 |
| Response | 操作結果 | 画面表示用データ |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as 会議室オーナー

  box rgb(230,240,255) tier-frontend
    participant View as View/利用許諾画面
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

  User->>View: 操作を実行
  View->>State: dispatch 利用許諾を判定するAction
  State->>APIClient: POST /api/v1/reservations/{reservation_id}/actions/approve
  APIClient->>Pres: POST /api/v1/reservations/{reservation_id}/actions/approve
  Pres->>Pres: 入力バリデーション
  Pres->>UC: 利用許諾を判定するCommand
  UC->>Domain: ビジネスルール検証
  UC->>GW: save
  GW->>DB: INSERT
  DB-->>GW: 結果
  GW-->>UC: ドメインモデル
  UC-->>Pres: 結果
  Pres-->>APIClient: HTTP 201
  APIClient-->>State: レスポンス
  State-->>View: 状態更新
  View-->>User: 画面更新
```


## 分岐条件一覧

| 条件名 | 判定ルール | 適用 tier | 適用箇所 | BDD Scenario |
|--------|----------|----------|---------|-------------|
| 利用許諾条件 | RDRA条件定義に基づく | tier-backend-api | 利用許諾を判定するのビジネスルール | 利用許諾を判定する 利用許諾条件シナリオ |

## 状態遷移一覧

| 状態モデル | 遷移元 | 遷移先 | トリガー | 事前条件 | 事後処理 | 適用 tier |
|-----------|--------|--------|---------|---------|---------|----------|
| 予約状態 | 仮予約 | 確定 | 利用許諾を判定する | 仮予約であること | ステータス更新 | tier-backend-api |

## 関連 RDRA モデル

| モデル種別 | 要素名 | 関連 |
|-----------|--------|------|
| 業務 | 会議室貸出業務 | このUCが属する業務 |
| BUC | 会議室貸出フロー | このUCを含むBUC |
| アクター | 会議室オーナー | 操作するアクター |
| 情報 | 利用者評価 | 更新する情報 |
| 情報 | 予約情報 | 更新する情報 |
| 状態 | 予約状態 | 仮予約 -> 確定 |
| 条件 | 利用許諾条件 | 適用される条件 |


## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 利用許諾を判定する

  Scenario: 利用許諾を判定するの正常実行
    Given 会議室オーナー「鈴木一郎」がログイン済みである
    When 利用許諾画面で操作を実行する
    Then 操作が正常に完了し画面にフィードバックが表示される
```

### 異常系

```gherkin
  Scenario: 認証エラー
    Given 未ログイン状態である
    When 利用許諾画面にアクセスする
    Then ログイン画面にリダイレクトされる

  Scenario: 利用許諾条件違反
    Given 会議室オーナー「鈴木一郎」がログイン済みである
    When 利用許諾条件を満たさない状態で操作を実行する
    Then エラーメッセージ「条件を満たしていません」が表示される

```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../_cross-cutting/api/openapi.yaml)
