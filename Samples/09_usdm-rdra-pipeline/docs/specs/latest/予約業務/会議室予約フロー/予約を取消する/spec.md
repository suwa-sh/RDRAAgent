# 予約を取消する

## 概要

予約の取消を行う

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["View\n予約取消画面"]
    FE_State["State\n予約を取消するState"]
    FE_API["API Client\nPOST /api/v1/reservations/{reservation_id}/actions/cancel"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\n予約を取消するRequest"]
    BE_UC["usecase\n予約を取消するUseCase"]
    BE_Domain["domain\n予約情報"]
    BE_GW["gateway\nreservationsRepository"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("reservations")]
  end
  FE_API -->|"POST /api/v1/reservations/{reservation_id}/actions/cancel"| BE_Pres
  BE_GW -->|"SQL"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP 200/201"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 予約取消画面の入力/表示内容 | ユーザー操作をState/API呼び出しに変換 |
| BE presentation | 予約を取消するRequest(予約情報) | 入力バリデーション + UseCase呼び出し |
| BE gateway | reservations テーブル操作 | レコード作成 |
| Response | 操作結果 | 画面表示用データ |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as 利用者

  box rgb(230,240,255) tier-frontend
    participant View as View/予約取消画面
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
  View->>State: dispatch 予約を取消するAction
  State->>APIClient: POST /api/v1/reservations/{reservation_id}/actions/cancel
  APIClient->>Pres: POST /api/v1/reservations/{reservation_id}/actions/cancel
  Pres->>Pres: 入力バリデーション
  Pres->>UC: 予約を取消するCommand
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
| 予約変更条件 | RDRA条件定義に基づく | tier-backend-api | 予約を取消するのビジネスルール | 予約を取消する 予約変更条件シナリオ |

## 状態遷移一覧

| 状態モデル | 遷移元 | 遷移先 | トリガー | 事前条件 | 事後処理 | 適用 tier |
|-----------|--------|--------|---------|---------|---------|----------|
| 予約状態 | 仮予約 | 取消 | 予約を取消する | 仮予約であること | ステータス更新 | tier-backend-api |
| 予約状態 | 確定 | 取消 | 予約を取消する | 確定であること | ステータス更新 | tier-backend-api |

## 関連 RDRA モデル

| モデル種別 | 要素名 | 関連 |
|-----------|--------|------|
| 業務 | 予約業務 | このUCが属する業務 |
| BUC | 会議室予約フロー | このUCを含むBUC |
| アクター | 利用者 | 操作するアクター |
| 情報 | 予約情報 | 更新する情報 |
| 状態 | 予約状態 | 仮予約 -> 取消 |
| 状態 | 予約状態 | 確定 -> 取消 |
| 条件 | 予約変更条件 | 適用される条件 |


## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 予約を取消する

  Scenario: 予約を取消するの正常実行
    Given 利用者「田中太郎」がログイン済みである
    When 予約取消画面で操作を実行する
    Then 操作が正常に完了し画面にフィードバックが表示される
```

### 異常系

```gherkin
  Scenario: 認証エラー
    Given 未ログイン状態である
    When 予約取消画面にアクセスする
    Then ログイン画面にリダイレクトされる

  Scenario: 予約変更条件違反
    Given 利用者「田中太郎」がログイン済みである
    When 予約変更条件を満たさない状態で操作を実行する
    Then エラーメッセージ「条件を満たしていません」が表示される

```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../_cross-cutting/api/openapi.yaml)
