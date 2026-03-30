# オーナー登録を審査する

## 概要

オーナー申請を審査し承認または却下する

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["View\nオーナー審査画面"]
    FE_State["State\nオーナー登録を審査するState"]
    FE_API["API Client\nPOST /api/v1/owners/{owner_id}/actions/review"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\nオーナー登録を審査するRequest"]
    BE_UC["usecase\nオーナー登録を審査するUseCase"]
    BE_Domain["domain\nオーナー情報"]
    BE_GW["gateway\nownersRepository"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("owners")]
  end
  FE_API -->|"POST /api/v1/owners/{owner_id}/actions/review"| BE_Pres
  BE_GW -->|"SQL"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP 200/201"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | オーナー審査画面の入力/表示内容 | ユーザー操作をState/API呼び出しに変換 |
| BE presentation | オーナー登録を審査するRequest(オーナー情報) | 入力バリデーション + UseCase呼び出し |
| BE gateway | owners テーブル操作 | レコード作成 |
| Response | 操作結果 | 画面表示用データ |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as サービス運営担当者

  box rgb(230,240,255) tier-frontend
    participant View as View/オーナー審査画面
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
  View->>State: dispatch オーナー登録を審査するAction
  State->>APIClient: POST /api/v1/owners/{owner_id}/actions/review
  APIClient->>Pres: POST /api/v1/owners/{owner_id}/actions/review
  Pres->>Pres: 入力バリデーション
  Pres->>UC: オーナー登録を審査するCommand
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
| オーナー審査条件 | RDRA条件定義に基づく | tier-backend-api | オーナー登録を審査するのビジネスルール | オーナー登録を審査する オーナー審査条件シナリオ |

## 状態遷移一覧

| 状態モデル | 遷移元 | 遷移先 | トリガー | 事前条件 | 事後処理 | 適用 tier |
|-----------|--------|--------|---------|---------|---------|----------|
| オーナー申請状態 | 申請中 | 審査中 | オーナー登録を審査する | 申請中であること | ステータス更新 | tier-backend-api |
| オーナー申請状態 | 審査中 | 承認 | オーナー登録を審査する | 審査中であること | ステータス更新 | tier-backend-api |
| オーナー申請状態 | 審査中 | 却下 | オーナー登録を審査する | 審査中であること | ステータス更新 | tier-backend-api |

## 関連 RDRA モデル

| モデル種別 | 要素名 | 関連 |
|-----------|--------|------|
| 業務 | オーナー管理業務 | このUCが属する業務 |
| BUC | オーナー登録フロー | このUCを含むBUC |
| アクター | サービス運営担当者 | 操作するアクター |
| 情報 | オーナー情報 | 更新する情報 |
| 状態 | オーナー申請状態 | 申請中 -> 審査中 |
| 状態 | オーナー申請状態 | 審査中 -> 承認 |
| 状態 | オーナー申請状態 | 審査中 -> 却下 |
| 条件 | オーナー審査条件 | 適用される条件 |


## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: オーナー登録を審査する

  Scenario: オーナー登録を審査するの正常実行
    Given サービス運営担当者「山田花子」がログイン済みである
    When オーナー審査画面で操作を実行する
    Then 操作が正常に完了し画面にフィードバックが表示される
```

### 異常系

```gherkin
  Scenario: 認証エラー
    Given 未ログイン状態である
    When オーナー審査画面にアクセスする
    Then ログイン画面にリダイレクトされる

  Scenario: オーナー審査条件違反
    Given サービス運営担当者「山田花子」がログイン済みである
    When オーナー審査条件を満たさない状態で操作を実行する
    Then エラーメッセージ「条件を満たしていません」が表示される

```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../_cross-cutting/api/openapi.yaml)
