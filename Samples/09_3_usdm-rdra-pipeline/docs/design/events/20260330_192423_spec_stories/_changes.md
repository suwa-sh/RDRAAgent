# Changes: Spec Stories (20260330_192423)

## New Common Components (TSX)

- `src/components/common/ProcessingState.tsx` - Async processing spinner with optional progress bar
- `src/components/common/SearchFilterPanel.tsx` - Reusable search/filter panel
- `src/components/common/PaginatedList.tsx` - Paginated list wrapper
- `src/components/common/EntityEditForm.tsx` - Generic entity edit form

## New Common Component Stories

- `Common/EmptyState` - Default, WithAction, WithIcon
- `Common/LoadingSkeleton` - CardVariant, TableVariant, FormVariant
- `Common/ErrorBanner` - Default, WithoutRetry
- `Common/ConfirmActionModal` - Default, Destructive
- `Common/ProcessingState` - Default, WithProgress
- `Common/SearchFilterPanel` - Default
- `Common/PaginatedList` - Default
- `Common/EntityEditForm` - Default

## New Layout Stories

- `Layout/PortalShell` - UserPortal, OwnerPortal, AdminPortal

## New Page Stories

### User Portal (7 new, 2 existing)

| Screen | Story File | Status |
|--------|-----------|--------|
| 会議室検索画面 | RoomSearch.stories.tsx | existing |
| 予約申込画面 | BookingCreate.stories.tsx | existing |
| 予約変更画面 | BookingEdit.stories.tsx | **new** |
| 予約取消画面 | BookingCancel.stories.tsx | **new** |
| 鍵受取確認画面 | KeyReceive.stories.tsx | **new** |
| 問合せ送信画面 | InquirySend.stories.tsx | **new** |
| 会議室評価画面 | ReviewRoom.stories.tsx | **new** |
| ホスト評価画面 | ReviewHost.stories.tsx | **new** |
| サービス問合せ画面 | ServiceInquiry.stories.tsx | **new** |

### Owner Portal (13 new, 2 existing)

| Screen | Story File | Status |
|--------|-----------|--------|
| 規約参照画面 | Terms.stories.tsx | **new** |
| オーナー登録画面 | OwnerRegister.stories.tsx | **new** |
| オーナー申請画面 | OwnerApply.stories.tsx | **new** |
| 会議室登録画面 | RoomRegister.stories.tsx | existing |
| 運用ルール設定画面 | RoomRules.stories.tsx | **new** |
| 評価確認画面 | RoomReviews.stories.tsx | **new** |
| プロフィール編集画面 | ProfileEdit.stories.tsx | **new** |
| 利用許諾画面 | ReservationApprove.stories.tsx | **new** |
| 鍵貸出画面 | KeyLend.stories.tsx | **new** |
| 鍵返却画面 | KeyReturn.stories.tsx | **new** |
| 利用者評価画面 | ReviewGuest.stories.tsx | **new** |
| 問合せ回答画面 | InquiryReply.stories.tsx | **new** |
| 退会申請画面 | Withdraw.stories.tsx | **new** |
| 精算結果確認画面 | SettlementResult.stories.tsx | existing |
| 評価結果一覧画面 | ReviewResults.stories.tsx | **new** |

### Admin Portal (7 new, 2 existing)

| Screen | Story File | Status |
|--------|-----------|--------|
| オーナー審査画面 | OwnerReview.stories.tsx | existing |
| 退会処理画面 | WithdrawProcess.stories.tsx | **new** |
| 手数料分析画面 | CommissionAnalysis.stories.tsx | **new** |
| 運用管理ダッシュボード | Dashboard.stories.tsx | existing |
| 利用履歴管理画面 | UsageHistory.stories.tsx | **new** |
| 利用状況分析画面 | UsageAnalysis.stories.tsx | **new** |
| サービス問合せ回答画面 | ServiceInquiryReply.stories.tsx | **new** |
| 精算処理画面 | SettlementProcess.stories.tsx | **new** |
| 精算実行画面 | SettlementExecute.stories.tsx | **new** |

## Summary

- **Total page stories**: 33 (6 existing + 27 new)
- **Total common component stories**: 8 (all new)
- **Total layout stories**: 1 (3 variants, all new)
- **Storybook build**: SUCCESS
