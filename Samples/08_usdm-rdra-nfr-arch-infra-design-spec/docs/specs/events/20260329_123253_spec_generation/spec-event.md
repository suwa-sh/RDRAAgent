# Spec Event Summary

## Overview

| 項目 | 内容 |
|------|------|
| Event ID | 20260329_123253_spec_generation |
| Created At | 2026-03-29T12:32:53 |
| Source | RDRA モデル・NFR グレード・アーキテクチャ設計・デザインシステムからの Spec 一括生成 |
| UC 総数 | 46 |
| API 総数 | 52 |
| 非同期イベント総数 | 4 |
| 業務数 | 5 |
| BUC 数 | 10 |

## UC 一覧

| 業務 | BUC | UC | API数 | 非同期 | インフラ |
|------|-----|-----|:-----:|:-----:|:-------:|
| オーナー管理業務 | オーナー登録管理フロー | オーナー情報を変更する | 1 | - | - |
| オーナー管理業務 | オーナー登録管理フロー | オーナー登録を審査する | 1 | - | - |
| オーナー管理業務 | オーナー登録管理フロー | オーナー登録申請を行う | 1 | - | - |
| オーナー管理業務 | オーナー登録管理フロー | 退会を申請する | 1 | - | - |
| サービス運営業務 | サービス運営管理フロー | オーナー登録審査一覧を確認する | 2 | - | - |
| サービス運営業務 | サービス運営管理フロー | 手数料売上を分析する | 2 | - | - |
| サービス運営業務 | 問合せ管理フロー | サービスへ問合せする | 2 | - | - |
| サービス運営業務 | 問合せ管理フロー | 問合せに対応する | 3 | - | - |
| サービス運営業務 | 利用状況管理フロー | 利用状況を分析する | 1 | - | - |
| サービス運営業務 | 利用状況管理フロー | 利用履歴を管理する | 1 | - | - |
| 会議室管理業務 | 会議室管理フロー | キャンセルポリシーを設定する | 1 | - | - |
| 会議室管理業務 | 会議室管理フロー | バーチャル会議室を登録する | 1 | - | - |
| 会議室管理業務 | 会議室管理フロー | 運用ルールを設定する | 1 | - | - |
| 会議室管理業務 | 会議室管理フロー | 会議室の公開状態を変更する | 1 | - | - |
| 会議室管理業務 | 会議室管理フロー | 会議室の評価を確認する | 1 | - | - |
| 会議室管理業務 | 会議室管理フロー | 会議室を登録する | 1 | - | - |
| 会議室管理業務 | 会議室管理フロー | 会議室情報を変更する | 1 | - | - |
| 会議室貸出業務 | 会議室貸出管理フロー | オーナーへ問合せを送信する | 1 | - | - |
| 会議室貸出業務 | 会議室貸出管理フロー | バーチャル会議室利用を開始する | 1 | - | - |
| 会議室貸出業務 | 会議室貸出管理フロー | バーチャル会議室利用を終了する | 1 | - | - |
| 会議室貸出業務 | 会議室貸出管理フロー | 会議URLを通知する | 1 | - | - |
| 会議室貸出業務 | 会議室貸出管理フロー | 鍵の貸出を記録する | 1 | - | - |
| 会議室貸出業務 | 会議室貸出管理フロー | 鍵の返却を記録する | 1 | - | - |
| 会議室貸出業務 | 会議室貸出管理フロー | 問合せに回答する | 1 | - | - |
| 会議室貸出業務 | 会議室貸出管理フロー | 予約を審査する | 1 | - | - |
| 会議室貸出業務 | 会議室貸出管理フロー | 利用者の評価を確認する | 1 | - | - |
| 会議室貸出業務 | 会議室貸出管理フロー | 利用者を評価する | 1 | - | - |
| 会議室利用業務 | 会議室評価フロー | オーナーを評価する | 1 | - | - |
| 会議室利用業務 | 会議室評価フロー | バーチャル会議室オーナーを評価する | 1 | - | - |
| 会議室利用業務 | 会議室評価フロー | バーチャル会議室を評価する | 1 | - | - |
| 会議室利用業務 | 会議室評価フロー | 会議室を評価する | 1 | - | - |
| 会議室利用業務 | 会議室予約フロー | オーナーへ問合せする | 1 | - | - |
| 会議室利用業務 | 会議室予約フロー | バーチャル会議室を予約する | 1 | - | - |
| 会議室利用業務 | 会議室予約フロー | 会議室の詳細を確認する | 1 | - | - |
| 会議室利用業務 | 会議室予約フロー | 会議室を検索する | 1 | - | - |
| 会議室利用業務 | 会議室予約フロー | 決済方法を設定する | 1 | - | - |
| 会議室利用業務 | 会議室予約フロー | 予約を許諾する | 1 | - | - |
| 会議室利用業務 | 会議室予約フロー | 予約を取り消す | 1 | - | - |
| 会議室利用業務 | 会議室予約フロー | 予約を申請する | 1 | - | - |
| 会議室利用業務 | 会議室予約フロー | 予約を変更する | 1 | - | - |
| 精算業務 | オーナー精算フロー | 精算を実行する | 2 | - | - |
| 精算業務 | オーナー精算フロー | 精算額を計算する | 2 | - | - |
| 精算業務 | オーナー精算フロー | 精算結果を確認する | 2 | - | - |
| 精算業務 | 利用実績管理フロー | 売上実績を確認する | 1 | - | - |
| 精算業務 | 利用実績管理フロー | 利用回数を確認する | 1 | - | - |
| 精算業務 | 利用実績管理フロー | 利用者評価一覧を確認する | 1 | - | - |

