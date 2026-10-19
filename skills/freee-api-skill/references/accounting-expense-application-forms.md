# Expense application forms

## 概要



## エンドポイント一覧

### GET /api/1/expense_applications/form

操作: 経費申請フォームの取得

説明: 概要 指定した事業所の経費申請フォームの設定を取得します。設定が未作成の場合は初期値を返します。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| company_id | query | はい | integer(int64) | 事業所ID |

### レスポンス (200)

- section_setting (必須): string - 部門の入力設定 (optional: 任意入力, required: 必須入力) (選択肢: optional, required) 例: `optional`
- tag_setting (必須): string - メモタグの入力設定 (optional: 任意入力, required: 必須入力, disable: 非表示) (選択肢: optional, required, disable) 例: `optional`
- line_template_setting (必須): string - 経費科目の入力設定 (optional: 任意入力, required: 必須入力, disable: 非表示)。経費科目は `/api/1/expense_application_line_templates` で取得できます。 (選択肢: optional, required, disable) 例: `optional`
- segment_1_tag_setting (必須): string - セグメント1タグの入力設定 (optional: 任意入力, required: 必須入力, disable: 非表示) (選択肢: optional, required, disable) 例: `optional`
- segment_2_tag_setting (必須): string - セグメント2タグの入力設定 (optional: 任意入力, required: 必須入力, disable: 非表示) (選択肢: optional, required, disable) 例: `optional`
- segment_3_tag_setting (必須): string - セグメント3タグの入力設定 (optional: 任意入力, required: 必須入力, disable: 非表示) (選択肢: optional, required, disable) 例: `optional`
- description_setting (必須): string - 備考の入力設定 (optional: 任意入力, required: 必須入力) (選択肢: optional, required) 例: `optional`
- commuter_pass_deduction (必須): string - 定期券区間控除の利用設定 (disable: 利用しない, enable: 利用する) (選択肢: disable, enable) 例: `disable`
- default_flow_route_src_id (必須): integer(int64) - デフォルトで選択する申請経路のID (未設定の場合は null)。申請経路一覧の取得API (`/api/1/approval_flow_routes`) のレスポンス id と同じ値です。 例: `101` (最小: 1)
- observer_addition (必須): string - 承認者以外の閲覧者追加の利用設定 (disable: 利用しない, enable: 利用する) (選択肢: disable, enable) 例: `disable`
- receipt_partner_name_setting (必須): string - 支払先の入力設定 (optional: 任意入力, required: 必須入力, disable: 非表示) (選択肢: optional, required, disable) 例: `disable`
- default_title (必須): string - 申請タイトルの初期値 (255文字以内) 例: `交通費精算`
- use_currency (必須): boolean - 外貨の利用設定 例: `true`
- auto_calculation_amount_fraction (必須): string - 金額の自動計算結果の端数処理 (omit: 切り捨て, round_up: 切り上げ, round: 四捨五入) (選択肢: omit, round_up, round) 例: `round_up`
- allow_modify_parent_application_by_applicant (必須): boolean - 申請者による親申請の変更を許可するか 例: `true`
- allow_modify_parent_application_by_approver (必須): boolean - 承認者による親申請の変更を許可するか 例: `false`
- allow_modify_parent_application_by_admin (必須): boolean - 管理者による親申請の変更を許可するか 例: `false`
- require_parent_purchase_request (必須): boolean - 親となる購買申請を必須にするか 例: `false`
- allow_modify_on_approval (必須): boolean - 承認中の申請の変更を許可するか 例: `false`

### PUT /api/1/expense_applications/form

操作: 経費申請フォームの更新

説明: 概要 指定した事業所の経費申請フォームの設定を更新します。設定が未作成の場合は作成します。

### リクエストボディ

(必須)

