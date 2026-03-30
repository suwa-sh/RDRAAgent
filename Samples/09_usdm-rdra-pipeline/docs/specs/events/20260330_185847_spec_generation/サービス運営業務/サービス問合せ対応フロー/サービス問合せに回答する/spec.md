# サービス問合せに回答する

## 概要

利用者からのサービス問合せに対応する

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["View\nサービス問合せ回答画面"]
    FE_State["State\nサービス問合せに回答するState"]
    FE_API["API Client\nPOST /api/v1/service-inquiries/{inquiry_id}/actions/reply"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\nサービス問合せに回答するRequest"]
    BE_UC["usecase\nサービス問合せに回答するUseCase"]
    BE_Domain["domain\n問合せ"]
    BE_GW["gateway\ninquiriesRepository"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("inquiries")]
  end
  FE_API -->|"POST /api/v1/service-inquiries/{inquiry_id}/actions/reply"| BE_Pres
  BE_GW -->|"SQL"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP 200/201"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | サービス問合せ回答画面の入力/表示内容 | ユーザー操作をState/API呼び出しに変換 |
| BE presentation | サービス問合せに回答するRequest(問合せ) | 入力バリデーション + UseCase呼び出し |
| BE gateway | inquiries テーブル操作 | レコード作成 |
| Response | 操作結果 | 画面表示用データ |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as サービス運営担当者

  box rgb(230,240,255) tier-frontend
    participant View as View/サービス問合せ回答画面
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
  View->>State: dispatch サービス問合せに回答するAction
  State->>APIClient: POST /api/v1/service-inquiries/{inquiry_id}/actions/reply
  APIClient->>Pres: POST /api/v1/service-inquiries/{inquiry_id}/actions/reply
  Pres->>Pres: 入力バリデーション
  Pres->>UC: サービス問合せに回答するCommand
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


## 状態遷移一覧

| 状態モデル | 遷移元 | 遷移先 | トリガー | 事前条件 | 事後処理 | 適用 tier |
|-----------|--------|--------|---------|---------|---------|----------|
| 問合せ状態 | 受付 | 対応中 | サービス問合せに回答する | 受付であること | ステータス更新 | tier-backend-api |
| 問合せ状態 | 対応中 | 回答済 | サービス問合せに回答する | 対応中であること | ステータス更新 | tier-backend-api |

## 関連 RDRA モデル

| モデル種別 | 要素名 | 関連 |
|-----------|--------|------|
| 業務 | サービス運営業務 | このUCが属する業務 |
| BUC | サービス問合せ対応フロー | このUCを含むBUC |
| アクター | サービス運営担当者 | 操作するアクター |
| 情報 | 問合せ | 更新する情報 |
| 状態 | 問合せ状態 | 受付 -> 対応中 |
| 状態 | 問合せ状態 | 対応中 -> 回答済 |



## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: サービス問合せに回答する

  Scenario: サービス問合せに回答するの正常実行
    Given サービス運営担当者「山田花子」がログイン済みである
    When サービス問合せ回答画面で操作を実行する
    Then 操作が正常に完了し画面にフィードバックが表示される
```

### 異常系

```gherkin
  Scenario: 認証エラー
    Given 未ログイン状態である
    When サービス問合せ回答画面にアクセスする
    Then ログイン画面にリダイレクトされる

```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../_cross-cutting/api/openapi.yaml)
