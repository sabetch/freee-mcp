# Payment requests

## 概要

支払依頼

## エンドポイント一覧

### GET /api/1/payment_requests

操作: 支払依頼一覧の取得

説明: 概要 指定した事業所の支払依頼一覧を取得する 支払依頼APIの使い方については、freee会計支払依頼APIの使い方をご参照ください 注意点 本APIでは、支払依頼の一覧を取得することができます。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| company_id | query | はい | integer(int64) | 事業所ID |
| status | query | いいえ | string | 申請ステータス、または取引ステータス
申請ステータス:
* `draft` - 下書き
* `in_progress` - 申請中
* `approved` - 承認済
* `rejected` - 却下
* `feedback` - 差戻し

取引ステータス (status が `approved` の支払依頼に対して):
* `unsettled` - 支払待ち
* `settled` - 支払済み

approver_id を指定した場合は無効です。 (選択肢: draft, in_progress, approved, rejected, feedback, unsettled, settled) |
| start_application_date | query | いいえ | string | 申請日で絞込：開始日(yyyy-mm-dd) |
| end_application_date | query | いいえ | string | 申請日で絞込：終了日(yyyy-mm-dd) |
| start_issue_date | query | いいえ | string | 発生日で絞込：開始日(yyyy-mm-dd) |
| end_issue_date | query | いいえ | string | 発生日で絞込：終了日(yyyy-mm-dd) |
| application_number | query | いいえ | integer(int64) | 申請No. |
| title | query | いいえ | string | 申請タイトル |
| applicant_id | query | いいえ | integer(int64) | 申請者のユーザーID |
| approver_id | query | いいえ | integer(int64) | 承認者のユーザーID (`/api/1/users` のレスポンス id と同じ値)
approver_id を指定した場合は `in_progress` (申請中) の支払依頼のみを返します。 |
| min_amount | query | いいえ | integer(int64) | 金額で絞込 (下限金額) |
| max_amount | query | いいえ | integer(int64) | 金額で絞込 (上限金額) |
| partner_id | query | いいえ | integer(int64) | 取引先IDで絞込（`/api/1/partners` のレスポンス id と同じ値） |
| partner_code | query | いいえ | string | 取引先コードで絞込。事業所側で「取引先コードを利用する」設定が有効な場合に利用できます。 |
| payment_method | query | いいえ | string | 支払方法で絞込
* `none` - 指定なし
* `domestic_bank_transfer` - 国内振込
* `abroad_bank_transfer` - 国外振込
* `account_transfer` - 口座振替
* `credit_card` - クレジットカード (選択肢: none, domestic_bank_transfer, abroad_bank_transfer, account_transfer, credit_card) |
| start_payment_date | query | いいえ | string | 支払期限で絞込：開始日(yyyy-mm-dd) |
| end_payment_date | query | いいえ | string | 支払期限で絞込：終了日(yyyy-mm-dd) |
| document_code | query | いいえ | string | 請求書番号で絞込 |
| section_id | query | いいえ | integer(int64) | 部門IDで絞込（`/api/1/sections` のレスポンス id と同じ値） |
| partner_name | query | いいえ | string | 取引先名で絞込 |
| approval_flow_route_id | query | いいえ | integer(int64) | 申請経路IDで絞込（`/api/1/approval_flow_routes` のレスポンス id と同じ値） |
| observing | query | いいえ | string | 共有された申請の絞り込み
* `ignore_observing` - 共有された申請を含めない
* `only_observing` - 共有された申請のみ (選択肢: ignore_observing, only_observing) |
| offset | query | いいえ | integer(int64) | 取得レコードのオフセット (デフォルト: 0) |
| limit | query | いいえ | integer(int64) | 取得レコードの件数 (デフォルト: 50, 最小: 1, 最大: 500) |

### レスポンス (200)

- payment_requests (必須): array[object] - 支払依頼の一覧。詳細フィールド（description / payment_request_lines / approval_flow_route_id / comments / approval_flow_logs / receipt_ids / 振込先口座情報）は含まれません。詳細は `/api/1/payment_requests/{id}` で取得してください。
  配列の要素:
    - id (必須): integer(int64) - 支払依頼ID 例: `1` (最小: 1)
    - company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)
    - title (必須): string - 申請タイトル 例: `仕入代金支払い`
    - application_date (必須): string - 申請日 (yyyy-mm-dd) 例: `2019-12-17`
    - total_amount (必須): integer(int64) - 合計金額（円、税込）
通常取引行 (deal_line) の合計金額から控除・マイナス行 (negative_line) と源泉所得税行 (withholding_tax) の合計金額を差し引いた値です。 例: `30000`
    - status (必須): string - 申請ステータス
* `draft` - 下書き
* `in_progress` - 申請中
* `approved` - 承認済
* `rejected` - 却下
* `feedback` - 差戻し (選択肢: draft, in_progress, approved, rejected, feedback) 例: `draft`
    - deal_id (任意): integer(int64) - 取引ID
申請ステータス (status) が `approved` (承認済) で、支払依頼から作成された取引が存在する場合のみ値が入ります。
それ以外の場合は null になります。 例: `1` (最小: 1)
    - deal_status (任意): string - 取引ステータス
* `settled` - 支払済み
* `unsettled` - 支払待ち

申請ステータス (status) が `approved` (承認済) で、支払依頼から作成された取引が存在する場合のみ値が入ります。
それ以外の場合は null になります。 (選択肢: settled, unsettled) 例: `settled`
    - applicant_id (必須): integer(int64) - 申請者のユーザーID（`/api/1/users` のレスポンス id と同じ値） 例: `1` (最小: 1)
    - approvers (必須): array[object] - 承認者（配列）
  承認ステップのresource_typeがunspecified (指定なし)の場合はapproversはレスポンスに含まれません。
  しかし、resource_typeがunspecifiedの承認ステップにおいて誰かが承認・却下・差し戻しのいずれかのアクションを取った後は、
  approversはレスポンスに含まれるようになります。
  その場合approversにはアクションを行ったステップのIDとアクションを行ったユーザーのIDが含まれます。
    - application_number (必須): string - 申請No.（事業所内で申請単位に自動採番される番号） 例: `2`
    - current_step_id (必須): integer(int64) - 現在の承認ステップID（承認操作 API `POST /api/1/payment_requests/{id}/actions` の target_step_id に指定します）
下書き・差戻し状態の場合は null になります。 例: `1` (最小: 1)
    - current_round (必須): integer(int64) - 現在の round（承認操作 API `POST /api/1/payment_requests/{id}/actions` の target_round に指定します）
差戻し等により申請が step の最初からやり直しになると round の値が増えます。 例: `1` (最小: 0, 最大: 2147483647)
    - document_code (必須): string - 請求書番号。未設定の場合は空文字列になります。 例: `2`
    - issue_date (必須): string - 発生日 (yyyy-mm-dd) 例: `2019-12-17`
    - payment_date (必須): string - 支払期限 (yyyy-mm-dd)。指定されていない場合は null になります。 例: `2019-12-17`
    - payment_method (必須): string - 支払方法
* `none` - 指定なし
* `domestic_bank_transfer` - 国内振込
* `abroad_bank_transfer` - 国外振込
* `account_transfer` - 口座振替
* `credit_card` - クレジットカード (選択肢: none, domestic_bank_transfer, abroad_bank_transfer, account_transfer, credit_card) 例: `none`
    - partner_id (必須): integer(int64) - 取引先ID（取引先が指定されていない支払依頼の場合は null になります） 例: `201` (最小: 1)
    - partner_code (必須): string - 取引先コード
取引先コードが設定されていない場合、および事業所が取引先コードを利用していない場合は null になります。 例: `code001`
    - partner_name (必須): string - 取引先名（取引先が指定されていない支払依頼の場合は null になります） 例: `freee`
    - qualified_invoice_status (任意): string - 適格請求書発行事業者の区分
