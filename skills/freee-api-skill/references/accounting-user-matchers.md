# User matchers

## 概要

自動登録ルール

## エンドポイント一覧

### GET /api/1/user_matchers

操作: 自動登録ルール一覧の取得

説明: 概要 指定した事業所の自動登録ルール一覧を取得する 自動登録ルールとは、口座から同期された明細（入出金データ）の内容をもとに、取引や振替の登録・推測を自動で行うためのルールです。 注意点 activeパラメータを指定しない場合は、有効な自動登録ルールのみが返ります。無効なルールも含めて取得する場合はactive=allを指定してください。 一覧は自動登録ルールID（id）の降順で返ります。 walletableパラメータは口座名の完全一致で絞り込みます。指定した名前の口座が事業所に存在しない場合は空の一覧が返ります。 offsetはlimitの倍数である必要があります。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| company_id | query | はい | integer(int64) | 事業所ID |
| limit | query | いいえ | integer(int64) | 取得レコードの件数 (デフォルト: 30, 最大: 100) |
| offset | query | いいえ | integer(int64) | 取得レコードのオフセット (デフォルト: 0)。offsetはlimitの倍数である必要があります。 |
| walletable | query | いいえ | string | 口座名で絞込 (完全一致)。指定した名前の口座が事業所に存在しない場合は空の一覧が返ります。 |
| description | query | いいえ | string | 説明文で絞込 (部分一致) |
| active | query | いいえ | string | 有効/無効/全てで絞込 (有効: active, 無効: inactive, 全て: all)。未指定の場合は有効なルールのみが返ります。 (選択肢: active, inactive, all) |
| act | query | いいえ | integer(int64) | 登録タイプで絞込
* 0: 取引を推測する(manual_standard)
* 1: 取引を登録する(auto_standard)
* 2: 振替を推測する(manual_transfer)
* 3: 振替を登録する(auto_transfer)
* 4: 無視する取引を登録する(auto_ignore)
* 5: 取引テンプレートを推測する(manual_template)
* 6: 未決済取引の消込を推測する(manual_scrub)
* 7: 未決済取引の消込を登録する(auto_scrub)
* 8: 一括振込ファイル消込を推測する(manual_output_zengin_scrub)
* 9: 一括振込ファイル消込を登録する(auto_output_zengin_scrub)
* 10: 無視する取引を推測する(manual_ignore)
* 11: プライベート取引を推測する(manual_private)
* 12: プライベート取引を登録する(auto_private)
 (選択肢: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12) |
| created_by | query | いいえ | integer(int64) | 作成経由で絞込
* 0: ユーザーが作成(user)
* 1: freeeが作成(freee)
 (選択肢: 0, 1) |
| min_amount | query | いいえ | integer(int64) | 最小金額で絞込 (単位: 円)。ルールに設定された最小金額(min_amount)が指定値以上のルールを返します。 |
| max_amount | query | いいえ | integer(int64) | 最大金額で絞込 (単位: 円)。ルールに設定された最大金額(max_amount)が指定値以下のルールを返します。 |
| min_priority | query | いいえ | integer(int64) | 最小優先度で絞込。優先度(priority)が指定値以上のルールを返します。 |
| max_priority | query | いいえ | integer(int64) | 最大優先度で絞込。優先度(priority)が指定値以下のルールを返します。 |
| min_corrected_wallet_txn_count | query | いいえ | integer(int64) | 最小正答件数で絞込。適用明細数(corrected_wallet_txn_count)が指定値以上のルールを返します。 |
| max_corrected_wallet_txn_count | query | いいえ | integer(int64) | 最大正答件数で絞込。適用明細数(corrected_wallet_txn_count)が指定値以下のルールを返します。 |
| min_corrected_wallet_txn_count_percentage | query | いいえ | integer(int64) | 最小正答率で絞込 (単位: パーセント)。適用率(corrected_wallet_txn_count_percentage)が指定値以上のルールを返します。 |
| max_corrected_wallet_txn_count_percentage | query | いいえ | integer(int64) | 最大正答率で絞込 (単位: パーセント)。適用率(corrected_wallet_txn_count_percentage)が指定値以下のルールを返します。 |
| card_label_id | query | いいえ | integer(int64) | カードラベルIDで絞込 |
| entry_side_str | query | いいえ | string | 入金/出金で絞込 (入金: income, 出金: expense) (選択肢: income, expense) |

### レスポンス (200)

- data (必須): array[object]
  配列の要素:
    - id (必須): integer(int64) - 自動登録ルールID 例: `101` (最小: 1)
    - entry_side_str (必須): string - 入金/出金
