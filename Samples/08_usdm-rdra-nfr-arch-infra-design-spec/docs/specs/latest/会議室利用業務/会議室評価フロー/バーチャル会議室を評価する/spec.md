# バーチャル会議室を評価する

## 概要

利用者がバーチャル会議室の接続安定性・音質・操作性・画質などを評価登録する。物理会議室評価とは異なり、バーチャル会議室特有の項目（接続安定性・会議ツールの使いやすさ）に焦点を当てた評価となる。評価種別は「会議室評価」、会議室種別はバーチャルとして記録される。

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend-user"]
    subgraph FE_V["view"]
      VirtualRoomReviewFormPage
    end
    subgraph FE_S["state"]
      VirtualRoomReviewState
    end
    subgraph FE_A["api-client"]
      CreateVirtualRoomReviewRequest
    end
  end
  subgraph BE["tier-backend-api"]
    subgraph BE_P["presentation"]
      CreateReviewRequestDTO
    end
    subgraph BE_U["usecase"]
      CreateRoomReviewCommand
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
    rooms[("rooms")]
  end

  VirtualRoomReviewFormPage --> VirtualRoomReviewState --> CreateVirtualRoomReviewRequest
  CreateVirtualRoomReviewRequest -->|"POST /api/v1/reviews"| CreateReviewRequestDTO
  CreateReviewRequestDTO --> CreateRoomReviewCommand
  CreateRoomReviewCommand --> RoomReview
  RoomReview --> ReviewRecord
  ReviewRecord -->|"INSERT review_type=room room_type=virtual"| room_reviews
  ReviewRecord -->|"UPDATE avg_rating"| rooms
  room_reviews --> ReviewRecord
  rooms --> ReviewRecord
  ReviewRecord --> RoomReview
  RoomReview --> CreateRoomReviewCommand --> CreateReviewRequestDTO
  CreateReviewRequestDTO -->|"HTTP 201"| CreateVirtualRoomReviewRequest
  CreateVirtualRoomReviewRequest --> VirtualRoomReviewState --> VirtualRoomReviewFormPage
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE view | VirtualRoomReviewFormPage | バーチャル特有観点（接続安定性・音質・画質）の評価UI |
| FE state | VirtualRoomReviewState | バーチャル評価入力・送信状態管理 |
| FE api-client | CreateVirtualRoomReviewRequest | review_type=room, room_type=virtual 付与 |
| BE presentation | CreateReviewRequestDTO | バリデーション + Command 変換 |
| BE usecase | CreateRoomReviewCommand | 利用済みチェック（バーチャル） → 重複チェック → RoomReview 生成 → avg_rating 更新 |
| BE domain | RoomReview | review_type=room, room_type=virtual でエンティティ生成 |
| BE gateway | ReviewRecord | Entity → DB カラム形式の DTO |
| DB | room_reviews | INSERT review_type=room, room_type=virtual |
| DB | rooms | UPDATE avg_rating=AVG(全スコア) |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as 利用者
  box rgb(230,240,255) tier-frontend-user
    participant View as VirtualRoomReviewFormPage
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

  User->>View: バーチャル会議室評価登録画面でスター評価・コメントを入力して「投稿する」を押す
  View->>APIClient: バーチャル評価データを渡す
  APIClient->>Pres: POST /api/v1/reviews {review_type: "room", room_type: "virtual", room_id, score, comment}
  Pres->>UC: CreateRoomReviewCommand(review_type=room, room_type=virtual, ...)
  UC->>GW: checkUsageCompleted(user_id, room_id, room_type=virtual)
  GW->>DB: 利用済みチェック・重複チェック
  alt 通過
    UC->>Domain: new RoomReview(review_type=room, room_type=virtual, score, comment)
    UC->>GW: save(review)
    GW->>DB: INSERT room_reviews（review_type=room, room_type=virtual）
    GW->>DB: UPDATE rooms SET avg_rating=新平均
    DB-->>GW: 保存完了
    GW-->>UC: RoomReview
    UC-->>Pres: CreateReviewResponse
    Pres-->>APIClient: HTTP 201 評価登録完了
    APIClient-->>State: 投稿完了状態
    State-->>View: 完了表示
    View-->>User: 「バーチャル会議室の評価を投稿しました」
  end
