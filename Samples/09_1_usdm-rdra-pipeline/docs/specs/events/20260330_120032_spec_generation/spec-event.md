# Spec Event Summary

## Overview

| 項目 | 内容 |
|------|------|
| Event ID | 20260330_120032_spec_generation |
| Created At | 2026-03-30T12:00:32 |
| Source | Spec 生成: 貸し会議室サービス RoomConnect の初期 Spec 生成 |
| UC 総数 | 23 |
| API 総数 | 23 |
| 非同期イベント総数 | 2 |
| 業務数 | 6 |
| BUC 数 | 8 |

## UC 一覧

| 業務 | BUC | UC | API数 | 非同期 | インフラ |
|------|-----|-----|:-----:|:-----:|:-------:|
| オーナー管理業務 | オーナー登録フロー | プロフィールを登録する | 1 | - | - |
| オーナー管理業務 | オーナー登録フロー | オーナー申請を登録する | 1 | - | - |
| オーナー管理業務 | オーナー登録フロー | オーナー申請を審査する | 1 | - | - |
| オーナー管理業務 | オーナー退会フロー | 退会を申請する | 1 | - | - |
| オーナー管理業務 | オーナー退会フロー | 退会を処理する | 1 | - | - |
| 会議室管理業務 | 会議室登録フロー | 会議室を登録する | 1 | - | - |
| 会議室管理業務 | 会議室登録フロー | 運用ルールを設定する | 1 | - | - |
| 会議室管理業務 | 会議室登録フロー | 会議室評価を照会する | 1 | - | - |
| 会議室貸出業務 | 会議室貸出フロー | 利用者評価を照会する | 1 | - | - |
| 会議室貸出業務 | 会議室貸出フロー | 鍵の貸出を記録する | 1 | - | - |
| 会議室貸出業務 | 会議室貸出フロー | 鍵の返却を記録する | 1 | - | - |
| 会議室貸出業務 | 会議室貸出フロー | 利用者評価を登録する | 1 | - | - |
| 会議室貸出業務 | 会議室貸出フロー | 問合せ回答を登録する | 1 | - | - |
| 会議室予約業務 | 会議室予約フロー | 会議室を検索する | 1 | - | - |
| 会議室予約業務 | 会議室予約フロー | 予約を登録する | 1 | - | - |
| 会議室予約業務 | 予約変更取消フロー | 予約を変更する | 1 | - | - |
| 会議室予約業務 | 予約変更取消フロー | 予約を取消する | 1 | - | - |
| 評価業務 | 利用者評価登録フロー | 会議室評価を登録する | 1 | - | - |
| サービス運営業務 | 売上分析フロー | 手数料売上を照会する | 1 | - | - |
| サービス運営業務 | 利用状況管理フロー | 利用状況を照会する | 1 | - | - |
| サービス運営業務 | 問合せ対応フロー | 問合せ対応を登録する | 1 | - | - |
| 精算業務 | オーナー精算フロー | 精算額を計算する | 1 | - | - |
| 精算業務 | オーナー精算フロー | 精算を実行する | 1 | - | - |

## UC ファイル構成

### オーナー管理業務

#### オーナー登録フロー

- **プロフィールを登録する**: spec.md, tier-frontend.md, tier-backend-api.md
- **オーナー申請を登録する**: spec.md, tier-frontend.md, tier-backend-api.md
- **オーナー申請を審査する**: spec.md, tier-frontend.md, tier-backend-api.md

#### オーナー退会フロー

- **退会を申請する**: spec.md, tier-frontend.md, tier-backend-api.md
- **退会を処理する**: spec.md, tier-frontend.md, tier-backend-api.md

### 会議室管理業務

#### 会議室登録フロー

- **会議室を登録する**: spec.md, tier-frontend.md, tier-backend-api.md
- **運用ルールを設定する**: spec.md, tier-frontend.md, tier-backend-api.md
- **会議室評価を照会する**: spec.md, tier-frontend.md, tier-backend-api.md

### 会議室貸出業務

#### 会議室貸出フロー

- **利用者評価を照会する**: spec.md, tier-frontend.md, tier-backend-api.md
- **鍵の貸出を記録する**: spec.md, tier-frontend.md, tier-backend-api.md
- **鍵の返却を記録する**: spec.md, tier-frontend.md, tier-backend-api.md
- **利用者評価を登録する**: spec.md, tier-frontend.md, tier-backend-api.md
- **問合せ回答を登録する**: spec.md, tier-frontend.md, tier-backend-api.md

### 会議室予約業務

#### 会議室予約フロー

- **会議室を検索する**: spec.md, tier-frontend.md, tier-backend-api.md
- **予約を登録する**: spec.md, tier-frontend.md, tier-backend-api.md

#### 予約変更取消フロー

- **予約を変更する**: spec.md, tier-frontend.md, tier-backend-api.md
- **予約を取消する**: spec.md, tier-frontend.md, tier-backend-api.md

### 評価業務

#### 利用者評価登録フロー

- **会議室評価を登録する**: spec.md, tier-frontend.md, tier-backend-api.md

### サービス運営業務

#### 売上分析フロー

- **手数料売上を照会する**: spec.md, tier-frontend.md, tier-backend-api.md

#### 利用状況管理フロー

- **利用状況を照会する**: spec.md, tier-frontend.md, tier-backend-api.md

#### 問合せ対応フロー

- **問合せ対応を登録する**: spec.md, tier-frontend.md, tier-backend-api.md

### 精算業務

#### オーナー精算フロー

- **精算額を計算する**: spec.md, tier-frontend.md, tier-backend-api.md
- **精算を実行する**: spec.md, tier-frontend.md, tier-backend-api.md, tier-worker.md

## 全体横断仕様

### UX Design

- User Flows: 5
- IA Pages: 24
- Psychology Principles: 8

### UI Design

- Layout Patterns: 3
- Responsive Breakpoints: 3
- Component Guidelines: 8

### Data Visualization

- Target Screens: 3
- Chart Types: 4