* income: 入金
* expense: 出金
 (選択肢: income, expense) 例: `expense`
    - description (必須): string - 説明文。明細の取引内容とのマッチングに使用される文字列です。condition=4(指定なし)の場合は空文字列が返ります。 例: `スターバックス`
    - condition (必須): integer - マッチ条件
* 0: 部分一致(partial)
* 1: 前方一致(forward)
* 2: 後方一致(backward)
* 3: 完全一致(exact)
* 4: 指定なし(wildcard)
 (選択肢: 0, 1, 2, 3, 4) 例: `0`
    - priority (必須): integer - 優先度 例: `10`
    - act (必須): integer - 登録タイプ
* 0: 取引を推測する(manual_standard)
* 1: 取引を登録する(auto_standard)
* 2: 振替を推測する(manual_transfer)
* 3: 振替を登録する(auto_transfer)
* 4: 無視する取引を登録する(auto_ignore)
* 5: 取引テンプレートを推測する(manual_template)
* 6: 未決済取引の消込を推測する(manual_scrub)
* 7: 未決済取引の消込を登録する(auto_scrub)
* 8: 一括振込ファイル消込を推測する(manual_output_zengin_scrub)
* 9: 一括振込ファイル消込を登録する(auto_output_zengin_scrub)
* 10: 無視する取引を推測する(manual_ignore)
* 11: プライベート取引を推測する(manual_private)
* 12: プライベート取引を登録する(auto_private)

actの種類により、返されるフィールド（tax_name、account_item_name、deal_description等）が異なります。
 (選択肢: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12) 例: `1`
    - tax_name (任意): string - 税区分名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `課対仕入10%`
    - min_amount (任意): integer - 最小金額 (単位: 円)。ルールが未設定の場合はnullが返ります。 例: `1000`
    - max_amount (任意): integer - 最大金額 (単位: 円)。ルールが未設定の場合はnullが返ります。 例: `10000`
    - deal_description (任意): string - 取引の備考
act=0,1,2,3の場合のみ値が返ります。act=4,10,11,12では常にnullです。
 例: `打ち合わせ用コーヒー代`
    - walletable (任意): string - 口座名 例: `事業用口座`
    - transfer_walletable (任意): string - 振替先口座名
act=2,3(振替を推測/登録)の場合のみ値が返ります。
 例: `事業用クレジットカード`
    - account_item_name (任意): string - 勘定科目名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `会議費`
    - partner_name (任意): string - 取引先名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `スターバックス`
    - item_name (任意): string - 品目名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `コーヒー豆`
    - section_name (任意): string - 部門名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `営業部`
    - division_tag_1_name (任意): string - セグメント1タグ名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `東日本`
    - division_tag_2_name (任意): string - セグメント2タグ名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `小売事業`
    - division_tag_3_name (任意): string - セグメント3タグ名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `第一営業所`
    - default_tag_names (任意): array[string] - メモタグ名の配列
act=0,1(取引を推測/登録)の場合のみ値が返ります。メモタグが1つも設定されていない場合はnullが返ります。
 例: `["出張","会議"]`
    - last_updated_user_id (任意): integer - 最終更新ユーザーID
* 0: freeeシステムによる更新
 例: `1`
    - user_name (任意): string - 最終更新ユーザー名。表示名が未設定の場合はメールアドレスが返ります。freeeシステムによる更新の場合は「freee」、ユーザー情報を取得できない場合は「-」が返ります。 例: `freee 太郎`
    - updated_at (任意): string - 更新日 (yyyy-mm-dd) 例: `2026-08-01`
    - corrected_wallet_txn_count (任意): integer - 適用明細数(正答件数)。統計情報が存在しない場合はnullが返ります。 例: `10`
    - corrected_wallet_txn_count_percentage (任意): integer - 適用率(正答率、パーセント)。統計情報が存在しない場合はnullが返ります。 例: `80`
    - qualified_invoice_setting (任意): string - 適格請求書等
* non_qualified: 該当しない
* qualified: 該当する
* depends_on_partner: 取引先情報に準拠
 (選択肢: non_qualified, qualified, depends_on_partner) 例: `qualified`
    - suggest_tax_from_walletable_invoice (任意): boolean - 購入データ原本に準拠
* true: 準拠する
* false: 準拠しない
 例: `false`
    - card_label (任意): string - カードラベル 例: `本人`
    - card_label_id (任意): integer(int64) - カードラベルID 例: `1`
    - active (必須): boolean - 有効/無効
* true: 有効
* false: 無効
 例: `true`

### POST /api/1/user_matchers

操作: 自動登録ルールの作成