- company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)
- section_setting (必須): string - 部門の入力設定 (optional: 任意入力, required: 必須入力) (選択肢: optional, required) 例: `optional`
- tag_setting (必須): string - メモタグの入力設定 (optional: 任意入力, required: 必須入力, disable: 非表示) (選択肢: optional, required, disable) 例: `optional`
- line_template_setting (必須): string - 経費科目の入力設定 (optional: 任意入力, required: 必須入力, disable: 非表示)。経費科目は `/api/1/expense_application_line_templates` で取得できます。 (選択肢: optional, required, disable) 例: `optional`
- segment_1_tag_setting (必須): string - セグメント1タグの入力設定 (optional: 任意入力, required: 必須入力, disable: 非表示) (選択肢: optional, required, disable) 例: `optional`
- segment_2_tag_setting (必須): string - セグメント2タグの入力設定 (optional: 任意入力, required: 必須入力, disable: 非表示) (選択肢: optional, required, disable) 例: `optional`
- segment_3_tag_setting (必須): string - セグメント3タグの入力設定 (optional: 任意入力, required: 必須入力, disable: 非表示) (選択肢: optional, required, disable) 例: `optional`
- description_setting (必須): string - 備考の入力設定 (optional: 任意入力, required: 必須入力) (選択肢: optional, required) 例: `optional`
- commuter_pass_deduction (必須): string - 定期券区間控除の利用設定 (disable: 利用しない, enable: 利用する) (選択肢: disable, enable) 例: `disable`
- default_flow_route_src_id (必須): integer(int64) - デフォルトで選択する申請経路のID (未設定の場合は null)。申請経路一覧の取得API (`/api/1/approval_flow_routes`) のレスポンス id と同じ値です。 例: `101` (最小: 1)
- observer_addition (必須): string - 承認者以外の閲覧者追加の利用設定 (disable: 利用しない, enable: 利用する) (選択肢: disable, enable) 例: `disable`
- receipt_partner_name_setting (必須): string - 支払先の入力設定 (optional: 任意入力, required: 必須入力, disable: 非表示) (選択肢: optional, required, disable) 例: `disable`
- default_title (必須): string - 申請タイトルの初期値 (255文字以内) 例: `交通費精算`
- use_currency (必須): boolean - 外貨の利用設定 例: `true`
- auto_calculation_amount_fraction (必須): string - 金額の自動計算結果の端数処理 (omit: 切り捨て, round_up: 切り上げ, round: 四捨五入) (選択肢: omit, round_up, round) 例: `round_up`
- allow_modify_parent_application_by_applicant (必須): boolean - 申請者による親申請の変更を許可するか 例: `true`
- allow_modify_parent_application_by_approver (必須): boolean - 承認者による親申請の変更を許可するか 例: `false`
- allow_modify_parent_application_by_admin (必須): boolean - 管理者による親申請の変更を許可するか 例: `false`
- require_parent_purchase_request (必須): boolean - 親となる購買申請を必須にするか 例: `false`
- allow_modify_on_approval (必須): boolean - 承認中の申請の変更を許可するか 例: `false`

### レスポンス (200)

- section_setting (必須): string - 部門の入力設定 (optional: 任意入力, required: 必須入力) (選択肢: optional, required) 例: `optional`
- tag_setting (必須): string - メモタグの入力設定 (optional: 任意入力, required: 必須入力, disable: 非表示) (選択肢: optional, required, disable) 例: `optional`
- line_template_setting (必須): string - 経費科目の入力設定 (optional: 任意入力, required: 必須入力, disable: 非表示)。経費科目は `/api/1/expense_application_line_templates` で取得できます。 (選択肢: optional, required, disable) 例: `optional`
- segment_1_tag_setting (必須): string - セグメント1タグの入力設定 (optional: 任意入力, required: 必須入力, disable: 非表示) (選択肢: optional, required, disable) 例: `optional`
- segment_2_tag_setting (必須): string - セグメント2タグの入力設定 (optional: 任意入力, required: 必須入力, disable: 非表示) (選択肢: optional, required, disable) 例: `optional`
- segment_3_tag_setting (必須): string - セグメント3タグの入力設定 (optional: 任意入力, required: 必須入力, disable: 非表示) (選択肢: optional, required, disable) 例: `optional`
- description_setting (必須): string - 備考の入力設定 (optional: 任意入力, required: 必須入力) (選択肢: optional, required) 例: `optional`
- commuter_pass_deduction (必須): string - 定期券区間控除の利用設定 (disable: 利用しない, enable: 利用する) (選択肢: disable, enable) 例: `disable`
- default_flow_route_src_id (必須): integer(int64) - デフォルトで選択する申請経路のID (未設定の場合は null)。申請経路一覧の取得API (`/api/1/approval_flow_routes`) のレスポンス id と同じ値です。 例: `101` (最小: 1)
- observer_addition (必須): string - 承認者以外の閲覧者追加の利用設定 (disable: 利用しない, enable: 利用する) (選択肢: disable, enable) 例: `disable`
- receipt_partner_name_setting (必須): string - 支払先の入力設定 (optional: 任意入力, required: 必須入力, disable: 非表示) (選択肢: optional, required, disable) 例: `disable`
- default_title (必須): string - 申請タイトルの初期値 (255文字以内) 例: `交通費精算`
- use_currency (必須): boolean - 外貨の利用設定 例: `true`
- auto_calculation_amount_fraction (必須): string - 金額の自動計算結果の端数処理 (omit: 切り捨て, round_up: 切り上げ, round: 四捨五入) (選択肢: omit, round_up, round) 例: `round_up`
- allow_modify_parent_application_by_applicant (必須): boolean - 申請者による親申請の変更を許可するか 例: `true`
- allow_modify_parent_application_by_approver (必須): boolean - 承認者による親申請の変更を許可するか 例: `false`
- allow_modify_parent_application_by_admin (必須): boolean - 管理者による親申請の変更を許可するか 例: `false`
- require_parent_purchase_request (必須): boolean - 親となる購買申請を必須にするか 例: `false`
- allow_modify_on_approval (必須): boolean - 承認中の申請の変更を許可するか 例: `false`



## 参考情報

- freee API公式ドキュメント: https://developer.freee.co.jp/docs
- OpenAPIスキーマ: [accounting-api-schema.json](../../openapi/accounting-api-schema.json)