* `qualified` - 該当する
* `not_qualified` - 該当しない
* `unspecified` - 未選択

支払依頼をインボイス要件をみたす申請として扱うかどうかを表します。 (選択肢: qualified, not_qualified, unspecified) 例: `qualified`
    - input_mode (任意): string - 内税/外税の区分
* `inclusive` - 内税
* `exclusive` - 外税

外税の支払依頼は他のエンドポイント（`GET /api/1/payment_requests/{id}` / `PUT` / `DELETE`）で利用できないため、Web 画面からご確認ください。 (選択肢: inclusive, exclusive) 例: `inclusive`

### POST /api/1/payment_requests

操作: 支払依頼の作成

説明: 概要 指定した事業所の支払依頼を作成する 支払依頼APIの使い方については、freee会計支払依頼APIの使い方をご参照ください 注意点 申請ステータス(下書き、申請中)の指定と変更、及び承認操作（承認する、却下する、申請者へ差し戻す、特権承認する、承認済み・却下済みを取り消す）は以下を参考にして行ってください。 承認操作は申請ステータスが申請中、承認済み、却下のものだけが対象です。 初回申請の場合 申請の作成（POST） 作成済みの申請の申請ステータス変更・更新する場合 申請の更新（PUT） 申請中、承認済み、却下の申請の承認操作を行う場合 承認操作の実行（POST） 申請の削除（DELETE）が可能なのは申請ステータスが下書き、差戻しの場合のみです 承認者の指定に部門役職データ連携を活用した、以下のいずれかの承認ステップを含む申請経路にも対応しています。 役職指定（申請者の所属部門） 役職指定（申請時に部門指定） 部門および役職指定 申請者がどの所属部門として申請するかは applicant_group_id で指定します。申請者が複数の部門に所属している場合は必須です。1段階目の...

### リクエストボディ

- company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)
- title (必須): string - 申請タイトル（250文字以内） 例: `仕入代金支払い`
- application_date (任意): string - 申請日 (yyyy-mm-dd)
指定しない場合は当日の日付が登録されます。 例: `2019-12-17`
- description (任意): string - 備考。未指定の場合は空文字列になります。 例: `◯◯連携先ID: cx12345`
- payment_request_lines (必須): array[object] - 支払依頼の項目行一覧（配列）。最大100行までです。
通常行 (line_type=`deal_line`) を最低1行含める必要があり、控除・マイナス行 (`negative_line`) や源泉所得税行 (`withholding_tax`) だけで構成することはできません。
申請中 (draft=false) で作成する場合は、通常行の合計金額が控除・マイナス行と源泉所得税行の合計金額より大きい必要があります。
  配列の要素:
    - line_type (任意): string - 行の種類（デフォルトは `deal_line`）
* `deal_line` - 支払依頼の通常取引行
* `negative_line` - 支払依頼の控除・マイナス行
* `withholding_tax` - 源泉所得税行（1件のみ指定可能） (選択肢: deal_line, negative_line, withholding_tax) 例: `deal_line`
    - description (任意): string - 内容 例: `原稿料`
    - amount (必須): integer(int64) - 金額（円、税込）。申請中 (draft=false) で作成する場合は0より大きい値を指定してください。 例: `30000` (最小: 0, 最大: 99999999999)
    - account_item_id (任意): integer(int64) - 勘定科目ID（`/api/1/account_items` のレスポンス id で取得できます） 例: `1` (最小: 1)
    - tax_code (任意): integer(int64) - 税区分コード
勘定科目IDを指定する場合は必須です。税区分コードは `/api/1/taxes/codes` で取得できます。 例: `1` (最小: 0, 最大: 2147483647)
    - item_id (任意): integer(int64) - 品目ID（`/api/1/items` のレスポンス id で取得できます） 例: `1` (最小: 1)
    - section_id (任意): integer(int64) - 部門ID（`/api/1/sections` のレスポンス id で取得できます） 例: `1` (最小: 1)
    - tag_ids (任意): array[integer] - メモタグID の配列（`/api/1/tags` のレスポンス id で取得できます） 例: `[1,2,3]`
    - segment_1_tag_id (任意): integer(int64) - セグメント１タグID
セグメントタグ一覧API (`/api/1/segments/{segment_id}/tags`) で取得できます。
事業所側でセグメント１が利用可能なプラン契約になっている必要があります。
<a href="https://support.freee.co.jp/hc/ja/articles/360020679611" target="_blank">セグメント（分析用タグ）の設定</a> 例: `1` (最小: 1)
    - segment_2_tag_id (任意): integer(int64) - セグメント２タグID
セグメントタグ一覧API (`/api/1/segments/{segment_id}/tags`) で取得できます。
事業所側でセグメント２が利用可能なプラン契約になっている必要があります。
<a href="https://support.freee.co.jp/hc/ja/articles/360020679611" target="_blank">セグメント（分析用タグ）の設定</a> 例: `1` (最小: 1)
    - segment_3_tag_id (任意): integer(int64) - セグメント３タグID
セグメントタグ一覧API (`/api/1/segments/{segment_id}/tags`) で取得できます。
事業所側でセグメント３が利用可能なプラン契約になっている必要があります。
<a href="https://support.freee.co.jp/hc/ja/articles/360020679611" target="_blank">セグメント（分析用タグ）の設定</a> 例: `1` (最小: 1)
- approver_id (任意): integer(int64) - 承認者のユーザーID
「承認者を指定」の申請経路 (resource_type: `selected_user`) を利用する場合に指定してください。
指定する承認者のユーザーIDは、申請経路取得API (`/api/1/approval_flow_routes`) のレスポンス steps[].users_ids から取得できます。 例: `1` (最小: 1)
- approval_flow_route_id (必須): integer(int64) - 申請経路ID
指定する申請経路IDは、申請経路一覧API (`/api/1/approval_flow_routes`) のレスポンス id から取得してください。
usages に `PaymentRequest` を含む申請経路のみ利用可能です。 例: `1` (最小: 1)
- applicant_group_id (任意): integer(int64) - 申請者の所属部門ID<br>
「部門役職」の承認ステップを含む申請経路で、申請者がどの所属部門として申請するかを指定します。<br>
<ul>
  <li>申請者が複数の部門に所属している場合は必須です。省略すると400エラーになります。</li>
  <li>申請者の所属部門が1つだけの場合は、省略するとその部門が採用されます。</li>
</ul>
 例: `1` (最小: 1)
- approval_flow_group_id (任意): integer(int64) - 申請経路の承認部門ID<br>
1段階目の承認ステップが部門選択型の場合に、承認させる部門を指定してください。
 例: `1` (最小: 1)
- parent_id (任意): integer(int64) - 親申請ID
法人エンタープライズプラン、法人アドバンスプラン（および旧法人プロフェッショナルプラン）で利用できます。
承認済みの既存各種申請IDまたは購買申請IDのみ指定可能です（各種申請一覧API `/api/1/approval_requests`、購買申請一覧API `/api/1/purchase_requests` で取得できます）。
親申請の種別を購買申請にする場合は parent_type に `PurchaseRequest` を指定してください。 例: `2` (最小: 1)
- parent_type (任意): string - 親申請の種別（parent_id を指定した場合のみ有効）
* `ApprovalRequest` - 各種申請（parent_type 未指定時のデフォルト）
* `PurchaseRequest` - 購買申請