説明: 概要 指定した事業所の自動登録ルールを作成する 注意点 company_idはリクエストボディではなくクエリパラメータで指定します。 act=0,1（取引を推測/登録）の場合は、tax_name（税区分名）とaccount_item_name（勘定科目名）の指定が必須です。 登録タイプ（act）が5(manual_template), 6(manual_scrub), 7(auto_scrub), 8(manual_output_zengin_scrub), 9(auto_output_zengin_scrub)の自動登録ルールは、このAPIでは作成できません。 同じ内容の自動登録ルールが既に存在する場合は、400エラーが返ります。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| company_id | query | はい | integer(int64) | 事業所ID |

### リクエストボディ

(必須)

- act (必須): integer - 登録タイプ
* 0: 取引を推測する(manual_standard)
* 1: 取引を登録する(auto_standard)
* 2: 振替を推測する(manual_transfer)
* 3: 振替を登録する(auto_transfer)
* 4: 無視する取引を登録する(auto_ignore)
* 10: 無視する取引を推測する(manual_ignore)
* 11: プライベート取引を推測する(manual_private)
* 12: プライベート取引を登録する(auto_private)

このAPIでは以下のactは非対応です:
5(manual_template), 6(manual_scrub), 7(auto_scrub), 8(manual_output_zengin_scrub), 9(auto_output_zengin_scrub)
 (選択肢: 0, 1, 2, 3, 4, 10, 11, 12) 例: `1`
- active (必須): boolean - 有効/無効
* true: 有効
* false: 無効
 例: `true`
- condition (必須): integer - マッチ条件
* 0: 部分一致(partial)
* 1: 前方一致(forward)
* 2: 後方一致(backward)
* 3: 完全一致(exact)
* 4: 指定なし(wildcard)
 (選択肢: 0, 1, 2, 3, 4) 例: `0`
- description (必須): string - 説明文。明細の取引内容とマッチングする文字列を指定します。condition=4(指定なし)の場合は無視されます。 例: `スターバックス`
- entry_side_str (必須): string - 入金/出金
* income: 入金
* expense: 出金
 (選択肢: income, expense) 例: `expense`
- priority (必須): integer - 優先度 例: `10`
- tax_name (任意): string - 税区分名
act=0,1(取引を推測/登録)の場合は必須。他のactでは指定しても無視されます。
 例: `課対仕入10%`
- walletable (任意): string - 口座名。事業所に登録されている口座の名前を指定します。 例: `事業用口座`
- card_label (任意): string - カードラベル 例: `本人`
- card_label_id (任意): integer - カードラベルID 例: `1`
- transfer_walletable (任意): string - 振替先口座名
act=2,3(振替を推測/登録)の場合に使用。他のactでは指定しても無視されます。
 例: `事業用クレジットカード`
- min_amount (任意): integer - 最小金額 (単位: 円) 例: `1000`
- max_amount (任意): integer - 最大金額 (単位: 円) 例: `10000`
- deal_description (任意): string - 取引の備考
act=4,10,11,12(無視/プライベート)では指定しても無視されます。
 例: `打ち合わせ用コーヒー代`
- qualified_invoice_setting (任意): string - 適格請求書等
* non_qualified: 該当しない
* qualified: 該当する
* depends_on_partner: 取引先情報に準拠
act=0,1(取引を推測/登録)の場合のみ使用可能。他のactでは指定しても無視されます。
depends_on_partnerを指定する場合は、partner_nameの指定が必要です。
 (選択肢: non_qualified, qualified, depends_on_partner) 例: `qualified`
- suggest_tax_from_walletable_invoice (任意): boolean - 購入データ原本に準拠
* true: 準拠する
* false: 準拠しない
act=0,1(取引を推測/登録)かつ購入データ原本に対応した口座を指定した場合のみ使用可能。それ以外では指定しても無視されます。
 例: `false`
- account_item_name (任意): string - 勘定科目名
act=0,1(取引を推測/登録)の場合は必須。他のactでは指定しても無視されます。
 例: `会議費`
- partner_name (任意): string - 取引先名
act=0,1(取引を推測/登録)の場合のみ使用可能。他のactでは指定しても無視されます。
指定した名前が登録されていない場合、新規にタグとして作成されます。
 例: `スターバックス`
- item_name (任意): string - 品目名
act=0,1(取引を推測/登録)の場合のみ使用可能。他のactでは指定しても無視されます。
指定した名前が登録されていない場合、新規にタグとして作成されます。
 例: `コーヒー豆`
- section_name (任意): string - 部門名
act=0,1(取引を推測/登録)の場合のみ使用可能。他のactでは指定しても無視されます。
指定した名前が登録されていない場合、新規にタグとして作成されます。
 例: `営業部`
- division_tag_1_name (任意): string - セグメント1タグ名
act=0,1(取引を推測/登録)の場合のみ使用可能。他のactでは指定しても無視されます。
指定した名前が登録されていない場合、新規にタグとして作成されます。
 例: `東日本`
