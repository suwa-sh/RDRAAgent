# サービスに問合せる

## 概要

サービス運営への問合せを送信する

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["View\nサービス問合せ画面"]
    FE_State["State\nサービスに問合せるState"]
    FE_API["API Client\nPOST /api/v1/service-inquiries"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\nサービスに問合せるRequest"]
    BE_UC["usecase\nサービスに問合せるUseCase"]
    BE_Domain["domain\n問合せ"]
    BE_GW["gateway\ninquiriesRepository"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("inquiries")]
  end
  FE_API -->|"POST /api/v1/service-inquiries"| BE_Pres
  BE_GW -->|"SQL"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP 200/201"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | サービス問合せ画面の入力/表示内容 | ユーザー操作をState/API呼び出しに変換 |
| BE presentation | サービスに問合せるRequest(問合せ) | 入力バリデーション + UseCase呼び出し |
| BE gateway | inquiries テーブル操作 | レコード作成 |
| Response | 操作結果 | 画面表示用データ |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as 利用者

  box rgb(230,240,255) tier-frontend
    participant View as View/サービス問合せ画面
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
  View->>State: dispatch サービスに問合せるAction
  State->>APIClient: POST /api/v1/service-inquiries
  APIClient->>Pres: POST /api/v1/service-inquiries
  Pres->>Pres: 入力バリデーション
  Pres->>UC: サービスに問合せるCommand
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
| 問合せ種別 | (バリエーション.tsvの値) | 表示切替/フィルター | tier-frontend | サービス問合せ画面 |


## 状態遷移一覧

| 状態モデル | 遷移元 | 遷移先 | トリガー | 事前条件 | 事後処理 | 適用 tier |
|-----------|--------|--------|---------|---------|---------|----------|
| 問合せ状態 | (初期) | 受付 | サービスに問合せる | 初期状態 | ステータス更新 | tier-backend-api |

## 関連 RDRA モデル

| モデル種別 | 要素名 | 関連 |
|-----------|--------|------|
| 業務 | サービス運営業務 | このUCが属する業務 |
| BUC | サービス問合せ対応フロー | このUCを含むBUC |
| アクター | 利用者 | 操作するアクター |
| 情報 | 問合せ | 更新する情報 |
| 状態 | 問合せ状態 | 初期 -> 受付 |



## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: サービスに問合せる

  Scenario: サービスに問合せるの正常実行
    Given 利用者「田中太郎」がログイン済みである
    When サービス問合せ画面で操作を実行する
    Then 操作が正常に完了し画面にフィードバックが表示される
```

### 異常系

```gherkin
  Scenario: 認証エラー
    Given 未ログイン状態である
    When サービス問合せ画面にアクセスする
    Then ログイン画面にリダイレクトされる

```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../_cross-cutting/api/openapi.yaml)