上記以外の値を指定するとバリデーションエラーになります。 (選択肢: ApprovalRequest, PurchaseRequest) 例: `ApprovalRequest`
- draft (必須): boolean - 支払依頼のステータス
* `true` - 下書き (draft) で支払依頼を作成します
* `false` - 申請中 (in_progress) で支払依頼を作成します 例: `true`
- document_code (任意): string - 請求書番号（255文字以内） 例: `2`
- receipt_ids (任意): array[integer] - ファイルボックス（証憑ファイル）ID の配列（`/api/1/receipts` で取得できます）
- issue_date (必須): string - 発生日 (yyyy-mm-dd) 例: `2019-12-17`
- payment_date (任意): string - 支払期限 (yyyy-mm-dd)。指定しない場合は null で登録されます。 例: `2019-12-17`
- payment_method (任意): string - 支払方法（デフォルトは `none`）
* `none` - 指定なし
* `domestic_bank_transfer` - 国内振込
* `abroad_bank_transfer` - 国外振込
* `account_transfer` - 口座振替
* `credit_card` - クレジットカード (選択肢: none, domestic_bank_transfer, abroad_bank_transfer, account_transfer, credit_card) 例: `none`
- partner_id (任意): integer(int64) - 支払先の取引先ID（`/api/1/partners` のレスポンス id で取得できます） 例: `201` (最小: 1)
- partner_code (任意): string - 支払先の取引先コード
partner_id と同時指定した場合は partner_id が優先され、partner_code は無視されます。
取引先コードを利用するには事業所側で「取引先コードを利用する」設定が有効になっている必要があります。 例: `code001`
- bank_code (任意): string - 銀行コード（半角数字1桁〜4桁）
partner_id / partner_code で支払先を指定した場合は無視され、取引先の振込先口座の値が採用されます。 例: `0001`
- bank_name (任意): string - 銀行名（255文字以内）
partner_id / partner_code で支払先を指定した場合は無視され、取引先の振込先口座の値が採用されます。 例: `freee銀行`
- bank_name_kana (任意): string - 銀行名（カナ）（15文字以内）
partner_id / partner_code で支払先を指定した場合は無視され、取引先の振込先口座の値が採用されます。 例: `フリーギンコウ`
- branch_code (任意): string - 支店番号（半角数字1桁〜3桁）
partner_id / partner_code で支払先を指定した場合は無視され、取引先の振込先口座の値が採用されます。 例: `101`
- branch_name (任意): string - 支店名（255文字以内）
partner_id / partner_code で支払先を指定した場合は無視され、取引先の振込先口座の値が採用されます。 例: `銀座支店`
- branch_kana (任意): string - 支店名（カナ）（15文字以内）
指定可能な文字は、英数・カナ・丸括弧・ハイフン・スペースのみです。
partner_id / partner_code で支払先を指定した場合は無視され、取引先の振込先口座の値が採用されます。 例: `ギンザシテン`
- account_name (任意): string - 受取人名（カナ）（48文字以内）
partner_id / partner_code で支払先を指定した場合は無視され、取引先の振込先口座の値が採用されます。 例: `フリータロウ`
- account_number (任意): string - 口座番号（半角数字1桁〜7桁）
partner_id / partner_code で支払先を指定した場合は無視され、取引先の振込先口座の値が採用されます。 例: `1010101`
- account_type (任意): string - 口座種別（デフォルトは `ordinary`）
* `ordinary` - 普通
* `checking` - 当座
* `earmarked` - 納税準備預金
* `savings` - 貯蓄
* `other` - その他

partner_id / partner_code で支払先を指定した場合は無視され、取引先の振込先口座の値が採用されます。 (選択肢: ordinary, checking, earmarked, savings, other) 例: `ordinary`
- qualified_invoice_status (任意): string - 適格請求書発行事業者の区分（キーを省略した場合は `unspecified` が適用されます）
* `qualified` - 該当する
* `not_qualified` - 該当しない
* `unspecified` - 未選択

支払依頼をインボイス要件をみたす申請として扱うかどうかを表します。
以下の場合は `unspecified` 以外を指定できません:
- issue_date が 2023年9月30日以前の場合
- 事業所側のインボイス経過措置の税区分の設定が「使用する」になっていない場合 (選択肢: qualified, not_qualified, unspecified) 例: `qualified`

### レスポンス (201)

- payment_request (必須): object
  - id (必須): integer(int64) - 支払依頼ID 例: `1` (最小: 1)
  - company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)
  - title (必須): string - 申請タイトル 例: `仕入代金支払い`
  - application_date (必須): string - 申請日 (yyyy-mm-dd) 例: `2019-12-17`
  - description (必須): string - 備考。未入力の場合は空文字列になります。 例: `◯◯連携先ID: cx12345`
  - total_amount (必須): integer(int64) - 合計金額（円、税込）
通常取引行 (deal_line) の合計金額から控除・マイナス行 (negative_line) と源泉所得税行 (withholding_tax) の合計金額を差し引いた値です。 例: `30000`
  - status (必須): string - 申請ステータス
* `draft` - 下書き
* `in_progress` - 申請中
* `approved` - 承認済
* `rejected` - 却下
* `feedback` - 差戻し (選択肢: draft, in_progress, approved, rejected, feedback) 例: `draft`
  - payment_request_lines (必須): array[object] - 支払依頼の項目行一覧（配列）
  - deal_id (必須): integer(int64) - 取引ID
申請ステータス (status) が `approved` (承認済) で、支払依頼から作成された取引が存在する場合のみ値が入ります。
それ以外の場合は null になります。 例: `1` (最小: 1)
  - deal_status (必須): string - 取引ステータス
* `settled` - 支払済み
* `unsettled` - 支払待ち

申請ステータス (status) が `approved` (承認済) で、支払依頼から作成された取引が存在する場合のみ値が入ります。
それ以外の場合は null になります。 (選択肢: settled, unsettled) 例: `settled`
  - applicant_id (必須): integer(int64) - 申請者のユーザーID（`/api/1/users` のレスポンス id と同じ値） 例: `1` (最小: 1)
  - approvers (必須): array[object] - 承認者（配列）
  承認ステップのresource_typeがunspecified (指定なし)の場合はapproversはレスポンスに含まれません。
  しかし、resource_typeがunspecifiedの承認ステップにおいて誰かが承認・却下・差し戻しのいずれかのアクションを取った後は、
  approversはレスポンスに含まれるようになります。
  その場合approversにはアクションを行ったステップのIDとアクションを行ったユーザーのIDが含まれます。
  - application_number (必須): string - 申請No.（事業所内で申請単位に自動採番される番号） 例: `2`
  - approval_flow_route_id (必須): integer(int64) - 申請経路ID（`/api/1/approval_flow_routes` のレスポンス id と同じ値） 例: `1` (最小: 1)
  - comments (必須): array[object] - 支払依頼のコメント一覧（配列）。コメントが登録された順に並びます。
  - approval_flow_logs (必須): array[object] - 支払依頼の承認履歴（配列）。承認操作が行われた順に並びます。
  - current_step_id (必須): integer(int64) - 現在の承認ステップID（承認操作 API `POST /api/1/payment_requests/{id}/actions` の target_step_id に指定します）
下書き・差戻し状態の場合は null になります。 例: `1` (最小: 1)
  - current_round (必須): integer(int64) - 現在の round（承認操作 API `POST /api/1/payment_requests/{id}/actions` の target_round に指定します）
差戻し等により申請が step の最初からやり直しになると round の値が増えます。 例: `1` (最小: 0, 最大: 2147483647)
  - parent_id (任意): integer(int64) - 親申請ID。
各種申請または購買申請が使用可能なプランの事業所でのみレスポンスに含まれる（キー自体が存在しない場合がある）。
関連付けが解除されている場合や親申請が未設定の場合は null。 例: `2` (最小: 1)
  - parent_type (任意): string - 親申請の種別。parent_id とペアで返却される。
* `ApprovalRequest` - 各種申請
* `PurchaseRequest` - 購買申請

