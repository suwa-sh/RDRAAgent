# オーナーを登録する

## 概要

オーナーのプロフィール情報を入力し登録する

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["View\nオーナー登録画面"]
    FE_State["State\nオーナーを登録するState"]
    FE_API["API Client\nPOST /api/v1/owners"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\nオーナーを登録するRequest"]
    BE_UC["usecase\nオーナーを登録するUseCase"]
    BE_Domain["domain\nオーナー情報"]
    BE_GW["gateway\nownersRepository"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("owners")]
  end
  FE_API -->|"POST /api/v1/owners"| BE_Pres
  BE_GW -->|"SQL"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP 200/201"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | オーナー登録画面の入力/表示内容 | ユーザー操作をState/API呼び出しに変換 |
| BE presentation | オーナーを登録するRequest(オーナー情報) | 入力バリデーション + UseCase呼び出し |
| BE gateway | owners テーブル操作 | レコード作成 |
| Response | 操作結果 | 画面表示用データ |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as 会議室オーナー

  box rgb(230,240,255) tier-frontend
    participant View as View/オーナー登録画面
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
  View->>State: dispatch オーナーを登録するAction
  State->>APIClient: POST /api/v1/owners
  APIClient->>Pres: POST /api/v1/owners
  Pres->>Pres: 入力バリデーション
  Pres->>UC: オーナーを登録するCommand
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
| - | - | - | - | - | - | - |

## 関連 RDRA モデル

| モデル種別 | 要素名 | 関連 |
|-----------|--------|------|
| 業務 | オーナー管理業務 | このUCが属する業務 |
| BUC | オーナー登録フロー | このUCを含むBUC |
| アクター | 会議室オーナー | 操作するアクター |
| 情報 | オーナー情報 | 更新する情報 |




## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: オーナーを登録する

  Scenario: オーナーを登録するの正常実行
    Given 会議室オーナー「鈴木一郎」がログイン済みである
    When オーナー登録画面で操作を実行する
    Then 操作が正常に完了し画面にフィードバックが表示される
```

### 異常系

```gherkin
  Scenario: 認証エラー
    Given 未ログイン状態である
    When オーナー登録画面にアクセスする
    Then ログイン画面にリダイレクトされる

```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../_cross-cutting/api/openapi.yaml)