- division_tag_2_name (任意): string - セグメント2タグ名
act=0,1(取引を推測/登録)の場合のみ使用可能。他のactでは指定しても無視されます。
指定した名前が登録されていない場合、新規にタグとして作成されます。
 例: `小売事業`
- division_tag_3_name (任意): string - セグメント3タグ名
act=0,1(取引を推測/登録)の場合のみ使用可能。他のactでは指定しても無視されます。
指定した名前が登録されていない場合、新規にタグとして作成されます。
 例: `第一営業所`
- default_tag_names (任意): array[string] - メモタグ名の配列
act=0,1(取引を推測/登録)の場合のみ使用可能。他のactでは指定しても無視されます。
指定した名前が登録されていない場合、新規にタグとして作成されます。
 例: `["出張","会議"]`

### レスポンス (201)

- id (必須): integer(int64) - 自動登録ルールID 例: `101` (最小: 1)
- entry_side_str (必須): string - 入金/出金
* income: 入金
* expense: 出金
 (選択肢: income, expense) 例: `expense`
- description (必須): string - 説明文。明細の取引内容とのマッチングに使用される文字列です。condition=4(指定なし)の場合は空文字列が返ります。 例: `スターバックス`
- condition (必須): integer - マッチ条件
* 0: 部分一致(partial)
* 1: 前方一致(forward)
* 2: 後方一致(backward)
* 3: 完全一致(exact)
* 4: 指定なし(wildcard)
 (選択肢: 0, 1, 2, 3, 4) 例: `0`
- priority (必須): integer - 優先度 例: `10`
- act (必須): integer - 登録タイプ
* 0: 取引を推測する(manual_standard)
* 1: 取引を登録する(auto_standard)
* 2: 振替を推測する(manual_transfer)
* 3: 振替を登録する(auto_transfer)
* 4: 無視する取引を登録する(auto_ignore)
* 10: 無視する取引を推測する(manual_ignore)
* 11: プライベート取引を推測する(manual_private)
* 12: プライベート取引を登録する(auto_private)

このAPIでは以下のactは非対応です(show時は400エラー、create/update時は指定不可):
5(manual_template), 6(manual_scrub), 7(auto_scrub), 8(manual_output_zengin_scrub), 9(auto_output_zengin_scrub)

actの種類により、返されるフィールド（tax_name、account_item_name、deal_description等）が異なります。
 (選択肢: 0, 1, 2, 3, 4, 10, 11, 12) 例: `1`
- tax_name (任意): string - 税区分名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `課対仕入10%`
- tax_code (任意): integer - 税区分コード。税区分名(tax_name)に対応するコードです。 例: `136`
- suggested_tax_name (任意): string - 勘定科目の設定に基づいてシステムが推測した税区分名。画面には表示されません。 例: `課対仕入10%`
- min_amount (任意): integer - 最小金額 (単位: 円)。ルールが未設定の場合はnullが返ります。 例: `1000`
- max_amount (任意): integer - 最大金額 (単位: 円)。ルールが未設定の場合はnullが返ります。 例: `10000`
- deal_description (任意): string - 取引の備考
act=0,1,2,3の場合のみ値が返ります。act=4,10,11,12では常にnullです。
 例: `打ち合わせ用コーヒー代`
- walletable (任意): string - 口座名 例: `事業用口座`
- transfer_walletable (任意): string - 振替先口座名
act=2,3(振替を推測/登録)の場合のみ値が返ります。
 例: `事業用クレジットカード`
- origin_deal_id (任意): integer(int64) - 元取引ID。このルールの作成元となった取引のIDです。freeeが自動作成したルールの場合のみ値が返ります。 例: `501`
- origin_deal_code (任意): integer - 元取引コード 例: `12`
- last_updated_user_id (必須): integer - 最終更新ユーザーID
* 0: freeeシステムによる更新
 例: `1`
- user_name (必須): string - 最終更新ユーザー名。表示名が未設定の場合はメールアドレスが返ります。freeeシステムによる更新の場合は「freee」、ユーザー情報を取得できない場合は「-」が返ります。 例: `freee 太郎`
- updated_at (任意): string - 更新日 (yyyy-mm-dd) 例: `2026-08-01`
- corrected_wallet_txn_count (任意): integer - 適用明細数(正答件数)。統計情報が存在しない場合はnullが返ります。 例: `10`
- corrected_wallet_txn_count_percentage (任意): integer - 適用率(正答率、パーセント)。統計情報が存在しない場合はnullが返ります。 例: `80`
- qualified_invoice_setting (必須): string - 適格請求書等
* non_qualified: 該当しない
* qualified: 該当する
* depends_on_partner: 取引先情報に準拠
 (選択肢: non_qualified, qualified, depends_on_partner) 例: `qualified`