各種申請または購買申請が使用可能なプランの事業所でのみレスポンスに含まれる（キー自体が存在しない場合がある）。
関連付けが解除されている場合や親申請が未設定の場合は null。 (選択肢: ApprovalRequest, PurchaseRequest) 例: `ApprovalRequest`
  - document_code (必須): string - 請求書番号。未設定の場合は空文字列になります。 例: `2`
  - receipt_ids (必須): array[integer] - ファイルボックス（証憑ファイル）ID の配列
添付されているファイルボックスの ID を返します。添付が無い場合は空配列になります。 例: `[1,2,3]`
  - issue_date (必須): string - 発生日 (yyyy-mm-dd) 例: `2019-12-17`
  - payment_date (必須): string - 支払期限 (yyyy-mm-dd)。指定されていない場合は null になります。 例: `2019-12-17`
  - payment_method (必須): string - 支払方法
* `none` - 指定なし
* `domestic_bank_transfer` - 国内振込
* `abroad_bank_transfer` - 国外振込
* `account_transfer` - 口座振替
* `credit_card` - クレジットカード (選択肢: none, domestic_bank_transfer, abroad_bank_transfer, account_transfer, credit_card) 例: `none`
  - partner_id (必須): integer(int64) - 取引先ID（取引先が指定されていない支払依頼の場合は null になります） 例: `201` (最小: 1)
  - partner_code (任意): string - 取引先コード
取引先コードが設定されていない場合、および事業所が取引先コードを利用していない場合は null になります。 例: `code001`
  - partner_name (必須): string - 取引先名（取引先が指定されていない支払依頼の場合は null になります） 例: `freee`
  - bank_name (必須): string - 銀行名。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `freee銀行`
  - bank_name_kana (必須): string - 銀行名（カナ）。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `フリーギンコウ`
  - bank_code (必須): string - 銀行コード。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `0001`
  - branch_name (必須): string - 支店名。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `銀座支店`
  - branch_kana (必須): string - 支店名（カナ）。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `ギンザシテン`
  - branch_code (必須): string - 支店番号。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `101`
  - account_type (必須): string - 口座種別
* `ordinary` - 普通
* `checking` - 当座
* `earmarked` - 納税準備預金
* `savings` - 貯蓄
* `other` - その他 (選択肢: ordinary, checking, earmarked, savings, other) 例: `ordinary`
  - account_number (必須): string - 口座番号。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `1010101`
  - account_name (必須): string - 受取人名（カナ）。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `フリータロウ`
  - qualified_invoice_status (任意): string - 適格請求書発行事業者の区分
* `qualified` - 該当する
* `not_qualified` - 該当しない
* `unspecified` - 未選択

支払依頼をインボイス要件をみたす申請として扱うかどうかを表します。 (選択肢: qualified, not_qualified, unspecified) 例: `qualified`

### GET /api/1/payment_requests/{id}

操作: 支払依頼の取得

説明: 概要 指定した事業所の支払依頼を取得する 支払依頼APIの使い方については、freee会計支払依頼APIの使い方をご参照ください

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 支払依頼ID |
| company_id | query | はい | integer(int64) | 事業所ID |

### レスポンス (200)

- payment_request (必須): object
  - id (必須): integer(int64) - 支払依頼ID 例: `1` (最小: 1)
  - company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)
  - title (必須): string - 申請タイトル 例: `仕入代金支払い`
  - application_date (必須): string - 申請日 (yyyy-mm-dd) 例: `2019-12-17`
  - description (必須): string - 備考。未入力の場合は空文字列になります。 例: `◯◯連携先ID: cx12345`
  - total_amount (必須): integer(int64) - 合計金額（円、税込）
通常取引行 (deal_line) の合計金額から控除・マイナス行 (negative_line) と源泉所得税行 (withholding_tax) の合計金額を差し引いた値です。 例: `30000`
  - status (必須): string - 申請ステータス
* `draft` - 下書き
* `in_progress` - 申請中
* `approved` - 承認済
* `rejected` - 却下
* `feedback` - 差戻し (選択肢: draft, in_progress, approved, rejected, feedback) 例: `draft`
  - payment_request_lines (必須): array[object] - 支払依頼の項目行一覧（配列）
  - deal_id (必須): integer(int64) - 取引ID
申請ステータス (status) が `approved` (承認済) で、支払依頼から作成された取引が存在する場合のみ値が入ります。
それ以外の場合は null になります。 例: `1` (最小: 1)
  - deal_status (必須): string - 取引ステータス
* `settled` - 支払済み
* `unsettled` - 支払待ち

申請ステータス (status) が `approved` (承認済) で、支払依頼から作成された取引が存在する場合のみ値が入ります。
それ以外の場合は null になります。 (選択肢: settled, unsettled) 例: `settled`
  - applicant_id (必須): integer(int64) - 申請者のユーザーID（`/api/1/users` のレスポンス id と同じ値） 例: `1` (最小: 1)
  - approvers (必須): array[object] - 承認者（配列）
  承認ステップのresource_typeがunspecified (指定なし)の場合はapproversはレスポンスに含まれません。
  しかし、resource_typeがunspecifiedの承認ステップにおいて誰かが承認・却下・差し戻しのいずれかのアクションを取った後は、
  approversはレスポンスに含まれるようになります。
  その場合approversにはアクションを行ったステップのIDとアクションを行ったユーザーのIDが含まれます。
  - application_number (必須): string - 申請No.（事業所内で申請単位に自動採番される番号） 例: `2`
  - approval_flow_route_id (必須): integer(int64) - 申請経路ID（`/api/1/approval_flow_routes` のレスポンス id と同じ値） 例: `1` (最小: 1)
  - comments (必須): array[object] - 支払依頼のコメント一覧（配列）。コメントが登録された順に並びます。
  - approval_flow_logs (必須): array[object] - 支払依頼の承認履歴（配列）。承認操作が行われた順に並びます。
  - current_step_id (必須): integer(int64) - 現在の承認ステップID（承認操作 API `POST /api/1/payment_requests/{id}/actions` の target_step_id に指定します）
下書き・差戻し状態の場合は null になります。 例: `1` (最小: 1)
  - current_round (必須): integer(int64) - 現在の round（承認操作 API `POST /api/1/payment_requests/{id}/actions` の target_round に指定します）
差戻し等により申請が step の最初からやり直しになると round の値が増えます。 例: `1` (最小: 0, 最大: 2147483647)
  - parent_id (任意): integer(int64) - 親申請ID。
各種申請または購買申請が使用可能なプランの事業所でのみレスポンスに含まれる（キー自体が存在しない場合がある）。
関連付けが解除されている場合や親申請が未設定の場合は null。 例: `2` (最小: 1)
  - parent_type (任意): string - 親申請の種別。parent_id とペアで返却される。
* `ApprovalRequest` - 各種申請
* `PurchaseRequest` - 購買申請

各種申請または購買申請が使用可能なプランの事業所でのみレスポンスに含まれる（キー自体が存在しない場合がある）。
関連付けが解除されている場合や親申請が未設定の場合は null。 (選択肢: ApprovalRequest, PurchaseRequest) 例: `ApprovalRequest`
  - document_code (必須): string - 請求書番号。未設定の場合は空文字列になります。 例: `2`
  - receipt_ids (必須): array[integer] - ファイルボックス（証憑ファイル）ID の配列
添付されているファイルボックスの ID を返します。添付が無い場合は空配列になります。 例: `[1,2,3]`
  - issue_date (必須): string - 発生日 (yyyy-mm-dd) 例: `2019-12-17`
  - payment_date (必須): string - 支払期限 (yyyy-mm-dd)。指定されていない場合は null になります。 例: `2019-12-17`
  - payment_method (必須): string - 支払方法
* `none` - 指定なし
* `domestic_bank_transfer` - 国内振込
* `abroad_bank_transfer` - 国外振込
* `account_transfer` - 口座振替
* `credit_card` - クレジットカード (選択肢: none, domestic_bank_transfer, abroad_bank_transfer, account_transfer, credit_card) 例: `none`
  - partner_id (必須): integer(int64) - 取引先ID（取引先が指定されていない支払依頼の場合は null になります） 例: `201` (最小: 1)
  - partner_code (任意): string - 取引先コード
