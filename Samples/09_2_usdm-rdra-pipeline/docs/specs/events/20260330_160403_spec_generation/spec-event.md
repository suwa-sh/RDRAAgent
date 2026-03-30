# Spec Event Summary

## Overview

| 項目 | 内容 |
|------|------|
| Event ID | 20260330_160403_spec_generation |
| Created At | 2026-03-30T16:04:03 |
| Source | Spec 生成: RDRA/NFR/Arch/Design モデルから UC 単位の詳細仕様と全体横断 UX/UI 設計仕様を初期生成 |
| UC 総数 | 28 |
| API 総数 | 28 |
| 非同期イベント総数 | 2 |
| 業務数 | 8 |
| BUC 数 | 14 |

## UC 一覧

| 業務 | BUC | UC | API数 | 非同期 | インフラ |
|------|-----|-----|:-----:|:-----:|:-------:|
| オーナー管理業務 | オーナー登録フロー | オーナーを登録する | 1 | - | - |
| オーナー管理業務 | オーナー登録フロー | 規約を参照する | 1 | - | - |
| オーナー管理業務 | オーナー登録フロー | オーナー申請する | 1 | - | - |
| オーナー管理業務 | オーナー登録フロー | オーナー申請を審査する | 1 | - | - |
| オーナー管理業務 | オーナー退会フロー | オーナー退会する | 1 | - | - |
| 会議室管理業務 | 会議室登録フロー | 会議室を登録する | 1 | - | - |
| 会議室管理業務 | 会議室登録フロー | 運用ルールを設定する | 1 | - | - |
| 会議室管理業務 | 会議室評価確認フロー | 会議室評価を確認する | 1 | - | - |
| 会議室貸出業務 | 会議室貸出フロー | 利用者使用許諾する | 1 | - | - |
| 会議室貸出業務 | 会議室貸出フロー | 鍵を貸し出す | 1 | - | - |
| 会議室貸出業務 | 会議室貸出フロー | 鍵を返却する | 1 | - | - |
| 会議室貸出業務 | 会議室貸出フロー | 利用者評価を登録する | 1 | - | - |
| 会議室貸出業務 | 問合せ対応フロー | 問合せを送信する | 1 | - | - |
| 会議室貸出業務 | 問合せ対応フロー | 問合せに回答する | 1 | - | - |
| 会議室予約業務 | 会議室予約フロー | 会議室を照会する | 1 | - | - |
| 会議室予約業務 | 会議室予約フロー | 会議室を予約する | 1 | - | - |
| 会議室予約業務 | 予約変更取消フロー | 予約を変更する | 1 | - | - |
| 会議室予約業務 | 予約変更取消フロー | 予約を取消する | 1 | - | - |
| 評価管理業務 | 評価登録フロー | 評価を登録する | 1 | - | - |
| 利用実績管理業務 | 利用実績管理フロー | 利用実績を確認する | 1 | - | - |
| 利用実績管理業務 | 利用実績管理フロー | 売上実績を確認する | 1 | - | - |
| サービス運営業務 | サービス運営管理フロー | 手数料売上を分析する | 1 | - | - |
| サービス運営業務 | 利用状況管理フロー | 利用履歴を管理する | 1 | - | - |
| サービス運営業務 | 利用状況管理フロー | 利用状況を分析する | 1 | - | - |
| サービス運営業務 | サービス問合せ対応フロー | サービス問合せを送信する | 1 | - | - |
| サービス運営業務 | サービス問合せ対応フロー | サービス問合せに対応する | 1 | - | - |
| 精算業務 | オーナー精算フロー | 精算内容を確認する | 1 | - | - |
| 精算業務 | オーナー精算フロー | オーナー精算を実行する | 1 | - | - |

## UC ファイル構成

### オーナー管理業務

#### オーナー登録フロー

- **オーナーを登録する**: spec.md, tier-frontend.md, tier-backend-api.md
- **規約を参照する**: spec.md, tier-frontend.md, tier-backend-api.md
- **オーナー申請する**: spec.md, tier-frontend.md, tier-backend-api.md
- **オーナー申請を審査する**: spec.md, tier-frontend.md, tier-backend-api.md

#### オーナー退会フロー

- **オーナー退会する**: spec.md, tier-frontend.md, tier-backend-api.md

### 会議室管理業務

#### 会議室登録フロー

- **会議室を登録する**: spec.md, tier-frontend.md, tier-backend-api.md
- **運用ルールを設定する**: spec.md, tier-frontend.md, tier-backend-api.md

#### 会議室評価確認フロー

- **会議室評価を確認する**: spec.md, tier-frontend.md, tier-backend-api.md

### 会議室貸出業務

#### 会議室貸出フロー

- **利用者使用許諾する**: spec.md, tier-frontend.md, tier-backend-api.md
- **鍵を貸し出す**: spec.md, tier-frontend.md, tier-backend-api.md
- **鍵を返却する**: spec.md, tier-frontend.md, tier-backend-api.md
- **利用者評価を登録する**: spec.md, tier-frontend.md, tier-backend-api.md

#### 問合せ対応フロー

- **問合せを送信する**: spec.md, tier-frontend.md, tier-backend-api.md
- **問合せに回答する**: spec.md, tier-frontend.md, tier-backend-api.md

### 会議室予約業務

#### 会議室予約フロー

- **会議室を照会する**: spec.md, tier-frontend.md, tier-backend-api.md
- **会議室を予約する**: spec.md, tier-frontend.md, tier-backend-api.md

#### 予約変更取消フロー

- **予約を変更する**: spec.md, tier-frontend.md, tier-backend-api.md
- **予約を取消する**: spec.md, tier-frontend.md, tier-backend-api.md

### 評価管理業務

#### 評価登録フロー

- **評価を登録する**: spec.md, tier-frontend.md, tier-backend-api.md

### 利用実績管理業務

#### 利用実績管理フロー

- **利用実績を確認する**: spec.md, tier-frontend.md, tier-backend-api.md
- **売上実績を確認する**: spec.md, tier-frontend.md, tier-backend-api.md

### サービス運営業務

#### サービス運営管理フロー

- **手数料売上を分析する**: spec.md, tier-frontend.md, tier-backend-api.md

#### 利用状況管理フロー

- **利用履歴を管理する**: spec.md, tier-frontend.md, tier-backend-api.md
- **利用状況を分析する**: spec.md, tier-frontend.md, tier-backend-api.md

#### サービス問合せ対応フロー

- **サービス問合せを送信する**: spec.md, tier-frontend.md, tier-backend-api.md
- **サービス問合せに対応する**: spec.md, tier-frontend.md, tier-backend-api.md

### 精算業務

#### オーナー精算フロー

- **精算内容を確認する**: spec.md, tier-frontend.md, tier-backend-api.md
- **オーナー精算を実行する**: spec.md, tier-frontend.md, tier-backend-api.md, tier-backend-worker.md

## 全体横断仕様

### UX Design

- User Flows: 5
- IA Pages: 28
- Psychology Principles: 10

### UI Design

- Layout Patterns: 3
- Responsive Breakpoints: 3
- Component Guidelines: 15

### Data Visualization

- Target Screens: 4
- Chart Types: 6