- suggest_tax_from_walletable_invoice (必須): boolean - 購入データ原本に準拠
* true: 準拠する
* false: 準拠しない
 例: `false`
- walletable_bank_name (任意): string - 口座の銀行名 例: `freee銀行`
- card_label (任意): string - カードラベル 例: `本人`
- card_label_id (任意): integer(int64) - カードラベルID 例: `1`
- account_item_name (任意): string - 勘定科目名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `会議費`
- partner_name (任意): string - 取引先名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `スターバックス`
- item_name (任意): string - 品目名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `コーヒー豆`
- section_name (任意): string - 部門名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `営業部`
- division_tag_1_name (任意): string - セグメント1タグ名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `東日本`
- division_tag_2_name (任意): string - セグメント2タグ名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `小売事業`
- division_tag_3_name (任意): string - セグメント3タグ名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `第一営業所`
- default_tag_names (任意): array[string] - メモタグ名の配列
act=0,1(取引を推測/登録)の場合のみ値が返ります。メモタグが1つも設定されていない場合はnullが返ります。
 例: `["出張","会議"]`
- active (必須): boolean - 有効/無効
* true: 有効
* false: 無効
 例: `true`

### GET /api/1/user_matchers/{id}

操作: 自動登録ルールの取得

説明: 概要 指定した事業所の自動登録ルールを取得する 注意点 登録タイプ（act）が5(manual_template), 6(manual_scrub), 7(auto_scrub), 8(manual_output_zengin_scrub), 9(auto_output_zengin_scrub)の自動登録ルールは取得できません。該当するルールのIDを指定した場合は400エラーが返ります。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 自動登録ルールID |
| company_id | query | はい | integer(int64) | 事業所ID |

### レスポンス (200)

- id (必須): integer(int64) - 自動登録ルールID 例: `101` (最小: 1)
- entry_side_str (必須): string - 入金/出金
* income: 入金
* expense: 出金
 (選択肢: income, expense) 例: `expense`
- description (必須): string - 説明文。明細の取引内容とのマッチングに使用される文字列です。condition=4(指定なし)の場合は空文字列が返ります。 例: `スターバックス`
- condition (必須): integer - マッチ条件
* 0: 部分一致(partial)
* 1: 前方一致(forward)
* 2: 後方一致(backward)
* 3: 完全一致(exact)
* 4: 指定なし(wildcard)
 (選択肢: 0, 1, 2, 3, 4) 例: `0`
- priority (必須): integer - 優先度 例: `10`
- act (必須): integer - 登録タイプ
* 0: 取引を推測する(manual_standard)
* 1: 取引を登録する(auto_standard)
* 2: 振替を推測する(manual_transfer)
* 3: 振替を登録する(auto_transfer)
* 4: 無視する取引を登録する(auto_ignore)
* 10: 無視する取引を推測する(manual_ignore)
* 11: プライベート取引を推測する(manual_private)
* 12: プライベート取引を登録する(auto_private)

このAPIでは以下のactは非対応です(show時は400エラー、create/update時は指定不可):
5(manual_template), 6(manual_scrub), 7(auto_scrub), 8(manual_output_zengin_scrub), 9(auto_output_zengin_scrub)

actの種類により、返されるフィールド（tax_name、account_item_name、deal_description等）が異なります。
 (選択肢: 0, 1, 2, 3, 4, 10, 11, 12) 例: `1`
- tax_name (任意): string - 税区分名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `課対仕入10%`
- tax_code (任意): integer - 税区分コード。税区分名(tax_name)に対応するコードです。 例: `136`
- suggested_tax_name (任意): string - 勘定科目の設定に基づいてシステムが推測した税区分名。画面には表示されません。 例: `課対仕入10%`
- min_amount (任意): integer - 最小金額 (単位: 円)。ルールが未設定の場合はnullが返ります。 例: `1000`
- max_amount (任意): integer - 最大金額 (単位: 円)。ルールが未設定の場合はnullが返ります。 例: `10000`
- deal_description (任意): string - 取引の備考
act=0,1,2,3の場合のみ値が返ります。act=4,10,11,12では常にnullです。
 例: `打ち合わせ用コーヒー代`
- walletable (任意): string - 口座名 例: `事業用口座`
- transfer_walletable (任意): string - 振替先口座名
act=2,3(振替を推測/登録)の場合のみ値が返ります。
 例: `事業用クレジットカード`
- origin_deal_id (任意): integer(int64) - 元取引ID。このルールの作成元となった取引のIDです。freeeが自動作成したルールの場合のみ値が返ります。 例: `501`
- origin_deal_code (任意): integer - 元取引コード 例: `12`
- last_updated_user_id (必須): integer - 最終更新ユーザーID
* 0: freeeシステムによる更新
 例: `1`