取引先コードが設定されていない場合、および事業所が取引先コードを利用していない場合は null になります。 例: `code001`
  - partner_name (必須): string - 取引先名（取引先が指定されていない支払依頼の場合は null になります） 例: `freee`
  - bank_name (必須): string - 銀行名。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `freee銀行`
  - bank_name_kana (必須): string - 銀行名（カナ）。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `フリーギンコウ`
  - bank_code (必須): string - 銀行コード。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `0001`
  - branch_name (必須): string - 支店名。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `銀座支店`
  - branch_kana (必須): string - 支店名（カナ）。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `ギンザシテン`
  - branch_code (必須): string - 支店番号。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `101`
  - account_type (必須): string - 口座種別
* `ordinary` - 普通
* `checking` - 当座
* `earmarked` - 納税準備預金
* `savings` - 貯蓄
* `other` - その他 (選択肢: ordinary, checking, earmarked, savings, other) 例: `ordinary`
  - account_number (必須): string - 口座番号。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `1010101`
  - account_name (必須): string - 受取人名（カナ）。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `フリータロウ`
  - qualified_invoice_status (任意): string - 適格請求書発行事業者の区分
* `qualified` - 該当する
* `not_qualified` - 該当しない
* `unspecified` - 未選択

支払依頼をインボイス要件をみたす申請として扱うかどうかを表します。 (選択肢: qualified, not_qualified, unspecified) 例: `qualified`

### PUT /api/1/payment_requests/{id}

操作: 支払依頼の更新

説明: 概要 指定した事業所の支払依頼を更新する 支払依頼APIの使い方については、freee会計支払依頼APIの使い方をご参照ください 注意点 本APIでは、支払依頼を更新することができます。 本APIでは、status(申請ステータス): draft:下書き, in_progress:申請中, feedback:差戻しのみ更新可能です。 申請ステータス(下書き、申請中)の指定と変更、及び承認操作（承認する、却下する、申請者へ差し戻す、特権承認する、承認済み・却下済みを取り消す）は以下を参考にして行ってください。 承認操作は申請ステータスが申請中、承認済み、却下のものだけが対象です。 初回申請の場合 申請の作成（POST） 作成済みの申請の申請ステータス変更・更新する場合 申請の更新（PUT） 申請中、承認済み、却下の申請の承認操作を行う場合 承認操作の実行（POST） 申請の削除（DELETE）が可能なのは申請ステータスが下書き、差戻しの場合のみです 承認者の指定に部門役職データ連携を活用した、以下のいずれかの承認ステップを含む申請経路にも対応しています。 役職指定（申請者の所属部門） 役...

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 支払依頼ID |

### リクエストボディ

- company_id (必須): integer(int64) - 事業所ID 例: `1`
- title (必須): string - 申請タイトル（250文字以内）
申請中 (in_progress) の支払依頼に対しては更新できません。下書き状態もしくは差戻し状態の場合のみ有効です。 例: `仕入代金支払い`
- application_date (任意): string - 申請日 (yyyy-mm-dd)
指定しない場合は当日の日付が登録されます。
申請中 (in_progress) の支払依頼に対しては更新できません。下書き状態もしくは差戻し状態の場合のみ有効です。 例: `2019-12-17`
- description (任意): string - 備考。未指定の場合は空文字列で登録されます。 例: `◯◯連携先ID: cx12345`
- payment_request_lines (必須): array[object] - 支払依頼の項目行一覧（配列）。最大100行までです。
通常行 (line_type=`deal_line`) を最低1行含める必要があり、控除・マイナス行 (`negative_line`) や源泉所得税行 (`withholding_tax`) だけで構成することはできません。
申請中 (draft=false) で更新する場合は、通常行の合計金額が控除・マイナス行と源泉所得税行の合計金額より大きい必要があります。
  配列の要素:
    - id (任意): integer(int64) - 支払依頼の項目行ID
既存項目行を更新する場合に指定します。ID を指定しない項目行は新規行として追加されます。
payment_request_lines に含まれない既存の項目行は削除されます。更新後も残したい行は、必ず支払依頼の項目行 ID を指定して payment_request_lines に含めてください。 例: `1` (最小: 1)
    - line_type (任意): string - 行の種類（デフォルトは `deal_line`）
* `deal_line` - 支払依頼の通常取引行
* `negative_line` - 支払依頼の控除・マイナス行
* `withholding_tax` - 源泉所得税行（1件のみ指定可能） (選択肢: deal_line, negative_line, withholding_tax) 例: `deal_line`
    - description (任意): string - 内容 例: `原稿料`
    - amount (必須): integer(int64) - 金額（円、税込）。申請中 (draft=false) で更新する場合は0より大きい値を指定してください。 例: `30000` (最小: 0, 最大: 99999999999)
    - account_item_id (任意): integer(int64) - 勘定科目ID（`/api/1/account_items` のレスポンス id で取得できます） 例: `1` (最小: 1)
    - tax_code (任意): integer(int64) - 税区分コード
勘定科目IDを指定する場合は必須です。税区分コードは `/api/1/taxes/codes` で取得できます。 例: `1` (最小: 0, 最大: 2147483647)
    - item_id (任意): integer(int64) - 品目ID（`/api/1/items` のレスポンス id で取得できます） 例: `1` (最小: 1)
    - section_id (任意): integer(int64) - 部門ID（`/api/1/sections` のレスポンス id で取得できます） 例: `1` (最小: 1)
    - tag_ids (任意): array[integer] - メモタグID の配列（`/api/1/tags` のレスポンス id で取得できます） 例: `[1,2,3]`
    - segment_1_tag_id (任意): integer(int64) - セグメント１タグID
セグメントタグ一覧API (`/api/1/segments/{segment_id}/tags`) で取得できます。
事業所側でセグメント１が利用可能なプラン契約になっている必要があります。
<a href="https://support.freee.co.jp/hc/ja/articles/360020679611" target="_blank">セグメント（分析用タグ）の設定</a> 例: `1` (最小: 1)
    - segment_2_tag_id (任意): integer(int64) - セグメント２タグID
セグメントタグ一覧API (`/api/1/segments/{segment_id}/tags`) で取得できます。
事業所側でセグメント２が利用可能なプラン契約になっている必要があります。
<a href="https://support.freee.co.jp/hc/ja/articles/360020679611" target="_blank">セグメント（分析用タグ）の設定</a> 例: `1` (最小: 1)
    - segment_3_tag_id (任意): integer(int64) - セグメント３タグID
セグメントタグ一覧API (`/api/1/segments/{segment_id}/tags`) で取得できます。
事業所側でセグメント３が利用可能なプラン契約になっている必要があります。
<a href="https://support.freee.co.jp/hc/ja/articles/360020679611" target="_blank">セグメント（分析用タグ）の設定</a> 例: `1` (最小: 1)
- approver_id (任意): integer(int64) - 承認者のユーザーID
「承認者を指定」の申請経路 (resource_type: `selected_user`) を利用する場合に指定してください。
指定する承認者のユーザーIDは、申請経路取得API (`/api/1/approval_flow_routes`) のレスポンス steps[].users_ids から取得できます。
申請中 (in_progress) の支払依頼に対しては更新できません。下書き状態もしくは差戻し状態の場合のみ有効です。 例: `1` (最小: 1)
- approval_flow_route_id (必須): integer(int64) - 申請経路ID
指定する申請経路IDは、申請経路一覧API (`/api/1/approval_flow_routes`) のレスポンス id から取得してください。
usages に `PaymentRequest` を含む申請経路のみ利用可能です。
申請中 (in_progress) の支払依頼に対しては更新できません。下書き状態もしくは差戻し状態の場合のみ有効です。 例: `1` (最小: 1)
- applicant_group_id (任意): integer(int64) - 申請者の所属部門ID<br>
「部門役職」の承認ステップを含む申請経路で、申請者がどの所属部門として申請するかを指定します。<br>
<ul>
  <li>申請者が複数の部門に所属している場合は必須です。省略すると400エラーになります。</li>
  <li>申請者の所属部門が1つだけの場合は、省略するとその部門が採用されます。</li>
