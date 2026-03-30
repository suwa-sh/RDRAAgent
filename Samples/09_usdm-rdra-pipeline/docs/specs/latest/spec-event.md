# Spec Event Summary

## Overview

| 項目 | 内容 |
|------|------|
| Event ID | 20260330_185847_spec_generation |
| Created At | 2026-03-30T18:58:47 |
| Source | Spec 生成: RDRA 初期構築 + アーキテクチャ設計 + デザインシステムからの初期 Spec 生成 |
| UC 総数 | 33 |
| API 総数 | 33 |
| 非同期イベント総数 | 1 |
| 業務数 | 7 |
| BUC 数 | 11 |

## UC 一覧

| 業務 | BUC | UC | API数 | 非同期 | インフラ |
|------|-----|-----|:-----:|:-----:|:-------:|
| オーナー管理業務 | オーナー登録フロー | 規約を参照する | 1 | - | - |
| オーナー管理業務 | オーナー登録フロー | オーナーを登録する | 1 | - | - |
| オーナー管理業務 | オーナー登録フロー | オーナー申請する | 1 | - | - |
| オーナー管理業務 | オーナー登録フロー | オーナー登録を審査する | 1 | - | - |
| オーナー管理業務 | オーナー退会フロー | オーナー退会する | 1 | - | - |
| オーナー管理業務 | オーナー退会フロー | 退会を処理する | 1 | - | - |
| 会議室管理業務 | 会議室登録フロー | 会議室を登録する | 1 | - | - |
| 会議室管理業務 | 会議室登録フロー | 運用ルールを設定する | 1 | - | - |
| 会議室管理業務 | 会議室登録フロー | 会議室評価を確認する | 1 | - | - |
| 会議室管理業務 | 会議室登録フロー | プロフィールを編集する | 1 | - | - |
| 予約業務 | 会議室予約フロー | 会議室を照会する | 1 | - | - |
| 予約業務 | 会議室予約フロー | 会議室を予約する | 1 | - | - |
| 予約業務 | 会議室予約フロー | 予約を変更する | 1 | - | - |
| 予約業務 | 会議室予約フロー | 予約を取消する | 1 | - | - |
| 会議室貸出業務 | 会議室貸出フロー | 鍵を受け取る | 1 | - | - |
| 会議室貸出業務 | 会議室貸出フロー | 利用許諾を判定する | 1 | - | - |
| 会議室貸出業務 | 会議室貸出フロー | 鍵を貸出する | 1 | - | - |
| 会議室貸出業務 | 会議室貸出フロー | 鍵を返却する | 1 | - | - |
| 会議室貸出業務 | 会議室貸出フロー | 利用者を評価する | 1 | - | - |
| 会議室貸出業務 | 問合せ対応フロー | オーナーに問合せる | 1 | - | - |
| 会議室貸出業務 | 問合せ対応フロー | 問合せに回答する | 1 | - | - |
| 評価業務 | 評価登録フロー | 評価結果を確認する | 1 | - | - |
| 評価業務 | 評価登録フロー | 会議室を評価する | 1 | - | - |
| 評価業務 | 評価登録フロー | ホストを評価する | 1 | - | - |
| サービス運営業務 | サービス運営管理フロー | 手数料売上を分析する | 1 | - | - |
| サービス運営業務 | サービス運営管理フロー | 運用状況を管理する | 1 | - | - |
| サービス運営業務 | 利用状況管理フロー | 利用履歴を管理する | 1 | - | - |
| サービス運営業務 | 利用状況管理フロー | 利用状況を分析する | 1 | - | - |
| サービス運営業務 | サービス問合せ対応フロー | サービスに問合せる | 1 | - | - |
| サービス運営業務 | サービス問合せ対応フロー | サービス問合せに回答する | 1 | - | - |
| 精算業務 | オーナー精算フロー | 精算結果を確認する | 1 | - | - |
| 精算業務 | オーナー精算フロー | 精算額を計算する | 1 | - | - |
| 精算業務 | オーナー精算フロー | 精算を実行する | 1 | - | - |