```

## バリエーション一覧

| バリエーション名 | 値 | 処理内容 | 適用 tier | 適用箇所 |
|----------------|---|---------|----------|---------|
| 会議室種別 | バーチャル | room_type=virtual として評価を登録。評価入力UIにバーチャル特有の観点（接続安定性等）を追加 | tier-frontend-user | 会議室評価登録画面 |

## 分岐条件一覧

| 条件名 | 判定ルール | 適用 tier | 適用箇所 | BDD Scenario |
|--------|----------|----------|---------|-------------|
| 評価登録可否 | 利用者がバーチャル会議室を実際に利用済み（利用状態=利用終了）であること | tier-backend-api | POST /api/v1/reviews バリデーション | バーチャル会議室利用済みのみ評価可 |
| 重複評価防止 | 同一予約に対して会議室評価が1件のみ登録可能 | tier-backend-api | POST /api/v1/reviews 重複チェック | 同じ予約で2回評価はエラー |

## 計算ルール一覧

| 計算名 | 入力情報 | 計算式/ロジック | 出力情報 | 適用 tier |
|--------|---------|---------------|---------|----------|
| バーチャル会議室平均スコア更新 | 新規評価スコア・既存評価一覧 | rooms.avg_rating = AVG(全評価スコア) | 更新後の平均スコア | tier-backend-api |

## 状態遷移一覧

| 状態モデル | 遷移元 | 遷移先 | トリガー | 事前条件 | 事後処理 | 適用 tier |
|-----------|--------|--------|---------|---------|---------|----------|
| 会議室利用 | 利用終了 | 利用終了 | バーチャル会議室を評価する | バーチャル会議室の利用状態=利用終了 | 評価レコード作成・rooms.avg_rating 更新 | tier-backend-api |

## 関連 RDRA モデル

| モデル種別 | 要素名 | 関連 |
|-----------|--------|------|
| 業務 | 会議室利用業務 | このUCが属する業務 |
| BUC | 会議室評価フロー | このUCを含むBUC |
| アクター | 利用者 | 操作するアクター |
| 情報 | 会議室評価 | 評価ID・利用者ID・会議室ID・オーナーID・会議室種別=バーチャル・評価スコア・コメント |
| バリエーション | 評価種別 | 会議室評価（バーチャル） |
| バリエーション | 会議室種別 | バーチャル |
| 画面 | 会議室評価登録画面 | 操作画面（物理・バーチャル共通画面） |

## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: バーチャル会議室を評価する

  Scenario: 利用者がバーチャル会議室の接続安定性を評価する
    Given 利用者「田中太郎」がログイン済みで、「Zoomオンライン会議室B」の利用（バーチャル）が完了している
    When バーチャル会議室評価登録画面でスコア「5」・コメント「接続が安定していて音質も良好でした」を入力して「投稿する」を押す
    Then 評価が登録され、「バーチャル会議室の評価を投稿しました」というメッセージが表示される
```

### 異常系

```gherkin
  Scenario: バーチャル会議室を利用していない利用者が評価しようとする
    Given 利用者「佐藤花子」がログイン済みで、「Zoomオンライン会議室B」を利用したことがない
    When POST /api/v1/reviews に room_id=vroom-001 を含む評価を送信する
    Then HTTP 403 と「利用した会議室のみ評価できます」というエラーが返る
```

## ティア別仕様

- [利用者・オーナー向けフロントエンド](tier-frontend-user.md)
- [バックエンド API](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../_cross-cutting/api/openapi.yaml)（全 UC 統合、Contract First 開発用）