</ul>
 例: `1` (最小: 1)
- approval_flow_group_id (任意): integer(int64) - 申請経路の承認部門ID<br>
1段階目の承認ステップが部門選択型の場合に、承認させる部門を指定してください。
 例: `1` (最小: 1)
- parent_id (任意): integer(int64) - 親申請ID
法人エンタープライズプラン、法人アドバンスプラン（および旧法人プロフェッショナルプラン）で利用できます。
承認済みの既存各種申請IDまたは購買申請IDのみ指定可能です（各種申請一覧API `/api/1/approval_requests`、購買申請一覧API `/api/1/purchase_requests` で取得できます）。
* 親申請の種別を購買申請にする場合は parent_type に `PurchaseRequest` を指定してください。
* `null` を指定すると、現在設定されている親申請との関連付けを解除します。
* キーを指定しない場合、親申請は更新されません。
* 親申請の更新には、申請フォームの設定で申請者（申請中の場合は承認者）による親申請の変更が許可されている必要があります。 例: `2` (最小: 1)
- parent_type (任意): string - 親申請の種別（parent_id を指定した場合のみ有効）
* `ApprovalRequest` - 各種申請（parent_type 未指定時のデフォルト）
* `PurchaseRequest` - 購買申請

上記以外の値を指定するとバリデーションエラーになります。 (選択肢: ApprovalRequest, PurchaseRequest) 例: `ApprovalRequest`
- draft (必須): boolean - 支払依頼のステータス
* `true` - 下書き (draft) で支払依頼を更新します
* `false` - 申請中 (in_progress) で支払依頼を更新します 例: `true`
- document_code (任意): string - 請求書番号（255文字以内） 例: `2`
- receipt_ids (任意): array[integer] - ファイルボックス（証憑ファイル）ID の配列（`/api/1/receipts` で取得できます）
- issue_date (必須): string - 発生日 (yyyy-mm-dd) 例: `2019-12-17`
- payment_date (任意): string - 支払期限 (yyyy-mm-dd)。指定しない場合は null で登録されます。 例: `2019-12-17`
- payment_method (任意): string - 支払方法（デフォルトは `none`）
* `none` - 指定なし
* `domestic_bank_transfer` - 国内振込
* `abroad_bank_transfer` - 国外振込
* `account_transfer` - 口座振替
* `credit_card` - クレジットカード (選択肢: none, domestic_bank_transfer, abroad_bank_transfer, account_transfer, credit_card) 例: `none`
- partner_id (任意): integer(int64) - 支払先の取引先ID（`/api/1/partners` のレスポンス id で取得できます） 例: `201` (最小: 1)
- partner_code (任意): string - 支払先の取引先コード
partner_id と同時指定した場合は partner_id が優先され、partner_code は無視されます。
取引先コードを利用するには事業所側で「取引先コードを利用する」設定が有効になっている必要があります。 例: `code001`
- bank_code (任意): string - 銀行コード（半角数字1桁〜4桁）
partner_id / partner_code で支払先を指定した場合は無視され、取引先の振込先口座の値が採用されます。 例: `0001`
- bank_name (任意): string - 銀行名（255文字以内）
partner_id / partner_code で支払先を指定した場合は無視され、取引先の振込先口座の値が採用されます。 例: `freee銀行`
- bank_name_kana (任意): string - 銀行名（カナ）（15文字以内）
partner_id / partner_code で支払先を指定した場合は無視され、取引先の振込先口座の値が採用されます。 例: `フリーギンコウ`
- branch_code (任意): string - 支店番号（半角数字1桁〜3桁）
partner_id / partner_code で支払先を指定した場合は無視され、取引先の振込先口座の値が採用されます。 例: `101`
- branch_name (任意): string - 支店名（255文字以内）
partner_id / partner_code で支払先を指定した場合は無視され、取引先の振込先口座の値が採用されます。 例: `銀座支店`
- branch_kana (任意): string - 支店名（カナ）（15文字以内）
指定可能な文字は、英数・カナ・丸括弧・ハイフン・スペースのみです。
partner_id / partner_code で支払先を指定した場合は無視され、取引先の振込先口座の値が採用されます。 例: `ギンザシテン`
- account_name (任意): string - 受取人名（カナ）（48文字以内）
partner_id / partner_code で支払先を指定した場合は無視され、取引先の振込先口座の値が採用されます。 例: `フリータロウ`
- account_number (任意): string - 口座番号（半角数字1桁〜7桁）
partner_id / partner_code で支払先を指定した場合は無視され、取引先の振込先口座の値が採用されます。 例: `1010101`
- account_type (任意): string - 口座種別（デフォルトは `ordinary`）
* `ordinary` - 普通
* `checking` - 当座
* `earmarked` - 納税準備預金
* `savings` - 貯蓄
* `other` - その他

partner_id / partner_code で支払先を指定した場合は無視され、取引先の振込先口座の値が採用されます。 (選択肢: ordinary, checking, earmarked, savings, other) 例: `ordinary`
- qualified_invoice_status (任意): string - 適格請求書発行事業者の区分（キーを省略した場合は `unspecified` が適用されます）
* `qualified` - 該当する
* `not_qualified` - 該当しない
* `unspecified` - 未選択

支払依頼をインボイス要件をみたす申請として扱うかどうかを表します。
以下の場合は `unspecified` 以外を指定できません:
- issue_date が 2023年9月30日以前の場合
- 事業所側のインボイス経過措置の税区分の設定が「使用する」になっていない場合 (選択肢: qualified, not_qualified, unspecified) 例: `qualified`

### レスポンス (200)

- payment_request (必須): object
  - id (必須): integer(int64) - 支払依頼ID 例: `1` (最小: 1)
  - company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)
  - title (必須): string - 申請タイトル 例: `仕入代金支払い`
  - application_date (必須): string - 申請日 (yyyy-mm-dd) 例: `2019-12-17`
  - description (必須): string - 備考。未入力の場合は空文字列になります。 例: `◯◯連携先ID: cx12345`
  - total_amount (必須): integer(int64) - 合計金額（円、税込）
通常取引行 (deal_line) の合計金額から控除・マイナス行 (negative_line) と源泉所得税行 (withholding_tax) の合計金額を差し引いた値です。 例: `30000`
  - status (必須): string - 申請ステータス
* `draft` - 下書き
* `in_progress` - 申請中
* `approved` - 承認済
* `rejected` - 却下
* `feedback` - 差戻し (選択肢: draft, in_progress, approved, rejected, feedback) 例: `draft`
  - payment_request_lines (必須): array[object] - 支払依頼の項目行一覧（配列）
  - deal_id (必須): integer(int64) - 取引ID
申請ステータス (status) が `approved` (承認済) で、支払依頼から作成された取引が存在する場合のみ値が入ります。
それ以外の場合は null になります。 例: `1` (最小: 1)
  - deal_status (必須): string - 取引ステータス
* `settled` - 支払済み
* `unsettled` - 支払待ち