## UC ファイル構成

### オーナー管理業務

#### オーナー登録管理フロー

- **オーナー情報を変更する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **オーナー登録を審査する**: spec.md, tier-backend-api.md, tier-frontend-admin.md
- **オーナー登録申請を行う**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **退会を申請する**: spec.md, tier-backend-api.md, tier-frontend-user.md

### サービス運営業務

#### サービス運営管理フロー

- **オーナー登録審査一覧を確認する**: spec.md, tier-backend-api.md, tier-frontend-admin.md
- **手数料売上を分析する**: spec.md, tier-backend-api.md, tier-frontend-admin.md

#### 問合せ管理フロー

- **サービスへ問合せする**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **問合せに対応する**: spec.md, tier-backend-api.md, tier-frontend-admin.md

#### 利用状況管理フロー

- **利用状況を分析する**: spec.md, tier-backend-api.md, tier-frontend-admin.md
- **利用履歴を管理する**: spec.md, tier-backend-api.md, tier-frontend-admin.md

### 会議室管理業務

#### 会議室管理フロー

- **キャンセルポリシーを設定する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **バーチャル会議室を登録する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **運用ルールを設定する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **会議室の公開状態を変更する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **会議室の評価を確認する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **会議室を登録する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **会議室情報を変更する**: spec.md, tier-backend-api.md, tier-frontend-user.md

### 会議室貸出業務

#### 会議室貸出管理フロー

- **オーナーへ問合せを送信する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **バーチャル会議室利用を開始する**: spec.md, tier-backend-api.md, tier-cronjob-worker.md
- **バーチャル会議室利用を終了する**: spec.md, tier-backend-api.md, tier-cronjob-worker.md
- **会議URLを通知する**: spec.md, tier-backend-api.md, tier-faas-worker.md, tier-frontend-user.md
- **鍵の貸出を記録する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **鍵の返却を記録する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **問合せに回答する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **予約を審査する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **利用者の評価を確認する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **利用者を評価する**: spec.md, tier-backend-api.md, tier-frontend-user.md

### 会議室利用業務

#### 会議室評価フロー

- **オーナーを評価する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **バーチャル会議室オーナーを評価する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **バーチャル会議室を評価する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **会議室を評価する**: spec.md, tier-backend-api.md, tier-frontend-user.md

#### 会議室予約フロー

- **オーナーへ問合せする**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **バーチャル会議室を予約する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **会議室の詳細を確認する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **会議室を検索する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **決済方法を設定する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **予約を許諾する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **予約を取り消す**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **予約を申請する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **予約を変更する**: spec.md, tier-backend-api.md, tier-frontend-user.md

### 精算業務

#### オーナー精算フロー

- **精算を実行する**: spec.md, tier-backend-api.md, tier-faas-worker.md, tier-frontend-admin.md
- **精算額を計算する**: spec.md, tier-backend-api.md, tier-frontend-admin.md
- **精算結果を確認する**: spec.md, tier-backend-api.md, tier-frontend-user.md

#### 利用実績管理フロー

- **売上実績を確認する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **利用回数を確認する**: spec.md, tier-backend-api.md, tier-frontend-user.md
- **利用者評価一覧を確認する**: spec.md, tier-backend-api.md, tier-frontend-user.md

## 全体横断仕様

### UX Design

- User Flows: 6
- IA Pages: 25
- Psychology Principles: 10

### UI Design

- Layout Patterns: 3
- Responsive Breakpoints: 3
- Component Guidelines: 14

### Data Visualization

- Target Screens: 4
- Chart Types: 5