- user_name (必須): string - 最終更新ユーザー名。表示名が未設定の場合はメールアドレスが返ります。freeeシステムによる更新の場合は「freee」、ユーザー情報を取得できない場合は「-」が返ります。 例: `freee 太郎`
- updated_at (任意): string - 更新日 (yyyy-mm-dd) 例: `2026-08-01`
- corrected_wallet_txn_count (任意): integer - 適用明細数(正答件数)。統計情報が存在しない場合はnullが返ります。 例: `10`
- corrected_wallet_txn_count_percentage (任意): integer - 適用率(正答率、パーセント)。統計情報が存在しない場合はnullが返ります。 例: `80`
- qualified_invoice_setting (必須): string - 適格請求書等
* non_qualified: 該当しない
* qualified: 該当する
* depends_on_partner: 取引先情報に準拠
 (選択肢: non_qualified, qualified, depends_on_partner) 例: `qualified`
- suggest_tax_from_walletable_invoice (必須): boolean - 購入データ原本に準拠
* true: 準拠する
* false: 準拠しない
 例: `false`
- walletable_bank_name (任意): string - 口座の銀行名 例: `freee銀行`
- card_label (任意): string - カードラベル 例: `本人`
- card_label_id (任意): integer(int64) - カードラベルID 例: `1`
- account_item_name (任意): string - 勘定科目名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `会議費`
- partner_name (任意): string - 取引先名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `スターバックス`
- item_name (任意): string - 品目名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `コーヒー豆`
- section_name (任意): string - 部門名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `営業部`
- division_tag_1_name (任意): string - セグメント1タグ名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `東日本`
- division_tag_2_name (任意): string - セグメント2タグ名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `小売事業`
- division_tag_3_name (任意): string - セグメント3タグ名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `第一営業所`
- default_tag_names (任意): array[string] - メモタグ名の配列
act=0,1(取引を推測/登録)の場合のみ値が返ります。メモタグが1つも設定されていない場合はnullが返ります。
 例: `["出張","会議"]`
- active (必須): boolean - 有効/無効
* true: 有効
* false: 無効
 例: `true`

### PUT /api/1/user_matchers/{id}

操作: 自動登録ルールの更新

説明: 概要 指定した事業所の自動登録ルールを更新する 注意点 本APIは更新後の状態をすべて指定するPUT APIです。リクエストで指定しなかった任意項目は未設定（null）で上書きされるため、変更しない項目も含めてすべての項目を指定してください。 act=0,1（取引を推測/登録）の場合は、tax_name（税区分名）とaccount_item_name（勘定科目名）の指定が必須です。 登録タイプ（act）に5(manual_template), 6(manual_scrub), 7(auto_scrub), 8(manual_output_zengin_scrub), 9(auto_output_zengin_scrub)を指定することはできません。 更新の結果、同じ内容の自動登録ルールが既に存在する場合は、400エラーが返ります。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 自動登録ルールID |
| company_id | query | はい | integer(int64) | 事業所ID |

### リクエストボディ

(必須)

- act (必須): integer - 登録タイプ
* 0: 取引を推測する(manual_standard)
* 1: 取引を登録する(auto_standard)
* 2: 振替を推測する(manual_transfer)
* 3: 振替を登録する(auto_transfer)
* 4: 無視する取引を登録する(auto_ignore)
* 10: 無視する取引を推測する(manual_ignore)
* 11: プライベート取引を推測する(manual_private)
* 12: プライベート取引を登録する(auto_private)

このAPIでは以下のactは非対応です:
5(manual_template), 6(manual_scrub), 7(auto_scrub), 8(manual_output_zengin_scrub), 9(auto_output_zengin_scrub)
 (選択肢: 0, 1, 2, 3, 4, 10, 11, 12) 例: `1`
- active (必須): boolean - 有効/無効
* true: 有効
* false: 無効
 例: `true`
- condition (必須): integer - マッチ条件
* 0: 部分一致(partial)
* 1: 前方一致(forward)
* 2: 後方一致(backward)
* 3: 完全一致(exact)
* 4: 指定なし(wildcard)
 (選択肢: 0, 1, 2, 3, 4) 例: `0`
- description (必須): string - 説明文。明細の取引内容とマッチングする文字列を指定します。condition=4(指定なし)の場合は無視されます。 例: `スターバックス`
- entry_side_str (必須): string - 入金/出金
* income: 入金
* expense: 出金
 (選択肢: income, expense) 例: `expense`
- priority (必須): integer - 優先度 例: `10`
- tax_name (任意): string - 税区分名
act=0,1(取引を推測/登録)の場合は必須。他のactでは指定しても無視されます。
 例: `課対仕入10%`