申請ステータス (status) が `approved` (承認済) で、支払依頼から作成された取引が存在する場合のみ値が入ります。
それ以外の場合は null になります。 (選択肢: settled, unsettled) 例: `settled`
  - applicant_id (必須): integer(int64) - 申請者のユーザーID（`/api/1/users` のレスポンス id と同じ値） 例: `1` (最小: 1)
  - approvers (必須): array[object] - 承認者（配列）
  承認ステップのresource_typeがunspecified (指定なし)の場合はapproversはレスポンスに含まれません。
  しかし、resource_typeがunspecifiedの承認ステップにおいて誰かが承認・却下・差し戻しのいずれかのアクションを取った後は、
  approversはレスポンスに含まれるようになります。
  その場合approversにはアクションを行ったステップのIDとアクションを行ったユーザーのIDが含まれます。
  - application_number (必須): string - 申請No.（事業所内で申請単位に自動採番される番号） 例: `2`
  - approval_flow_route_id (必須): integer(int64) - 申請経路ID（`/api/1/approval_flow_routes` のレスポンス id と同じ値） 例: `1` (最小: 1)
  - comments (必須): array[object] - 支払依頼のコメント一覧（配列）。コメントが登録された順に並びます。
  - approval_flow_logs (必須): array[object] - 支払依頼の承認履歴（配列）。承認操作が行われた順に並びます。
  - current_step_id (必須): integer(int64) - 現在の承認ステップID（承認操作 API `POST /api/1/payment_requests/{id}/actions` の target_step_id に指定します）
下書き・差戻し状態の場合は null になります。 例: `1` (最小: 1)
  - current_round (必須): integer(int64) - 現在の round（承認操作 API `POST /api/1/payment_requests/{id}/actions` の target_round に指定します）
差戻し等により申請が step の最初からやり直しになると round の値が増えます。 例: `1` (最小: 0, 最大: 2147483647)
  - parent_id (任意): integer(int64) - 親申請ID。
各種申請または購買申請が使用可能なプランの事業所でのみレスポンスに含まれる（キー自体が存在しない場合がある）。
関連付けが解除されている場合や親申請が未設定の場合は null。 例: `2` (最小: 1)
  - parent_type (任意): string - 親申請の種別。parent_id とペアで返却される。
* `ApprovalRequest` - 各種申請
* `PurchaseRequest` - 購買申請

各種申請または購買申請が使用可能なプランの事業所でのみレスポンスに含まれる（キー自体が存在しない場合がある）。
関連付けが解除されている場合や親申請が未設定の場合は null。 (選択肢: ApprovalRequest, PurchaseRequest) 例: `ApprovalRequest`
  - document_code (必須): string - 請求書番号。未設定の場合は空文字列になります。 例: `2`
  - receipt_ids (必須): array[integer] - ファイルボックス（証憑ファイル）ID の配列
添付されているファイルボックスの ID を返します。添付が無い場合は空配列になります。 例: `[1,2,3]`
  - issue_date (必須): string - 発生日 (yyyy-mm-dd) 例: `2019-12-17`
  - payment_date (必須): string - 支払期限 (yyyy-mm-dd)。指定されていない場合は null になります。 例: `2019-12-17`
  - payment_method (必須): string - 支払方法
* `none` - 指定なし
* `domestic_bank_transfer` - 国内振込
* `abroad_bank_transfer` - 国外振込
* `account_transfer` - 口座振替
* `credit_card` - クレジットカード (選択肢: none, domestic_bank_transfer, abroad_bank_transfer, account_transfer, credit_card) 例: `none`
  - partner_id (必須): integer(int64) - 取引先ID（取引先が指定されていない支払依頼の場合は null になります） 例: `201` (最小: 1)
  - partner_code (任意): string - 取引先コード
取引先コードが設定されていない場合、および事業所が取引先コードを利用していない場合は null になります。 例: `code001`
  - partner_name (必須): string - 取引先名（取引先が指定されていない支払依頼の場合は null になります） 例: `freee`
  - bank_name (必須): string - 銀行名。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `freee銀行`
  - bank_name_kana (必須): string - 銀行名（カナ）。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `フリーギンコウ`
  - bank_code (必須): string - 銀行コード。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `0001`
  - branch_name (必須): string - 支店名。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `銀座支店`
  - branch_kana (必須): string - 支店名（カナ）。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `ギンザシテン`
  - branch_code (必須): string - 支店番号。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `101`
  - account_type (必須): string - 口座種別
* `ordinary` - 普通
* `checking` - 当座
* `earmarked` - 納税準備預金
* `savings` - 貯蓄
* `other` - その他 (選択肢: ordinary, checking, earmarked, savings, other) 例: `ordinary`
  - account_number (必須): string - 口座番号。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `1010101`
  - account_name (必須): string - 受取人名（カナ）。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `フリータロウ`
  - qualified_invoice_status (任意): string - 適格請求書発行事業者の区分
* `qualified` - 該当する
* `not_qualified` - 該当しない
* `unspecified` - 未選択

支払依頼をインボイス要件をみたす申請として扱うかどうかを表します。 (選択肢: qualified, not_qualified, unspecified) 例: `qualified`

### DELETE /api/1/payment_requests/{id}

操作: 支払依頼の削除

説明: 概要 指定した事業所の支払依頼を削除する 支払依頼APIの使い方については、freee会計支払依頼APIの使い方をご参照ください 注意点 本APIでは、支払依頼の承認操作（承認する、却下する、申請者へ差し戻す、特権承認する、承認済み・却下済みを取り消す）を行うことができます。 申請ステータス(下書き、申請中)の指定と変更、及び承認操作（承認する、却下する、申請者へ差し戻す、特権承認する、承認済み・却下済みを取り消す）は以下を参考にして行ってください。 承認操作は申請ステータスが申請中、承認済み、却下のものだけが対象です。 初回申請の場合 申請の作成（POST） 作成済みの申請の申請ステータス変更・更新する場合 申請の更新（PUT） 申請中、承認済み、却下の申請の承認操作を行う場合 承認操作の実行（POST） 申請の削除（DELETE）が可能なのは申請ステータスが下書き、差戻しの場合のみです

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 支払依頼ID |
| company_id | query | はい | integer(int64) | 事業所ID |

### レスポンス (204)

### POST /api/1/payment_requests/{id}/actions

操作: 支払依頼の承認操作

説明: 概要 指定した事業所の支払依頼の承認操作を行う 支払依頼APIの使い方については、freee会計支払依頼APIの使い方をご参照ください 注意点 本APIでは、支払依頼の承認操作（承認する、却下する、申請者へ差し戻す、特権承認する、承認済み・却下済みを取り消す）を行うことができます。 申請ステータス(下書き、申請中)の指定と変更、及び承認操作（承認する、却下する、申請者へ差し戻す、特権承認する、承認済み・却下済みを取り消す）は以下を参考にして行ってください。 承認操作は申請ステータスが申請中、承認済み、却下のものだけが対象です。 初回申請の場合 申請の作成（POST） 作成済みの申請の申請ステータス変更・更新する場合 申請の更新（PUT） 申請中、承認済み、却下の申請の承認操作を行う場合 承認操作の実行（POST） 申請の削除（DELETE）が可能なのは申請ステータスが下書き、差戻しの場合のみです 承認者の指定に部門役職データ連携を活用した、以下のいずれかの承認ステップを含む申請経路にも対応しています。 役職指定（申請者の所属部門） 役職指定（申請時に部門指定） 部門および役職指定 次の...

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 支払依頼ID |

### リクエストボディ

(必須)

- company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)
- approval_action (必須): string - 承認操作
* `approve` - 承認する
* `force_approve` - 特権承認する
* `cancel` - 申請を取り消す
* `reject` - 却下する
* `feedback` - 申請者へ差し戻す
* `force_feedback` - 承認済み・却下済みを取り消す

