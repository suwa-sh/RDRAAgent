# 会議室を予約する

## 概要

会議室の予約と決済方法の設定を行う

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["View\n予約申込画面"]
    FE_State["State\n会議室を予約するState"]
    FE_API["API Client\nPOST /api/v1/reservations"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\n会議室を予約するRequest"]
    BE_UC["usecase\n会議室を予約するUseCase"]
    BE_Domain["domain\n予約情報"]
    BE_GW["gateway\nreservationsRepository"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("reservations")]
  end
  FE_API -->|"POST /api/v1/reservations"| BE_Pres
  BE_GW -->|"SQL"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP 200/201"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 予約申込画面の入力/表示内容 | ユーザー操作をState/API呼び出しに変換 |
| BE presentation | 会議室を予約するRequest(予約情報, 会議室情報) | 入力バリデーション + UseCase呼び出し |
| BE gateway | reservations テーブル操作 | レコード作成 |
| Response | 操作結果 | 画面表示用データ |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as 利用者

  box rgb(230,240,255) tier-frontend
    participant View as View/予約申込画面
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
  View->>State: dispatch 会議室を予約するAction
  State->>APIClient: POST /api/v1/reservations
  APIClient->>Pres: POST /api/v1/reservations
  Pres->>Pres: 入力バリデーション
  Pres->>UC: 会議室を予約するCommand
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

## バリエーション一覧

| バリエーション名 | 値 | 処理内容 | 適用 tier | 適用箇所 |
|----------------|---|---------|----------|---------|
| 決済方法 | (バリエーション.tsvの値) | 表示切替/フィルター | tier-frontend | 予約申込画面 |


## 状態遷移一覧

| 状態モデル | 遷移元 | 遷移先 | トリガー | 事前条件 | 事後処理 | 適用 tier |
|-----------|--------|--------|---------|---------|---------|----------|
| 予約状態 | 変更 | 確定 | 会議室を予約する | 変更であること | ステータス更新 | tier-backend-api |

## 関連 RDRA モデル

| モデル種別 | 要素名 | 関連 |
|-----------|--------|------|
| 業務 | 予約業務 | このUCが属する業務 |
| BUC | 会議室予約フロー | このUCを含むBUC |
| アクター | 利用者 | 操作するアクター |
| 情報 | 予約情報 | 更新する情報 |
| 情報 | 会議室情報 | 更新する情報 |
| 状態 | 予約状態 | 変更 -> 確定 |



## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 会議室を予約する

  Scenario: 会議室を予約するの正常実行
    Given 利用者「田中太郎」がログイン済みである
    When 予約申込画面で操作を実行する
    Then 操作が正常に完了し画面にフィードバックが表示される
```

### 異常系

```gherkin
  Scenario: 認証エラー
    Given 未ログイン状態である
    When 予約申込画面にアクセスする
    Then ログイン画面にリダイレクトされる

```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../_cross-cutting/api/openapi.yaml)
