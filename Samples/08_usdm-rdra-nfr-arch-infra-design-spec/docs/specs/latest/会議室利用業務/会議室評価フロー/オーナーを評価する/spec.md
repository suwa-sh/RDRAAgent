# オーナーを評価する

## 概要

利用者が会議室オーナーの対応（コミュニケーション・会議室の状態・説明の正確さなど）を評価登録する。評価種別は「オーナー評価」として記録され、他の利用者の参考情報となる。

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend-user"]
    subgraph FE_V["view"]
      OwnerReviewFormPage
    end
    subgraph FE_S["state"]
      OwnerReviewState
    end
    subgraph FE_A["api-client"]
      CreateOwnerReviewRequest
    end
  end
  subgraph BE["tier-backend-api"]
    subgraph BE_P["presentation"]
      CreateReviewRequestDTO
    end
    subgraph BE_U["usecase"]
      CreateOwnerReviewCommand
    end
    subgraph BE_D["domain"]
      RoomReview
    end
    subgraph BE_G["gateway"]
      ReviewRecord
    end
  end
  subgraph DB["tier-datastore-rdb"]
    room_reviews[("room_reviews")]
  end

  OwnerReviewFormPage --> OwnerReviewState --> CreateOwnerReviewRequest
  CreateOwnerReviewRequest -->|"POST /api/v1/reviews"| CreateReviewRequestDTO
  CreateReviewRequestDTO --> CreateOwnerReviewCommand
  CreateOwnerReviewCommand --> RoomReview
  RoomReview --> ReviewRecord
  ReviewRecord -->|"INSERT review_type=owner"| room_reviews
  room_reviews --> ReviewRecord
  ReviewRecord --> RoomReview
  RoomReview --> CreateOwnerReviewCommand --> CreateReviewRequestDTO
  CreateReviewRequestDTO -->|"HTTP 201"| CreateOwnerReviewRequest
  CreateOwnerReviewRequest --> OwnerReviewState --> OwnerReviewFormPage
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE view | OwnerReviewFormPage | スター評価・コメント入力（オーナー向けUI） |
| FE state | OwnerReviewState | 評価入力・送信状態管理 |
| FE api-client | CreateOwnerReviewRequest | review_type=owner 付与・camelCase → snake_case |
| BE presentation | CreateReviewRequestDTO | バリデーション + Command 変換 |
| BE usecase | CreateOwnerReviewCommand | 利用済みチェック → 重複チェック → OwnerReview 生成 |
| BE domain | RoomReview | review_type=owner でエンティティ生成 |
| BE gateway | ReviewRecord | Entity → DB カラム形式の DTO |
| DB | room_reviews | INSERT review_type=owner |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as 利用者
  box rgb(230,240,255) tier-frontend-user
    participant View as OwnerReviewFormPage
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

  User->>View: オーナー評価登録画面でスター評価とコメントを入力して「投稿する」を押す
  View->>APIClient: 評価データを渡す
  APIClient->>Pres: POST /api/v1/reviews {review_type: "owner", owner_id, reservation_id, score, comment}
  Pres->>UC: CreateOwnerReviewCommand(review_type=owner, owner_id, reservation_id, score, comment)
  UC->>GW: checkUsageCompleted(user_id, owner_id)
  GW->>DB: 利用済みチェック・重複チェック
  alt 通過
    UC->>Domain: new RoomReview(review_type=owner, score, comment)
    UC->>GW: save(review)
    GW->>DB: INSERT room_reviews（review_type=owner）
    DB-->>GW: 保存完了
    GW-->>UC: RoomReview
    UC-->>Pres: CreateReviewResponse
    Pres-->>APIClient: HTTP 201 評価登録完了
    APIClient-->>State: 投稿完了状態
    State-->>View: 完了表示
    View-->>User: 「オーナー評価を投稿しました」
  else エラー
    GW-->>UC: Exception
    UC-->>Pres: 403 or 409
    Pres-->>APIClient: HTTP 403 or 409
    APIClient-->>State: エラー状態
    State-->>View: エラー表示
    View-->>User: エラーメッセージ
  end
```

## バリエーション一覧

| バリエーション名 | 値 | 処理内容 | 適用 tier | 適用箇所 |
|----------------|---|---------|----------|---------|
| 評価種別 | オーナー評価 | review_type=owner として評価を登録 | tier-backend-api | POST /api/v1/reviews |

## 分岐条件一覧

| 条件名 | 判定ルール | 適用 tier | 適用箇所 | BDD Scenario |
|--------|----------|----------|---------|-------------|
| 評価登録可否 | 利用者が当該オーナーの会議室を実際に利用済みであること | tier-backend-api | POST /api/v1/reviews（review_type=owner） | 利用していない会議室のオーナーは評価不可 |
| 重複評価防止 | 同一予約に対してオーナー評価が1件のみ登録可能 | tier-backend-api | POST /api/v1/reviews 重複チェック | 同じ予約で2回オーナー評価しようとするとエラー |

## 計算ルール一覧

| 計算名 | 入力情報 | 計算式/ロジック | 出力情報 | 適用 tier |
|--------|---------|---------------|---------|----------|
| （なし） | - | - | - | - |

## 状態遷移一覧

| 状態モデル | 遷移元 | 遷移先 | トリガー | 事前条件 | 事後処理 | 適用 tier |
|-----------|--------|--------|---------|---------|---------|----------|
| 会議室利用 | 利用終了 | 利用終了 | オーナーを評価する | 利用状態=利用終了 | 評価レコード作成（review_type=owner） | tier-backend-api |

## 関連 RDRA モデル

| モデル種別 | 要素名 | 関連 |
|-----------|--------|------|
| 業務 | 会議室利用業務 | このUCが属する業務 |
| BUC | 会議室評価フロー | このUCを含むBUC |
| アクター | 利用者 | 操作するアクター |
| 情報 | 会議室評価 | 評価ID・利用者ID・会議室ID・オーナーID・評価スコア・コメント（評価種別=オーナー評価） |
| バリエーション | 評価種別 | オーナー評価 |
| 画面 | オーナー評価登録画面 | 操作画面 |

## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: オーナーを評価する

  Scenario: 利用者が会議室オーナーの対応を評価する
    Given 利用者「田中太郎」がログイン済みで、「渋谷区コワーキング会議室A」の利用が完了しており、会議室評価を既に投稿済み
    When オーナー評価登録画面でスコア「5」・コメント「丁寧な説明でとても好印象でした」を入力して「投稿する」を押す
    Then オーナー評価が登録され、「オーナー評価を投稿しました」というメッセージが表示される
```

### 異常系

```gherkin
  Scenario: 同じ予約に対して2回オーナー評価を登録しようとする
    Given 利用者「田中太郎」が予約 rsv-001 に対してオーナー評価を既に投稿済み
    When 同じ rsv-001 に対して再度オーナー評価を投稿しようとする
    Then 「この予約のオーナー評価は既に投稿済みです」というエラーメッセージが表示される
```

## ティア別仕様

- [利用者・オーナー向けフロントエンド](tier-frontend-user.md)
- [バックエンド API](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../_cross-cutting/api/openapi.yaml)（全 UC 統合、Contract First 開発用）