## UC ファイル構成

### オーナー管理業務

#### オーナー登録フロー

- **規約を参照する**: spec.md, tier-frontend.md, tier-backend-api.md
- **オーナーを登録する**: spec.md, tier-frontend.md, tier-backend-api.md
- **オーナー申請する**: spec.md, tier-frontend.md, tier-backend-api.md
- **オーナー登録を審査する**: spec.md, tier-frontend.md, tier-backend-api.md

#### オーナー退会フロー

- **オーナー退会する**: spec.md, tier-frontend.md, tier-backend-api.md
- **退会を処理する**: spec.md, tier-frontend.md, tier-backend-api.md

### 会議室管理業務

#### 会議室登録フロー

- **会議室を登録する**: spec.md, tier-frontend.md, tier-backend-api.md
- **運用ルールを設定する**: spec.md, tier-frontend.md, tier-backend-api.md
- **会議室評価を確認する**: spec.md, tier-frontend.md, tier-backend-api.md
- **プロフィールを編集する**: spec.md, tier-frontend.md, tier-backend-api.md

### 予約業務

#### 会議室予約フロー

- **会議室を照会する**: spec.md, tier-frontend.md, tier-backend-api.md
- **会議室を予約する**: spec.md, tier-frontend.md, tier-backend-api.md
- **予約を変更する**: spec.md, tier-frontend.md, tier-backend-api.md
- **予約を取消する**: spec.md, tier-frontend.md, tier-backend-api.md

### 会議室貸出業務

#### 会議室貸出フロー

- **鍵を受け取る**: spec.md, tier-frontend.md, tier-backend-api.md
- **利用許諾を判定する**: spec.md, tier-frontend.md, tier-backend-api.md
- **鍵を貸出する**: spec.md, tier-frontend.md, tier-backend-api.md
- **鍵を返却する**: spec.md, tier-frontend.md, tier-backend-api.md
- **利用者を評価する**: spec.md, tier-frontend.md, tier-backend-api.md

#### 問合せ対応フロー

- **オーナーに問合せる**: spec.md, tier-frontend.md, tier-backend-api.md
- **問合せに回答する**: spec.md, tier-frontend.md, tier-backend-api.md

### 評価業務

#### 評価登録フロー

- **評価結果を確認する**: spec.md, tier-frontend.md, tier-backend-api.md
- **会議室を評価する**: spec.md, tier-frontend.md, tier-backend-api.md
- **ホストを評価する**: spec.md, tier-frontend.md, tier-backend-api.md

### サービス運営業務

#### サービス運営管理フロー

- **手数料売上を分析する**: spec.md, tier-frontend.md, tier-backend-api.md
- **運用状況を管理する**: spec.md, tier-frontend.md, tier-backend-api.md

#### 利用状況管理フロー

- **利用履歴を管理する**: spec.md, tier-frontend.md, tier-backend-api.md
- **利用状況を分析する**: spec.md, tier-frontend.md, tier-backend-api.md

#### サービス問合せ対応フロー

- **サービスに問合せる**: spec.md, tier-frontend.md, tier-backend-api.md
- **サービス問合せに回答する**: spec.md, tier-frontend.md, tier-backend-api.md

### 精算業務

#### オーナー精算フロー

- **精算結果を確認する**: spec.md, tier-frontend.md, tier-backend-api.md
- **精算額を計算する**: spec.md, tier-frontend.md, tier-backend-api.md, tier-backend-worker.md
- **精算を実行する**: spec.md, tier-frontend.md, tier-backend-api.md, tier-backend-worker.md

## 全体横断仕様

### UX Design

- User Flows: 4
- IA Pages: 33
- Psychology Principles: 8

### UI Design

- Layout Patterns: 3
- Responsive Breakpoints: 4
- Component Guidelines: 11

### Data Visualization

- Target Screens: 4
- Chart Types: 6