- walletable (任意): string - 口座名。事業所に登録されている口座の名前を指定します。 例: `事業用口座`
- card_label (任意): string - カードラベル 例: `本人`
- card_label_id (任意): integer - カードラベルID 例: `1`
- transfer_walletable (任意): string - 振替先口座名
act=2,3(振替を推測/登録)の場合に使用。他のactでは指定しても無視されます。
 例: `事業用クレジットカード`
- min_amount (任意): integer - 最小金額 (単位: 円) 例: `1000`
- max_amount (任意): integer - 最大金額 (単位: 円) 例: `10000`
- deal_description (任意): string - 取引の備考
act=4,10,11,12(無視/プライベート)では指定しても無視されます。
 例: `打ち合わせ用コーヒー代`
- qualified_invoice_setting (任意): string - 適格請求書等
* non_qualified: 該当しない
* qualified: 該当する
* depends_on_partner: 取引先情報に準拠
act=0,1(取引を推測/登録)の場合のみ使用可能。他のactでは指定しても無視されます。
depends_on_partnerを指定する場合は、partner_nameの指定が必要です。
 (選択肢: non_qualified, qualified, depends_on_partner) 例: `qualified`
- suggest_tax_from_walletable_invoice (任意): boolean - 購入データ原本に準拠
* true: 準拠する
* false: 準拠しない
act=0,1(取引を推測/登録)かつ購入データ原本に対応した口座を指定した場合のみ使用可能。それ以外では指定しても無視されます。
 例: `false`
- account_item_name (任意): string - 勘定科目名
act=0,1(取引を推測/登録)の場合は必須。他のactでは指定しても無視されます。
 例: `会議費`
- partner_name (任意): string - 取引先名
act=0,1(取引を推測/登録)の場合のみ使用可能。他のactでは指定しても無視されます。
指定した名前が登録されていない場合、新規にタグとして作成されます。
 例: `スターバックス`
- item_name (任意): string - 品目名
act=0,1(取引を推測/登録)の場合のみ使用可能。他のactでは指定しても無視されます。
指定した名前が登録されていない場合、新規にタグとして作成されます。
 例: `コーヒー豆`
- section_name (任意): string - 部門名
act=0,1(取引を推測/登録)の場合のみ使用可能。他のactでは指定しても無視されます。
指定した名前が登録されていない場合、新規にタグとして作成されます。
 例: `営業部`
- division_tag_1_name (任意): string - セグメント1タグ名
act=0,1(取引を推測/登録)の場合のみ使用可能。他のactでは指定しても無視されます。
指定した名前が登録されていない場合、新規にタグとして作成されます。
 例: `東日本`
- division_tag_2_name (任意): string - セグメント2タグ名
act=0,1(取引を推測/登録)の場合のみ使用可能。他のactでは指定しても無視されます。
指定した名前が登録されていない場合、新規にタグとして作成されます。
 例: `小売事業`
- division_tag_3_name (任意): string - セグメント3タグ名
act=0,1(取引を推測/登録)の場合のみ使用可能。他のactでは指定しても無視されます。
指定した名前が登録されていない場合、新規にタグとして作成されます。
 例: `第一営業所`
- default_tag_names (任意): array[string] - メモタグ名の配列
act=0,1(取引を推測/登録)の場合のみ使用可能。他のactでは指定しても無視されます。
指定した名前が登録されていない場合、新規にタグとして作成されます。
 例: `["出張","会議"]`

### レスポンス (200)

- id (必須): integer(int64) - 自動登録ルールID 例: `101` (最小: 1)
- entry_side_str (必須): string - 入金/出金
* income: 入金
* expense: 出金
 (選択肢: income, expense) 例: `expense`
- description (必須): string - 説明文。明細の取引内容とのマッチングに使用される文字列です。condition=4(指定なし)の場合は空文字列が返ります。 例: `スターバックス`
- condition (必須): integer - マッチ条件
* 0: 部分一致(partial)
* 1: 前方一致(forward)
* 2: 後方一致(backward)
* 3: 完全一致(exact)
* 4: 指定なし(wildcard)
 (選択肢: 0, 1, 2, 3, 4) 例: `0`
- priority (必須): integer - 優先度 例: `10`
- act (必須): integer - 登録タイプ
* 0: 取引を推測する(manual_standard)
* 1: 取引を登録する(auto_standard)
* 2: 振替を推測する(manual_transfer)
* 3: 振替を登録する(auto_transfer)
* 4: 無視する取引を登録する(auto_ignore)
* 10: 無視する取引を推測する(manual_ignore)
* 11: プライベート取引を推測する(manual_private)
* 12: プライベート取引を登録する(auto_private)