承認操作は申請ステータスが `in_progress` (申請中) / `approved` (承認済) / `rejected` (却下) のもののみが対象です。 (選択肢: approve, force_approve, cancel, reject, feedback, force_feedback) 例: `approve`
- target_step_id (必須): integer(int64) - 対象承認ステップID。支払依頼の取得API (`GET /api/1/payment_requests/{id}`) のレスポンス current_step_id を送信してください。 例: `1` (最小: 1)
- target_round (必須): integer(int64) - 対象 round。支払依頼の取得API (`GET /api/1/payment_requests/{id}`) のレスポンス current_round を送信してください。
差し戻し等により申請が step の最初からやり直しになると round の値が増えます。 例: `1` (最小: 0, 最大: 2147483647)
- next_approver_id (任意): integer(int64) - 次ステップの承認者のユーザーID
次の承認ステップが「申請時にメンバー指定」(resource_type: `selected_user`) の場合に、承認させるユーザーを指定してください。
該当しない場合は null を指定するか省略できます。 例: `1` (最小: 1)
- next_group_id (任意): integer(int64) - 次ステップの承認部門ID<br>
次の承認ステップが部門選択型の場合に、承認させる部門を指定してください。
 例: `1` (最小: 1)

### レスポンス (201)

- payment_request (必須): object
  - id (必須): integer(int64) - 支払依頼ID 例: `1` (最小: 1)
  - company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)
  - title (必須): string - 申請タイトル 例: `仕入代金支払い`
  - application_date (必須): string - 申請日 (yyyy-mm-dd) 例: `2019-12-17`
  - description (必須): string - 備考。未入力の場合は空文字列になります。 例: `◯◯連携先ID: cx12345`
  - total_amount (必須): integer(int64) - 合計金額（円、税込）
通常取引行 (deal_line) の合計金額から控除・マイナス行 (negative_line) と源泉所得税行 (withholding_tax) の合計金額を差し引いた値です。 例: `30000`
  - status (必須): string - 申請ステータス
* `draft` - 下書き
* `in_progress` - 申請中
* `approved` - 承認済
* `rejected` - 却下
* `feedback` - 差戻し (選択肢: draft, in_progress, approved, rejected, feedback) 例: `draft`
  - payment_request_lines (必須): array[object] - 支払依頼の項目行一覧（配列）
  - deal_id (必須): integer(int64) - 取引ID
申請ステータス (status) が `approved` (承認済) で、支払依頼から作成された取引が存在する場合のみ値が入ります。
それ以外の場合は null になります。 例: `1` (最小: 1)
  - deal_status (必須): string - 取引ステータス
* `settled` - 支払済み
* `unsettled` - 支払待ち

申請ステータス (status) が `approved` (承認済) で、支払依頼から作成された取引が存在する場合のみ値が入ります。
それ以外の場合は null になります。 (選択肢: settled, unsettled) 例: `settled`
  - applicant_id (必須): integer(int64) - 申請者のユーザーID（`/api/1/users` のレスポンス id と同じ値） 例: `1` (最小: 1)
  - approvers (必須): array[object] - 承認者（配列）
  承認ステップのresource_typeがunspecified (指定なし)の場合はapproversはレスポンスに含まれません。
  しかし、resource_typeがunspecifiedの承認ステップにおいて誰かが承認・却下・差し戻しのいずれかのアクションを取った後は、
  approversはレスポンスに含まれるようになります。
  その場合approversにはアクションを行ったステップのIDとアクションを行ったユーザーのIDが含まれます。
  - application_number (必須): string - 申請No.（事業所内で申請単位に自動採番される番号） 例: `2`
  - approval_flow_route_id (必須): integer(int64) - 申請経路ID（`/api/1/approval_flow_routes` のレスポンス id と同じ値） 例: `1` (最小: 1)
  - comments (必須): array[object] - 支払依頼のコメント一覧（配列）。コメントが登録された順に並びます。
  - approval_flow_logs (必須): array[object] - 支払依頼の承認履歴（配列）。承認操作が行われた順に並びます。
  - current_step_id (必須): integer(int64) - 現在の承認ステップID（承認操作 API `POST /api/1/payment_requests/{id}/actions` の target_step_id に指定します）
下書き・差戻し状態の場合は null になります。 例: `1` (最小: 1)
  - current_round (必須): integer(int64) - 現在の round（承認操作 API `POST /api/1/payment_requests/{id}/actions` の target_round に指定します）
差戻し等により申請が step の最初からやり直しになると round の値が増えます。 例: `1` (最小: 0, 最大: 2147483647)
  - parent_id (任意): integer(int64) - 親申請ID。
各種申請または購買申請が使用可能なプランの事業所でのみレスポンスに含まれる（キー自体が存在しない場合がある）。
関連付けが解除されている場合や親申請が未設定の場合は null。 例: `2` (最小: 1)
  - parent_type (任意): string - 親申請の種別。parent_id とペアで返却される。
* `ApprovalRequest` - 各種申請
* `PurchaseRequest` - 購買申請

各種申請または購買申請が使用可能なプランの事業所でのみレスポンスに含まれる（キー自体が存在しない場合がある）。
関連付けが解除されている場合や親申請が未設定の場合は null。 (選択肢: ApprovalRequest, PurchaseRequest) 例: `ApprovalRequest`
  - document_code (必須): string - 請求書番号。未設定の場合は空文字列になります。 例: `2`
  - receipt_ids (必須): array[integer] - ファイルボックス（証憑ファイル）ID の配列
添付されているファイルボックスの ID を返します。添付が無い場合は空配列になります。 例: `[1,2,3]`
  - issue_date (必須): string - 発生日 (yyyy-mm-dd) 例: `2019-12-17`
  - payment_date (必須): string - 支払期限 (yyyy-mm-dd)。指定されていない場合は null になります。 例: `2019-12-17`
  - payment_method (必須): string - 支払方法
* `none` - 指定なし
* `domestic_bank_transfer` - 国内振込
* `abroad_bank_transfer` - 国外振込
* `account_transfer` - 口座振替
* `credit_card` - クレジットカード (選択肢: none, domestic_bank_transfer, abroad_bank_transfer, account_transfer, credit_card) 例: `none`
  - partner_id (必須): integer(int64) - 取引先ID（取引先が指定されていない支払依頼の場合は null になります） 例: `201` (最小: 1)
  - partner_code (任意): string - 取引先コード
取引先コードが設定されていない場合、および事業所が取引先コードを利用していない場合は null になります。 例: `code001`
  - partner_name (必須): string - 取引先名（取引先が指定されていない支払依頼の場合は null になります） 例: `freee`
  - bank_name (必須): string - 銀行名。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `freee銀行`
  - bank_name_kana (必須): string - 銀行名（カナ）。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `フリーギンコウ`
  - bank_code (必須): string - 銀行コード。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `0001`
  - branch_name (必須): string - 支店名。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `銀座支店`
  - branch_kana (必須): string - 支店名（カナ）。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `ギンザシテン`
  - branch_code (必須): string - 支店番号。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `101`
  - account_type (必須): string - 口座種別
* `ordinary` - 普通
* `checking` - 当座
* `earmarked` - 納税準備預金
* `savings` - 貯蓄
* `other` - その他 (選択肢: ordinary, checking, earmarked, savings, other) 例: `ordinary`
  - account_number (必須): string - 口座番号。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `1010101`
  - account_name (必須): string - 受取人名（カナ）。支払先の取引先が指定されている場合は取引先の振込先口座から引用されます。未設定の場合は空文字列になります。 例: `フリータロウ`
  - qualified_invoice_status (任意): string - 適格請求書発行事業者の区分
* `qualified` - 該当する
* `not_qualified` - 該当しない
* `unspecified` - 未選択

支払依頼をインボイス要件をみたす申請として扱うかどうかを表します。 (選択肢: qualified, not_qualified, unspecified) 例: `qualified`



## 参考情報

- freee API公式ドキュメント: https://developer.freee.co.jp/docs
- OpenAPIスキーマ: [accounting-api-schema.json](../../openapi/accounting-api-schema.json)
