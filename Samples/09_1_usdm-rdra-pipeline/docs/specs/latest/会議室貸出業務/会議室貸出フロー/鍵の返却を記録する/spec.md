# 鍵の返却を記録する

## 概要

利用者が鍵を返却し利用終了を記録する

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["ビュー層\n鍵返却画面"]
    FE_State["状態管理層\nState"]
    FE_API["APIクライアント層\nPOST /api/v1/reservations/{id}/keys/actions/return"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\nRequest DTO"]
    BE_UC["usecase\nUseCase"]
    BE_Domain["domain\nEntity"]
    BE_GW["gateway\nRepository"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("tables")]
  end
  FE_API -->|"POST /api/v1/reservations/{id}/keys/actions/return"| BE_Pres
  BE_GW --> DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres --> FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 鍵返却画面の入力/表示 | ユーザー操作をリクエストに変換 |
| BE presentation | Request DTO | バリデーション + Command/Query変換 |
| BE gateway | SQL操作 | データ永続化/取得 |
| Response | レスポンスJSON | 表示用データ |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as 利用者
  box rgb(230,240,255) tier-frontend
    participant View as View/鍵返却画面
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
  View->>State: アクション dispatch
  State->>APIClient: API呼出し
  APIClient->>Pres: POST /api/v1/reservations/{id}/keys/actions/return
  Pres->>Pres: 入力バリデーション
  Pres->>UC: Command/Query
  UC->>Domain: ドメインロジック
  UC->>GW: データアクセス
  GW->>DB: SQL
  DB-->>GW: 結果
  GW-->>UC: ドメインモデル
  UC-->>Pres: 結果
  Pres-->>APIClient: HTTP レスポンス
  APIClient-->>State: レスポンスデータ
  State-->>View: 状態更新
  View-->>User: 画面更新
```

## バリエーション一覧

該当なし

## 分岐条件一覧

該当なし

## 計算ルール一覧

該当なし

## 状態遷移一覧

該当なし

## 関連 RDRA モデル

| モデル種別 | 要素名 | 関連 |
|-----------|--------|------|
| 業務 | 会議室貸出業務 | このUCが属する業務 |
| BUC | 会議室貸出フロー | このUCを含むBUC |
| アクター | 利用者 | 操作するアクター |
| 情報 |  | 参照・更新する情報 |
| 状態 |  | 関連する状態遷移 |

## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 鍵の返却を記録する

  Scenario: 鍵の返却を記録するの正常実行
    Given 利用者「テストユーザー」がログイン済み
    When 鍵返却画面で操作を実行する
    Then 操作が正常に完了する
```

### 異常系

```gherkin
  Scenario: 未認証ユーザーのアクセス拒否
    Given ユーザーが未ログイン状態
    When 鍵返却画面にアクセスする
    Then ログイン画面にリダイレクトされる
```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンド API](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../_cross-cutting/api/openapi.yaml)
