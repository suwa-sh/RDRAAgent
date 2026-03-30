# 鍵を受け取る

## 概要

会議室の鍵を受け取り利用を開始する

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["View\n鍵受取確認画面"]
    FE_State["State\n鍵を受け取るState"]
    FE_API["API Client\nPOST /api/v1/reservations/{reservation_id}/actions/receive-key"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\n鍵を受け取るRequest"]
    BE_UC["usecase\n鍵を受け取るUseCase"]
    BE_Domain["domain\n鍵情報"]
    BE_GW["gateway\nkeysRepository"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("keys")]
  end
  FE_API -->|"POST /api/v1/reservations/{reservation_id}/actions/receive-key"| BE_Pres
  BE_GW -->|"SQL"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP 200/201"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 鍵受取確認画面の入力/表示内容 | ユーザー操作をState/API呼び出しに変換 |
| BE presentation | 鍵を受け取るRequest(鍵情報, 予約情報) | 入力バリデーション + UseCase呼び出し |
| BE gateway | keys テーブル操作 | レコード作成 |
| Response | 操作結果 | 画面表示用データ |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as 利用者

  box rgb(230,240,255) tier-frontend
    participant View as View/鍵受取確認画面
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
  View->>State: dispatch 鍵を受け取るAction
  State->>APIClient: POST /api/v1/reservations/{reservation_id}/actions/receive-key
  APIClient->>Pres: POST /api/v1/reservations/{reservation_id}/actions/receive-key
  Pres->>Pres: 入力バリデーション
  Pres->>UC: 鍵を受け取るCommand
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
| 業務 | 会議室貸出業務 | このUCが属する業務 |
| BUC | 会議室貸出フロー | このUCを含むBUC |
| アクター | 利用者 | 操作するアクター |
| 情報 | 鍵情報 | 更新する情報 |
| 情報 | 予約情報 | 更新する情報 |




## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 鍵を受け取る

  Scenario: 鍵を受け取るの正常実行
    Given 利用者「田中太郎」がログイン済みである
    When 鍵受取確認画面で操作を実行する
    Then 操作が正常に完了し画面にフィードバックが表示される
```

### 異常系

```gherkin
  Scenario: 認証エラー
    Given 未ログイン状態である
    When 鍵受取確認画面にアクセスする
    Then ログイン画面にリダイレクトされる

```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../_cross-cutting/api/openapi.yaml)
