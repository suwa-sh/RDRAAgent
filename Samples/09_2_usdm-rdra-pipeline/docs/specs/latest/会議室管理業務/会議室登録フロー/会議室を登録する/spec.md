# 会議室を登録する

## 概要

オーナーが会議室の物件情報（会議室名、所在地、広さ、価格、機能性）を登録する。会議室状態は未公開→公開中に遷移する。

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["view\n会議室登録画面"]
    FE_State["state\n会議室を登録するState"]
    FE_API["api-client\nPOST /api/v1/rooms"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\nCreateRoomRequest"]
    BE_UC["usecase\n会議室を登録するCommand"]
    BE_Domain["domain\n会議室情報"]
    BE_GW["gateway\nrooms"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("rooms")]
  end
  FE_API -->|"POST /api/v1/rooms"| BE_Pres
  BE_GW -->|"INSERT"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP Response"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 会議室登録画面の表示/入力 | ユーザー操作 → state 更新 |
| BE presentation | CreateRoomRequest | バリデーション + Command変換 |
| BE gateway | INSERT rooms | レコード操作 |
| Response | RoomResponse | 表示用データ |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as 会議室オーナー
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
  State->>APIClient: POST /api/v1/rooms
  APIClient->>Pres: POST /api/v1/rooms
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

該当なし

## 分岐条件一覧

該当なし

## 計算ルール一覧

該当なし


## 状態遷移一覧

| 状態モデル | 遷移元 | 遷移先 | トリガー | 事前条件 | 事後処理 | 適用 tier |
|-----------|--------|--------|---------|---------|---------|----------|
| 会議室状態 | 未公開 | 公開中 | 会議室を登録する | - | - | tier-backend-api |

## 関連 RDRA モデル

| モデル種別 | 要素名 | 関連 |
|-----------|--------|------|
| 業務 | 会議室管理業務 | このUCが属する業務 |
| BUC | 会議室登録フロー | このUCを含むBUC |
| アクター | 会議室オーナー | 操作するアクター |
| 情報 | 会議室情報 | 参照・更新する情報 |
| 状態 | 会議室状態 | 関連する状態遷移 |




## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 会議室を登録する

  Scenario: オーナーが会議室を登録する
    Given 承認済みの会議室オーナー「田中太郎」が会議室登録画面を表示している
    When 会議室名「渋谷ミーティングルームA」、所在地「東京都渋谷区道玄坂1-1-1」、広さ「30平米」、価格「5000円/時間」、機能性「プロジェクター、ホワイトボード」を入力し「登録する」ボタンをクリックする
    Then 会議室情報が登録され会議室状態が「公開中」になる
```

### 異常系

```gherkin
  Scenario: 必須項目未入力で会議室登録に失敗する
    Given 承認済みの会議室オーナー「田中太郎」が会議室登録画面を表示している
    When 会議室名を空のまま「登録する」ボタンをクリックする
    Then 「会議室名は必須です」のバリデーションエラーが表示される
```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../../_cross-cutting/api/openapi.yaml)
