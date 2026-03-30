# サービス問合せを送信する

## 概要

利用者がサービスに関する問合せを送信する。問合せ種別は「サービス運営宛」。

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["view\nサービス問合せ画面"]
    FE_State["state\nサービス問合せを送信するState"]
    FE_API["api-client\nPOST /api/v1/support/inquiries"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\nCreateSupportInquiryRequest"]
    BE_UC["usecase\nサービス問合せを送信するCommand"]
    BE_Domain["domain\n問合せ"]
    BE_GW["gateway\ninquiries"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("inquiries")]
  end
  FE_API -->|"POST /api/v1/support/inquiries"| BE_Pres
  BE_GW -->|"INSERT"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP Response"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | サービス問合せ画面の表示/入力 | ユーザー操作 → state 更新 |
| BE presentation | CreateSupportInquiryRequest | バリデーション + Command変換 |
| BE gateway | INSERT inquiries | レコード操作 |
| Response | InquiryResponse | 表示用データ |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as 利用者
  box rgb(230,240,255) tier-frontend
    participant View as View/Component
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
  User->>View: 操作実行
  View->>State: action dispatch
  State->>APIClient: POST /api/v1/support/inquiries
  APIClient->>Pres: POST /api/v1/support/inquiries
  Pres->>Pres: 入力バリデーション
  Pres->>UC: Command/Query
  UC->>Domain: ビジネスロジック
  UC->>GW: 永続化
  GW->>DB: INSERT
  DB-->>GW: Result
  GW-->>UC: Entity
  UC-->>Pres: Response
  Pres-->>APIClient: HTTP Response
  APIClient-->>State: Result
  State-->>View: 状態更新
  View-->>User: 表示更新
```

## バリエーション一覧

| バリエーション名 | 値 | 処理内容 | 適用 tier | 適用箇所 |
|----------------|---|---------|----------|---------|

## 分岐条件一覧

該当なし

## 計算ルール一覧

該当なし


## 状態遷移一覧

該当なし

## 関連 RDRA モデル

| モデル種別 | 要素名 | 関連 |
|-----------|--------|------|
| 業務 | サービス運営業務 | このUCが属する業務 |
| BUC | サービス問合せ対応フロー | このUCを含むBUC |
| アクター | 利用者 | 操作するアクター |
| 情報 | 問合せ | 参照・更新する情報 |


| バリエーション | 問合せ種別 | 関連するバリエーション |


## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: サービス問合せを送信する

  Scenario: 利用者がサービスに問合せを送信する
    Given 利用者「山田花子」がサービス問合せ画面を表示している
    When 件名「退会方法について」、内容「退会手続きの方法を教えてください」を入力し「送信」ボタンをクリックする
    Then サービス問合せが送信され「問合せを送信しました」のメッセージが表示される
```

### 異常系

```gherkin
  Scenario: 内容未入力でサービス問合せ送信に失敗する
    Given 利用者がサービス問合せ画面を表示している
    When 内容を空のまま「送信」ボタンをクリックする
    Then 「内容は必須です」のバリデーションエラーが表示される
```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../../_cross-cutting/api/openapi.yaml)