このAPIでは以下のactは非対応です(show時は400エラー、create/update時は指定不可):
5(manual_template), 6(manual_scrub), 7(auto_scrub), 8(manual_output_zengin_scrub), 9(auto_output_zengin_scrub)

actの種類により、返されるフィールド（tax_name、account_item_name、deal_description等）が異なります。
 (選択肢: 0, 1, 2, 3, 4, 10, 11, 12) 例: `1`
- tax_name (任意): string - 税区分名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `課対仕入10%`
- tax_code (任意): integer - 税区分コード。税区分名(tax_name)に対応するコードです。 例: `136`
- suggested_tax_name (任意): string - 勘定科目の設定に基づいてシステムが推測した税区分名。画面には表示されません。 例: `課対仕入10%`
- min_amount (任意): integer - 最小金額 (単位: 円)。ルールが未設定の場合はnullが返ります。 例: `1000`
- max_amount (任意): integer - 最大金額 (単位: 円)。ルールが未設定の場合はnullが返ります。 例: `10000`
- deal_description (任意): string - 取引の備考
act=0,1,2,3の場合のみ値が返ります。act=4,10,11,12では常にnullです。
 例: `打ち合わせ用コーヒー代`
- walletable (任意): string - 口座名 例: `事業用口座`
- transfer_walletable (任意): string - 振替先口座名
act=2,3(振替を推測/登録)の場合のみ値が返ります。
 例: `事業用クレジットカード`
- origin_deal_id (任意): integer(int64) - 元取引ID。このルールの作成元となった取引のIDです。freeeが自動作成したルールの場合のみ値が返ります。 例: `501`
- origin_deal_code (任意): integer - 元取引コード 例: `12`
- last_updated_user_id (必須): integer - 最終更新ユーザーID
* 0: freeeシステムによる更新
 例: `1`
- user_name (必須): string - 最終更新ユーザー名。表示名が未設定の場合はメールアドレスが返ります。freeeシステムによる更新の場合は「freee」、ユーザー情報を取得できない場合は「-」が返ります。 例: `freee 太郎`
- updated_at (任意): string - 更新日 (yyyy-mm-dd) 例: `2026-08-01`
- corrected_wallet_txn_count (任意): integer - 適用明細数(正答件数)。統計情報が存在しない場合はnullが返ります。 例: `10`
- corrected_wallet_txn_count_percentage (任意): integer - 適用率(正答率、パーセント)。統計情報が存在しない場合はnullが返ります。 例: `80`
- qualified_invoice_setting (必須): string - 適格請求書等
* non_qualified: 該当しない
* qualified: 該当する
* depends_on_partner: 取引先情報に準拠
 (選択肢: non_qualified, qualified, depends_on_partner) 例: `qualified`
- suggest_tax_from_walletable_invoice (必須): boolean - 購入データ原本に準拠
* true: 準拠する
* false: 準拠しない
 例: `false`
- walletable_bank_name (任意): string - 口座の銀行名 例: `freee銀行`
- card_label (任意): string - カードラベル 例: `本人`
- card_label_id (任意): integer(int64) - カードラベルID 例: `1`
- account_item_name (任意): string - 勘定科目名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `会議費`
- partner_name (任意): string - 取引先名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `スターバックス`
- item_name (任意): string - 品目名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `コーヒー豆`
- section_name (任意): string - 部門名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `営業部`
- division_tag_1_name (任意): string - セグメント1タグ名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `東日本`
- division_tag_2_name (任意): string - セグメント2タグ名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `小売事業`
- division_tag_3_name (任意): string - セグメント3タグ名
act=0,1(取引を推測/登録)の場合のみ値が返ります。
 例: `第一営業所`
- default_tag_names (任意): array[string] - メモタグ名の配列
act=0,1(取引を推測/登録)の場合のみ値が返ります。メモタグが1つも設定されていない場合はnullが返ります。
 例: `["出張","会議"]`
- active (必須): boolean - 有効/無効
* true: 有効
* false: 無効
 例: `true`

### DELETE /api/1/user_matchers/{id}

操作: 自動登録ルールの削除

説明: 概要 指定した事業所の自動登録ルールを削除する 注意点 登録タイプ（act）が5(manual_template), 6(manual_scrub), 7(auto_scrub), 8(manual_output_zengin_scrub), 9(auto_output_zengin_scrub)の自動登録ルールは削除できません。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 自動登録ルールID |
| company_id | query | はい | integer(int64) | 事業所ID |

### レスポンス (204)



## 参考情報

- freee API公式ドキュメント: https://developer.freee.co.jp/docs
- OpenAPIスキーマ: [accounting-api-schema.json](../../openapi/accounting-api-schema.json)
